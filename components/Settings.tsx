
import React from 'react';
// Fix: Import MODELS from constants instead of types
import { MODELS } from '../constants';

interface SettingsProps {
  prompt: string;
  setPrompt: (p: string) => void;
  model: string;
  setModel: (m: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ prompt, setPrompt, model, setModel }) => {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          <i className="fas fa-microchip text-indigo-500"></i>
          Engine Settings
        </h2>
        
        <div className="mb-8">
          <label className="block text-sm font-bold text-gray-700 mb-3">Model Selection</label>
          <div className="grid grid-cols-3 gap-4">
            {MODELS.map(m => (
              <button
                key={m.id}
                onClick={() => setModel(m.id)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  model === m.id 
                  ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200' 
                  : 'border-gray-200 hover:border-indigo-300'
                }`}
              >
                <div className={`font-bold ${model === m.id ? 'text-indigo-700' : 'text-gray-700'}`}>{m.name}</div>
                <div className="text-xs text-gray-500 mt-1">Recommended for high reasoning</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3 flex justify-between items-center">
            System Instructions (Azerbaijani Localization Prompt)
            <span className="text-xs font-normal text-indigo-600 italic">Strictly following the Elite Educator guidelines</span>
          </label>
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            className="w-full h-[600px] border rounded-xl px-6 py-6 focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-xs leading-relaxed bg-gray-50 text-gray-700 shadow-inner"
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default Settings;
