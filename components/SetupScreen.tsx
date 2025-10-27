import React, { useState } from 'react';
import type { GameSettings } from '../types';

interface SetupScreenProps {
  onStart: (settings: GameSettings) => void;
}

const SettingInput: React.FC<{ label: string; value: number; onChange: (value: number) => void; min: number; max: number; step: number, unit: string }> = ({ label, value, onChange, min, max, step, unit }) => (
  <div className="w-full max-w-sm">
    <label className="flex justify-between items-center text-xl font-medium text-slate-300 mb-2">
      <span>{label}</span>
      <span className="text-2xl font-bold text-cyan-400">{value}{unit}</span>
    </label>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer range-lg accent-cyan-500"
    />
  </div>
);


export const SetupScreen: React.FC<SetupScreenProps> = ({ onStart }) => {
  const [settings, setSettings] = useState<GameSettings>({
    digits: 7,
    displayTime: 3,
    rounds: 10,
    recallDelay: 0,
  });

  const handleSettingChange = (key: keyof GameSettings, value: number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart(settings);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center animate-fade-in">
      <h1 className="text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Number Recall</h1>
      <p className="text-2xl text-slate-400 mb-12">Train your short-term memory.</p>
      
      <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-10">
        <SettingInput 
          label="Digits to Memorize" 
          value={settings.digits} 
          onChange={(v) => handleSettingChange('digits', v)}
          min={3} max={16} step={1} unit=""
        />
        <SettingInput 
          label="Display Time" 
          value={settings.displayTime} 
          onChange={(v) => handleSettingChange('displayTime', v)}
          min={1} max={10} step={0.5} unit="s"
        />
        <SettingInput 
          label="Rounds" 
          value={settings.rounds} 
          onChange={(v) => handleSettingChange('rounds', v)}
          min={5} max={25} step={1} unit=""
        />

        <button 
          type="submit"
          className="mt-8 px-12 py-4 bg-cyan-600 text-white font-bold text-2xl rounded-lg shadow-lg hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 transform hover:scale-105 transition-all duration-200"
        >
          Start Training
        </button>
      </form>
    </div>
  );
};