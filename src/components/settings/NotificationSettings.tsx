import React from 'react';
import Card from '../ui/Card';
import { SettingsSectionProps } from './types';
import { SettingsToggle } from './SettingsToggle';

const NotificationSettings: React.FC<SettingsSectionProps> = ({ settings, handleInputChange }) => {
  const notifications = settings.notifications;

  const toggles = [
    { type: 'email', label: 'Notifications par email', desc: 'Recevoir des notifications par email', enabled: notifications.email },
    { type: 'push', label: 'Notifications push', desc: 'Recevoir des notifications push', enabled: notifications.push },
    { type: 'sms', label: 'Notifications SMS', desc: 'Recevoir des notifications par SMS', enabled: notifications.sms },
  ];

  return (
    <Card title="Notifications" className="mb-8 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-inner">
      <div className="space-y-6">
        {toggles.map(({ type, label, desc, enabled }) => (
          <SettingsToggle
            key={type}
            label={label}
            description={desc}
            enabled={enabled}
            onChange={(val) => handleInputChange('notifications', type, val)}
          />
        ))}
      </div>
    </Card>
  );
};

export default React.memo(NotificationSettings);
