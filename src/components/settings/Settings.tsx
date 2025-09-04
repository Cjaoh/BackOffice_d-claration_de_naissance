import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface SettingsState {
  general: {
    appName: string;
    language: string;
    timezone: string;
  };
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
    fontSize: 'small' | 'medium' | 'large';
  };
}

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SettingsState>({
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
  });
  
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

  const handleSave = async () => {
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
  };

  const handleInputChange = (section: keyof SettingsState, field: string, value: string | boolean | number) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  return (
    <div className="space-y-6">

      <div className="bg-white/10 dark:bg-slate-900/50 backdrop-blur-xl border border-white/20 rounded-3xl shadow-lg p-8 max-w-5xl mx-auto">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-300 mb-8 select-none">
          Paramètres
        </h2>
        
        {/* Paramètres généraux */}
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

        {/* Notifications */}
        <Card title="Notifications" className="mb-8 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-inner">
          <div className="space-y-6">
            {['email', 'push', 'sms'].map((type) => {
              const enabled = settings.notifications[type as keyof typeof settings.notifications];
              const labelMap = {
                email: 'Notifications par email',
                push: 'Notifications push',
                sms: 'Notifications SMS',
              };
              const descMap = {
                email: 'Recevoir des notifications par email',
                push: 'Recevoir des notifications push',
                sms: 'Recevoir des notifications par SMS',
              };
              return (
                <div key={type} className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-white">{labelMap[type as keyof typeof labelMap]}</h3>
                    <p className="text-sm text-cyan-300">{descMap[type as keyof typeof descMap]}</p>
                  </div>
                  <button
                    type="button"
                    className={`${
                      enabled ? 'bg-cyan-500' : 'bg-gray-700 dark:bg-gray-600'
                    } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400`}
                    onClick={() => handleInputChange('notifications', type, !enabled)}
                    aria-pressed={enabled}
                    aria-label={`${enabled ? 'Désactiver' : 'Activer'} ${labelMap[type as keyof typeof labelMap]}`}
                  >
                    <span
                      className={`${
                        enabled ? 'translate-x-5' : 'translate-x-0'
                      } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Sécurité */}
        <Card title="Sécurité" className="mb-8 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-inner">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">Authentification à deux facteurs</h3>
                <p className="text-sm text-cyan-300">Ajouter une couche de sécurité supplémentaire</p>
              </div>
              <button
                type="button"
                className={`${
                  settings.security.twoFactorAuth ? 'bg-cyan-500' : 'bg-gray-700 dark:bg-gray-600'
                } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400`}
                onClick={() => handleInputChange('security', 'twoFactorAuth', !settings.security.twoFactorAuth)}
                aria-pressed={settings.security.twoFactorAuth}
                aria-label={`${settings.security.twoFactorAuth ? 'Désactiver' : 'Activer'} authentification à deux facteurs`}
              >
                <span
                  className={`${
                    settings.security.twoFactorAuth ? 'translate-x-5' : 'translate-x-0'
                  } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                />
              </button>
            </div>
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

        {/* Apparence */}
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

export default Settings;
