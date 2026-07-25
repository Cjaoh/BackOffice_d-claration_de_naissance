import React from 'react';

interface SettingsToggleProps {
  label: string;
  description: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export const SettingsToggle: React.FC<SettingsToggleProps> = React.memo(({ label, description, enabled, onChange }) => (
  <div className="flex items-center justify-between">
    <div>
      <h3 className="text-sm font-semibold text-white">{label}</h3>
      <p className="text-sm text-cyan-300">{description}</p>
    </div>
    <button
      type="button"
      className={`${
        enabled ? 'bg-cyan-500' : 'bg-gray-700 dark:bg-gray-600'
      } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400`}
      onClick={() => onChange(!enabled)}
      aria-pressed={enabled}
      aria-label={`${enabled ? 'Désactiver' : 'Activer'} ${label}`}
    >
      <span
        className={`${
          enabled ? 'translate-x-5' : 'translate-x-0'
        } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
      />
    </button>
  </div>
));
