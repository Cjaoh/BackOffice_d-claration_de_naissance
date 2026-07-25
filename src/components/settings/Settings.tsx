import React, { useState, useEffect, useCallback } from 'react';
import Button from '../ui/Button';
import { SettingsState } from './types';
import AccountSettings from './AccountSettings';
import NotificationSettings from './NotificationSettings';
import SecuritySettings from './SecuritySettings';
import AppearanceSettings from './AppearanceSettings';

const INITIAL_SETTINGS: SettingsState = {
  general: {
    appName: 'BackOffice Déclaration',
    language: 'fr',
    timezone: 'Indian/Antananarivo'
  },
  notifications: {
    email: true,
    push: true,
    sms: false
  },
  security: {
    twoFactorAuth: false,
    sessionTimeout: 30
  },
  appearance: {
    theme: 'light',
    fontSize: 'medium'
  }
};

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SettingsState>(INITIAL_SETTINGS);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(prev => ({
          ...prev,
          ...parsedSettings
        }));
      } catch (e) {
        console.error('Error parsing settings from localStorage:', e);
      }
    }
  }, []);

  useEffect(() => {
    const applyTheme = () => {
      const { theme } = settings.appearance;
      const html = document.documentElement;
      if (theme === 'dark') {
        html.classList.add('dark');
      } else if (theme === 'light') {
        html.classList.remove('dark');
      } else {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          html.classList.add('dark');
        } else {
          html.classList.remove('dark');
        }
      }
    };
    applyTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (settings.appearance.theme === 'system') {
        applyTheme();
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [settings.appearance.theme]);

  const handleSave = useCallback(async () => {
    setLoading(true);
    setSuccess(false);
    try {
      localStorage.setItem('appSettings', JSON.stringify(settings));
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  }, [settings]);

  const handleInputChange = useCallback((section: keyof SettingsState, field: string, value: string | boolean | number) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white/10 dark:bg-slate-900/50 backdrop-blur-xl border border-white/20 rounded-3xl shadow-lg p-8 max-w-5xl mx-auto">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-300 mb-8 select-none">
          Paramètres
        </h2>
        
        <AccountSettings settings={settings} handleInputChange={handleInputChange} />
        <NotificationSettings settings={settings} handleInputChange={handleInputChange} />
        <SecuritySettings settings={settings} handleInputChange={handleInputChange} />
        <AppearanceSettings settings={settings} handleInputChange={handleInputChange} />

        <div className="mt-8 flex justify-end">
          <Button
            onClick={handleSave}
            disabled={loading}
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-2xl py-3 px-6 shadow-lg transition duration-300 transform hover:scale-[1.03] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </Button>
        </div>

        {success && (
          <div className="mt-6 p-4 rounded-xl bg-green-900/60 text-green-300 font-semibold select-none">
            Les paramètres ont été enregistrés avec succès !
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(Settings);
