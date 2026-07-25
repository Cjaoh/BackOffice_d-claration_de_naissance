import React from 'react';
import Card from '../ui/Card';
import Input from '../ui/Input';
import { SettingsSectionProps } from './types';

const AccountSettings: React.FC<SettingsSectionProps> = ({ settings, handleInputChange }) => {
  return (
    <Card title="Paramètres généraux" className="mb-8 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-inner">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-cyan-300 mb-2">Nom de l'application</label>
          <Input
            type="text"
            value={settings.general.appName}
            onChange={(value) => handleInputChange('general', 'appName', value)}
            placeholder="Nom de l'application"
            className="bg-transparent border border-cyan-700 text-white focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-cyan-300 mb-2">Langue</label>
          <select
            className="w-full px-3 py-2 bg-transparent border border-cyan-700 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            value={settings.general.language}
            onChange={(e) => handleInputChange('general', 'language', e.target.value)}
          >
            <option value="fr">Français</option>
            <option value="en">Anglais</option>
            <option value="mg">Malagasy</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-cyan-300 mb-2">Fuseau horaire</label>
          <select
            className="w-full px-3 py-2 bg-transparent border border-cyan-700 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            value={settings.general.timezone}
            onChange={(e) => handleInputChange('general', 'timezone', e.target.value)}
          >
            <option value="Indian/Antananarivo">Antananarivo (GMT+3)</option>
            <option value="Europe/Paris">Paris (GMT+2)</option>
            <option value="America/New_York">New York (GMT-4)</option>
          </select>
        </div>
      </div>
    </Card>
  );
};

export default React.memo(AccountSettings);
