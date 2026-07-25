import React from 'react';
import Card from '../ui/Card';
import Input from '../ui/Input';
import { SettingsSectionProps } from './types';
import { SettingsToggle } from './SettingsToggle';

const SecuritySettings: React.FC<SettingsSectionProps> = ({ settings, handleInputChange }) => {
  return (
    <Card title="Sécurité" className="mb-8 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-inner">
      <div className="space-y-6">
        <SettingsToggle
          label="Authentification à deux facteurs"
          description="Ajouter une couche de sécurité supplémentaire"
          enabled={settings.security.twoFactorAuth}
          onChange={(val) => handleInputChange('security', 'twoFactorAuth', val)}
        />
        <div>
          <label className="block text-sm font-medium text-cyan-300 mb-2">Délai d'expiration de session (minutes)</label>
          <Input
            type="number"
            min={1}
            max={120}
            value={settings.security.sessionTimeout.toString()}
            onChange={(value) => handleInputChange('security', 'sessionTimeout', parseInt(value) || 0)}
            className="bg-transparent border border-cyan-700 text-white focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>
      </div>
    </Card>
  );
};

export default React.memo(SecuritySettings);
