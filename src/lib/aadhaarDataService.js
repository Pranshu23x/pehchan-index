function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function normalizeCase(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function parseCSV(csvText) {
  const lines = csvText.trim().split('\n');
  
  return lines.slice(1).map(line => {
    const values = parseCSVLine(line);
    return {
      Month: values[0],
      State: normalizeCase(values[1]),
      District: normalizeCase(values[2]),
      Age_0_5: parseInt(values[3], 10),
      Age_5_17: parseInt(values[4], 10),
      Age_18_plus: parseInt(values[5], 10),
    };
  });
}

export function getDominantAgeGroup(age0_5, age5_17, age18Plus) {
  const max = Math.max(age0_5, age5_17, age18Plus);
  if (max === age18Plus) return 'Adult (18+)';
  if (max === age5_17) return 'Youth (5-17)';
  return 'Child (0-5)';
}

export function calculateIntensity(value, values) {
  const sorted = [...values].sort((a, b) => a - b);
  const p33 = sorted[Math.floor(sorted.length * 0.33)];
  const p66 = sorted[Math.floor(sorted.length * 0.66)];
  
  if (value <= p33) return 'low';
  if (value <= p66) return 'medium';
  return 'high';
}

export function aggregateByState(records, month) {
  const filtered = records.filter(r => r.Month === month);
  const stateMap = new Map();

  filtered.forEach(record => {
    const total = record.Age_0_5 + record.Age_5_17 + record.Age_18_plus;
    const existing = stateMap.get(record.State) || {
      age0_5: 0,
      age5_17: 0,
      age18Plus: 0,
      districts: [],
    };

    existing.age0_5 += record.Age_0_5;
    existing.age5_17 += record.Age_5_17;
    existing.age18Plus += record.Age_18_plus;
    existing.districts.push({
      district: record.District,
      state: record.State,
      totalUpdates: total,
      age0_5: record.Age_0_5,
      age5_17: record.Age_5_17,
      age18Plus: record.Age_18_plus,
      dominantAgeGroup: getDominantAgeGroup(record.Age_0_5, record.Age_5_17, record.Age_18_plus),
      intensity: 'low',
    });

    stateMap.set(record.State, existing);
  });

  const states = Array.from(stateMap.entries()).map(([state, data]) => ({
    state,
    totalUpdates: data.age0_5 + data.age5_17 + data.age18Plus,
    age0_5: data.age0_5,
    age5_17: data.age5_17,
    age18Plus: data.age18Plus,
    districts: data.districts,
    dominantAgeGroup: getDominantAgeGroup(data.age0_5, data.age5_17, data.age18Plus),
    intensity: 'low',
  }));

  const totals = states.map(s => s.totalUpdates);
  const districtTotals = states.flatMap(s => s.districts.map(d => d.totalUpdates));

  states.forEach(state => {
    state.intensity = calculateIntensity(state.totalUpdates, totals);
    state.districts.forEach(district => {
      district.intensity = calculateIntensity(district.totalUpdates, districtTotals);
    });
  });

  return states.sort((a, b) => b.totalUpdates - a.totalUpdates);
}

export function getUniqueMonths(records) {
  const months = new Set(records.map(r => r.Month));
  return Array.from(months).sort().reverse();
}

export function getTopDistricts(states, limit = 5) {
  return states
    .flatMap(s => s.districts)
    .sort((a, b) => b.totalUpdates - a.totalUpdates)
    .slice(0, limit);
}

export function formatMonth(monthStr) {
  const [year, month] = monthStr.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export function formatNumber(num) {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}
