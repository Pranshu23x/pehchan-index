'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { formatNumber } from '@/lib/aadhaarDataService';

const STATE_NAME_MAP = {
  'Andaman and Nicobar': 'Andaman and Nicobar',
  'Andhra Pradesh': 'Andhra Pradesh',
  'Arunachal Pradesh': 'Arunachal Pradesh',
  'Assam': 'Assam',
  'Bihar': 'Bihar',
  'Chandigarh': 'Chandigarh',
  'Chhattisgarh': 'Chhattisgarh',
  'Dadra and Nagar Haveli': 'Dadra and Nagar Haveli',
  'Daman and Diu': 'Daman and Diu',
  'Delhi': 'Delhi',
  'NCT of Delhi': 'Delhi',
  'Goa': 'Goa',
  'Gujarat': 'Gujarat',
  'Haryana': 'Haryana',
  'Himachal Pradesh': 'Himachal Pradesh',
  'Jammu and Kashmir': 'Jammu and Kashmir',
  'Jharkhand': 'Jharkhand',
  'Karnataka': 'Karnataka',
  'Kerala': 'Kerala',
  'Lakshadweep': 'Lakshadweep',
  'Madhya Pradesh': 'Madhya Pradesh',
  'Maharashtra': 'Maharashtra',
  'Manipur': 'Manipur',
  'Meghalaya': 'Meghalaya',
  'Mizoram': 'Mizoram',
  'Nagaland': 'Nagaland',
  'Odisha': 'Odisha',
  'Orissa': 'Odisha',
  'Puducherry': 'Puducherry',
  'Punjab': 'Punjab',
  'Rajasthan': 'Rajasthan',
  'Sikkim': 'Sikkim',
  'Tamil Nadu': 'Tamil Nadu',
  'Telangana': 'Telangana',
  'Tripura': 'Tripura',
  'Uttar Pradesh': 'Uttar Pradesh',
  'Uttarakhand': 'Uttarakhand',
  'Uttaranchal': 'Uttarakhand',
  'West Bengal': 'West Bengal',
  'Ladakh': 'Ladakh',
};

function projectPoint(lon, lat, width, height) {
  const minLon = 68;
  const maxLon = 98;
  const minLat = 6;
  const maxLat = 38;
  
  const padding = 15;
  const effectiveWidth = width - padding * 2;
  const effectiveHeight = height - padding * 2;
  
  const x = padding + ((lon - minLon) / (maxLon - minLon)) * effectiveWidth;
  const y = padding + effectiveHeight - ((lat - minLat) / (maxLat - minLat)) * effectiveHeight;
  
  return [x, y];
}

function createPath(coordinates, width, height) {
  if (!coordinates || coordinates.length === 0) return '';
  
  const isMultiRing = Array.isArray(coordinates[0]) && Array.isArray(coordinates[0][0]);
  
  if (isMultiRing) {
    return coordinates.map(ring => {
      if (!ring || ring.length === 0) return '';
      return ring.map((point, i) => {
        const [x, y] = projectPoint(point[0], point[1], width, height);
        return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
      }).join(' ') + ' Z';
    }).join(' ');
  }
  
  return coordinates.map((point, i) => {
    const [x, y] = projectPoint(point[0], point[1], width, height);
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ') + ' Z';
}

function featureToPath(feature, width, height) {
  const { geometry } = feature;
  
  if (geometry.type === 'Polygon') {
    return createPath(geometry.coordinates, width, height);
  }
  
  if (geometry.type === 'MultiPolygon') {
    return geometry.coordinates.map(polygon => 
      createPath(polygon, width, height)
    ).join(' ');
  }
  
  return '';
}

export function MapTooltip({ state, month }) {
  return (
    <AnimatePresence>
      {state && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.15 }}
          className="absolute top-4 right-4 bg-white border border-[#E5E7EB] rounded-lg shadow-sm p-4 min-w-[220px] z-10"
        >
          <h4 className="font-semibold text-[#0F172A] text-sm">{state.state}</h4>
          <p className="text-xs text-[#64748B] mb-3">{month}</p>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#64748B]">Total Updates</span>
              <span className="font-semibold text-[#0F172A]">{formatNumber(state.totalUpdates)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#64748B]">Dominant Group</span>
              <span className="text-xs font-medium text-[#0F172A]">{state.dominantAgeGroup}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#64748B]">Intensity</span>
              <span className={`text-xs font-medium capitalize px-2 py-0.5 rounded ${
                state.intensity === 'high' 
                  ? 'bg-[#D97706]/10 text-[#D97706]'
                  : state.intensity === 'medium'
                  ? 'bg-[#1E3A8A]/10 text-[#1E3A8A]'
                  : 'bg-[#15803D]/10 text-[#15803D]'
              }`}>
                {state.intensity === 'high' ? 'Above Normal' : state.intensity === 'medium' ? 'Moderate' : 'Normal'}
              </span>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t border-[#E5E7EB]">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-xs text-[#64748B]">0-5</div>
                <div className="text-sm font-medium text-[#0F172A]">{formatNumber(state.age0_5)}</div>
              </div>
              <div>
                <div className="text-xs text-[#64748B]">5-17</div>
                <div className="text-sm font-medium text-[#0F172A]">{formatNumber(state.age5_17)}</div>
              </div>
              <div>
                <div className="text-xs text-[#64748B]">18+</div>
                <div className="text-sm font-medium text-[#0F172A]">{formatNumber(state.age18Plus)}</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function GeographicActivityMap({ stateData, onStateHover, selectedState, onStateClick, selectedMonth }) {
  const [geoData, setGeoData] = useState(null);
  const [mapError, setMapError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const svgRef = useRef(null);
    
  const width = 400;
  const height = 480;

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    
    fetch('/india-states.json')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => setGeoData(data))
      .catch(err => {
        console.error('Failed to load map:', err);
        setMapError(err.message);
      });
  }, []);

  const stateDataMap = useMemo(() => {
    const map = new Map();
    stateData.forEach(s => map.set(s.state, s));
    return map;
  }, [stateData]);

  const getStateColor = (intensity) => {
    switch (intensity) {
      case 'high': return '#D97706';
      case 'medium': return '#1E3A8A';
      case 'low': 
      default: return '#15803D';
    }
  };

  const getStateOpacity = (stateName) => {
    if (!selectedState) return 1;
    return selectedState.state === stateName ? 1 : 0.4;
  };

const handleStateHover = (geoName) => {
      const normalizedName = STATE_NAME_MAP[geoName] || geoName;
      const data = stateDataMap.get(normalizedName);
      if (data) {
        onStateHover(data);
      }
    };

  const handleStateClick = (geoName) => {
    const normalizedName = STATE_NAME_MAP[geoName] || geoName;
    const data = stateDataMap.get(normalizedName);
    if (data && onStateClick) {
      onStateClick(data);
    }
  };

  if (mapError) {
    return (
      <div className="relative w-full aspect-[9/10] max-w-[450px] mx-auto flex items-center justify-center">
        <div className="text-[#B91C1C] text-sm">Error loading map: {mapError}</div>
      </div>
    );
  }

  if (!geoData) {
    return (
      <div className="relative w-full aspect-[9/10] max-w-[450px] mx-auto flex items-center justify-center">
        <div className="animate-pulse text-[#64748B] text-sm">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-[9/10] max-w-[450px] mx-auto">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full"
      >
        {geoData.features.map((feature, idx) => {
          const geoName = feature.properties.NAME_1;
          const normalizedName = STATE_NAME_MAP[geoName] || geoName;
          const data = stateDataMap.get(normalizedName);
          const isSelected = selectedState?.state === normalizedName;
          const pathD = featureToPath(feature, width, height);
          
          if (!pathD) return null;
          
if (isMobile) {
              return (
                <path
                  key={`${geoName}-${idx}`}
                  d={pathD}
                  fill={getStateColor(data?.intensity)}
                  stroke={isSelected ? '#0F172A' : '#FFFFFF'}
                  strokeWidth={isSelected ? 2 : 0.5}
                  opacity={getStateOpacity(normalizedName)}
                  className="cursor-pointer"
                  onTouchStart={() => handleStateHover(geoName)}
                  onTouchEnd={() => onStateHover(null)}
                  onClick={() => handleStateClick(geoName)}
                />
              );
            }
            
            return (
              <motion.path
                key={`${geoName}-${idx}`}
                d={pathD}
                fill={getStateColor(data?.intensity)}
                stroke={isSelected ? '#0F172A' : '#FFFFFF'}
                strokeWidth={isSelected ? 2 : 0.5}
                opacity={getStateOpacity(normalizedName)}
                className="cursor-pointer transition-colors duration-150"
                onMouseEnter={() => handleStateHover(geoName)}
                onMouseLeave={() => onStateHover(null)}
                onClick={() => handleStateClick(geoName)}
                initial={{ opacity: 0 }}
                animate={{ opacity: getStateOpacity(normalizedName) }}
                transition={{ duration: 0.3 }}
              />
            );
        })}
      </svg>

      <div className="absolute bottom-2 left-2 flex items-center gap-3 text-xs text-[#64748B] bg-white/95 px-3 py-2 rounded-md border border-[#E5E7EB]">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#15803D' }} />
          <span>Normal</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#1E3A8A' }} />
          <span>Moderate</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#D97706' }} />
          <span>Above Normal</span>
        </div>
      </div>
    </div>
  );
}
