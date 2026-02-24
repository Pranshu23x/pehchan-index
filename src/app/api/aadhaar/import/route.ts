import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
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

export async function POST() {
  try {
    const csvPath = path.join(process.cwd(), 'public', 'data.csv');
    const csvText = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvText.trim().split('\n');
    
    const records = lines.slice(1).map(line => {
      const values = parseCSVLine(line);
      return {
        month: values[0],
        state: values[1],
        district: values[2],
        age_0_5: parseInt(values[3], 10) || 0,
        age_5_17: parseInt(values[4], 10) || 0,
        age_18_greater: parseInt(values[5], 10) || 0,
      };
    });

    const { count } = await supabase.from('aadhaar_updates').select('*', { count: 'exact', head: true });
    
    if (count && count > 0) {
      return NextResponse.json({ message: 'Data already imported', count });
    }

    const batchSize = 100;
    let inserted = 0;
    
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);
      const { error } = await supabase.from('aadhaar_updates').insert(batch);
      if (error) {
        return NextResponse.json({ error: error.message, inserted }, { status: 500 });
      }
      inserted += batch.length;
    }

    return NextResponse.json({ message: 'Import successful', inserted });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to import data' }, { status: 500 });
  }
}
