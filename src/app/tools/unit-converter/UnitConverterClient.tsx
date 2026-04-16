'use client';

import { useState, useMemo } from 'react';
import { Scale, Ruler, Thermometer, Zap, RefreshCcw, ArrowRightLeft, Layers, type LucideIcon } from 'lucide-react';
import ToolLayout from '@/components/ToolLayout';

type UnitCategory = 'length' | 'weight' | 'temperature' | 'energy';

interface Unit {
  label: string;
  value: string;
  factor?: number; // Relative to a base unit (e.g., meters)
}

const CATEGORIES: Record<UnitCategory, { icon: LucideIcon; units: Unit[] }> = {
  length: {
    icon: Ruler,
    units: [
      { label: 'Meters (m)', value: 'm', factor: 1 },
      { label: 'Kilometers (km)', value: 'km', factor: 1000 },
      { label: 'Centimeters (cm)', value: 'cm', factor: 0.01 },
      { label: 'Millimeters (mm)', value: 'mm', factor: 0.001 },
      { label: 'Inches (in)', value: 'in', factor: 0.0254 },
      { label: 'Feet (ft)', value: 'ft', factor: 0.3048 },
      { label: 'Yards (yd)', value: 'yd', factor: 0.9144 },
      { label: 'Miles (mi)', value: 'mi', factor: 1609.34 },
    ],
  },
  weight: {
    icon: Scale,
    units: [
      { label: 'Grams (g)', value: 'g', factor: 1 },
      { label: 'Kilograms (kg)', value: 'kg', factor: 1000 },
      { label: 'Milligrams (mg)', value: 'mg', factor: 0.001 },
      { label: 'Pounds (lb)', value: 'lb', factor: 453.592 },
      { label: 'Ounces (oz)', value: 'oz', factor: 28.3495 },
    ],
  },
  temperature: {
    icon: Thermometer,
    units: [
      { label: 'Celsius (°C)', value: 'c' },
      { label: 'Fahrenheit (°F)', value: 'f' },
      { label: 'Kelvin (K)', value: 'k' },
    ],
  },
  energy: {
    icon: Zap,
    units: [
      { label: 'Joules (J)', value: 'j', factor: 1 },
      { label: 'Kilojoules (kJ)', value: 'kj', factor: 1000 },
      { label: 'Calories (cal)', value: 'cal', factor: 4.184 },
      { label: 'Kilocalories (kcal)', value: 'kcal', factor: 4184 },
      { label: 'Watt-hours (Wh)', value: 'wh', factor: 3600 },
    ],
  },
};

export default function UnitConverterClient() {
  const [category, setCategory] = useState<UnitCategory>('length');
  const [value, setValue] = useState<number | ''>(1);
  const [fromUnit, setFromUnit] = useState<string>(CATEGORIES.length.units[0].value);
  const [toUnit, setToUnit] = useState<string>(CATEGORIES.length.units[1].value);

  const units = CATEGORIES[category].units;

  const handleCategoryChange = (cat: UnitCategory) => {
    setCategory(cat);
    setFromUnit(CATEGORIES[cat].units[0].value);
    setToUnit(CATEGORIES[cat].units[1].value);
  };

  const convertedValue = useMemo(() => {
    if (value === '') return 0;
    const v = Number(value);

    if (category === 'temperature') {
      if (fromUnit === toUnit) return v;
      let celsius = v;
      if (fromUnit === 'f') celsius = (v - 32) * 5 / 9;
      if (fromUnit === 'k') celsius = v - 273.15;

      if (toUnit === 'c') return celsius;
      if (toUnit === 'f') return (celsius * 9 / 5) + 32;
      if (toUnit === 'k') return celsius + 273.15;
      return celsius;
    }

    const fromFactor = units.find(u => u.value === fromUnit)?.factor || 1;
    const toFactor = units.find(u => u.value === toUnit)?.factor || 1;
    return (v * fromFactor) / toFactor;
  }, [value, fromUnit, toUnit, category, units]);

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  return (
    <ToolLayout
      title="Unit Converter"
      description="Professional-grade conversion tool for Length, Weight, Temperature, and Energy. Accurate, instant, and privacy-focused."
      icon={Layers}
      color="#f97316"
    >
      {/* CATEGORY SWITCHER */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {(Object.keys(CATEGORIES) as UnitCategory[]).map((cat) => {
          const Icon = CATEGORIES[cat].icon;
          return (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-sm font-bold transition-all border ${
                category === cat 
                ? 'bg-orange-600 border-orange-500 text-white shadow-lg shadow-orange-600/20 scale-105' 
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 ${category === cat ? 'text-white' : 'text-orange-500'}`} />
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          );
        })}
      </div>

      {/* CONVERTER CARD */}
      <div className="bg-[#111111] border border-zinc-800 rounded-3xl p-6 md:p-10 mb-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"></div>
        
        <div className="grid md:grid-cols-[1fr,auto,1fr] gap-8 items-center">
          
          {/* FROM */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label htmlFor="input-value" className="text-sm font-semibold text-zinc-500 uppercase tracking-widest">Input Value</label>
              <button aria-label="Reset value" onClick={() => setValue('')} className="text-zinc-600 hover:text-zinc-400 transition-colors">
                <RefreshCcw className="w-4 h-4" />
              </button>
            </div>
            <input
              id="input-value"
              aria-label="Input Value"
              type="number"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-5 px-6 text-3xl font-bold text-white focus:outline-none focus:border-orange-500 transition-all shadow-inner"
              value={value}
              onChange={(e) => setValue(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="0.00"
            />
            <select
              title="From unit"
              aria-label="Select source unit"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 text-sm font-medium text-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 appearance-none transition-all cursor-pointer hover:bg-zinc-700"
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
            >
              {units.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
            </select>
          </div>

          {/* SWAP BUTTON */}
          <div className="flex justify-center md:pt-12">
             <button 
               aria-label="Swap units"
               onClick={swapUnits}
               className="p-4 bg-orange-600/10 hover:bg-orange-600/20 border border-orange-600/20 rounded-full text-orange-500 group transition-all duration-500 hover:rotate-180"
             >
               <ArrowRightLeft className="w-8 h-8 group-hover:scale-110 transition-transform" />
             </button>
          </div>

          {/* TO */}
          <div className="space-y-4">
            <label htmlFor="to-unit" className="block text-sm font-semibold text-zinc-500 uppercase tracking-widest">Converted Result</label>
            <div className="w-full bg-[#0a0a0a] border border-orange-900/30 rounded-2xl py-5 px-6 text-3xl font-bold text-orange-400 min-h-[84px] flex items-center shadow-2xl">
              {convertedValue.toLocaleString(undefined, { maximumFractionDigits: 6 })}
            </div>
            <select
              id="to-unit"
              title="To unit"
              aria-label="Select target unit"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 text-sm font-medium text-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 appearance-none transition-all cursor-pointer hover:bg-zinc-700"
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
            >
              {units.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* QUICK INFO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
          <h4 className="text-white font-bold mb-2 flex items-center gap-2">
            <Zap className="w-4 h-4 text-orange-500" />
            Instant Feedback
          </h4>
          <p className="text-zinc-400 text-sm">Results update instantly as you type. All calculations are performed on-device for maximum speed and security.</p>
        </div>
        <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
          <h4 className="text-white font-bold mb-2 flex items-center gap-2">
            <Scale className="w-4 h-4 text-orange-500" />
            SI Standardized
          </h4>
          <p className="text-zinc-400 text-sm">Our conversion factors follow the International System of Units (SI) for guaranteed mathematical accuracy.</p>
        </div>
      </div>
    </ToolLayout>
  );
}
