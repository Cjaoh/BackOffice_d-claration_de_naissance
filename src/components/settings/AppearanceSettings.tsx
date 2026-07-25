import React from 'react';
import Card from '../ui/Card';
import { SettingsSectionProps } from './types';

const AppearanceSettings: React.FC<SettingsSectionProps> = ({ settings, handleInputChange }) => {
  return (
    <Card title="Apparence" className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-inner">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-cyan-300 mb-2">Thème</label>
          <select
            className="w-full px-3 py-2 bg-transparent border border-cyan-700 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            value={settings.appearance.theme}
            onChange={(e) => handleInputChange('appearance', 'theme', e.target.value)}
          >
            <option value="light">Clair</option>
            <option value="dark">Sombre</option>
            <option value="system">Système</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-cyan-300 mb-2">Taille du texte</label>
          <select
            className="w-full px-3 py-2 bg-transparent border border-cyan-700 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            value={settings.appearance.fontSize}
            onChange={(e) => handleInputChange('appearance', 'fontSize', e.target.value)}
          >
            <option value="small">Petit</option>
            <option value="medium">Moyen</option>
            <option value="large">Grand</option>
          </select>
        </div>
      </div>
    </Card>
  );
};

export default React.memo(AppearanceSettings);
