import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
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
  const { user: authUser } = useAuth();
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

  // Apply theme changes
  useEffect(() => {
    const applyTheme = () => {
      const { theme } = settings.appearance;
      const html = document.documentElement;
      
      if (theme === 'dark') {
        html.classList.add('dark');
      } else if (theme === 'light') {
        html.classList.remove('dark');
      } else {
        // System preference
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          html.classList.add('dark');
        } else {
          html.classList.remove('dark');
        }
      }
    };

    applyTheme();
    
    // Listen for system theme changes
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
      // Save settings to localStorage
      localStorage.setItem('appSettings', JSON.stringify(settings));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      // Handle error (show notification, etc.)
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (section: keyof SettingsState, field: string, value: any) => {
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
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Paramètres</h2>
        
        {/* General Settings */}
        <Card title="Paramètres généraux" className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nom de l'application
              </label>
              <Input
                type="text"
                value={settings.general.appName}
                onChange={(value) => handleInputChange('general', 'appName', value)}
                placeholder="Nom de l'application"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Langue
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[#4CAF9E] focus:border-[#4CAF9E] dark:bg-gray-700 dark:text-white"
                value={settings.general.language}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('general', 'language', e.target.value)}
              >
                <option value="fr">Français</option>
                <option value="en">Anglais</option>
                <option value="mg">Malagasy</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fuseau horaire
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[#4CAF9E] focus:border-[#4CAF9E] dark:bg-gray-700 dark:text-white"
                value={settings.general.timezone}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('general', 'timezone', e.target.value)}
              >
                <option value="Indian/Antananarivo">Antananarivo (GMT+3)</option>
                <option value="Europe/Paris">Paris (GMT+2)</option>
                <option value="America/New_York">New York (GMT-4)</option>
              </select>
            </div>
          </div>
        </Card>
        
        {/* Notification Settings */}
        <Card title="Notifications" className="mb-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Notifications par email</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Recevoir des notifications par email</p>
              </div>
              <button
                type="button"
                className={`${
                  settings.notifications.email ? 'bg-[#4CAF9E]' : 'bg-gray-200 dark:bg-gray-600'
                } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4CAF9E]`}
                onClick={() => handleInputChange('notifications', 'email', !settings.notifications.email)}
              >
                <span
                  className={`${
                    settings.notifications.email ? 'translate-x-5' : 'translate-x-0'
                  } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Notifications push</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Recevoir des notifications push</p>
              </div>
              <button
                type="button"
                className={`${
                  settings.notifications.push ? 'bg-[#4CAF9E]' : 'bg-gray-200 dark:bg-gray-600'
                } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4CAF9E]`}
                onClick={() => handleInputChange('notifications', 'push', !settings.notifications.push)}
              >
                <span
                  className={`${
                    settings.notifications.push ? 'translate-x-5' : 'translate-x-0'
                  } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Notifications SMS</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Recevoir des notifications par SMS</p>
              </div>
              <button
                type="button"
                className={`${
                  settings.notifications.sms ? 'bg-[#4CAF9E]' : 'bg-gray-200 dark:bg-gray-600'
                } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4CAF9E]`}
                onClick={() => handleInputChange('notifications', 'sms', !settings.notifications.sms)}
              >
                <span
                  className={`${
                    settings.notifications.sms ? 'translate-x-5' : 'translate-x-0'
                  } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                />
              </button>
            </div>
          </div>
        </Card>
        
        {/* Security Settings */}
        <Card title="Sécurité" className="mb-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Authentification à deux facteurs</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Ajouter une couche de sécurité supplémentaire</p>
              </div>
              <button
                type="button"
                className={`${
                  settings.security.twoFactorAuth ? 'bg-[#4CAF9E]' : 'bg-gray-200 dark:bg-gray-600'
                } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4CAF9E]`}
                onClick={() => handleInputChange('security', 'twoFactorAuth', !settings.security.twoFactorAuth)}
              >
                <span
                  className={`${
                    settings.security.twoFactorAuth ? 'translate-x-5' : 'translate-x-0'
                  } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                />
              </button>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Délai d'expiration de session (minutes)
              </label>
              <Input
                type="number"
                min="1"
                max="120"
                value={settings.security.sessionTimeout.toString()}
                onChange={(value) => handleInputChange('security', 'sessionTimeout', parseInt(value) || 0)}
              />
            </div>
          </div>
        </Card>
        
        {/* Appearance Settings */}
        <Card title="Apparence">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Thème
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[#4CAF9E] focus:border-[#4CAF9E] dark:bg-gray-700 dark:text-white"
                value={settings.appearance.theme}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('appearance', 'theme', e.target.value)}
              >
                <option value="light">Clair</option>
                <option value="dark">Sombre</option>
                <option value="system">Système</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Taille du texte
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[#4CAF9E] focus:border-[#4CAF9E] dark:bg-gray-700 dark:text-white"
                value={settings.appearance.fontSize}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('appearance', 'fontSize', e.target.value)}
              >
                <option value="small">Petit</option>
                <option value="medium">Moyen</option>
                <option value="large">Grand</option>
              </select>
            </div>
          </div>
        </Card>
        
        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleSave}
            disabled={loading}
            className="bg-[#4CAF9E] hover:bg-[#3d8b7f] text-white"
          >
            {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </Button>
        </div>
        
        {success && (
          <div className="mt-4 p-4 bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg">
            Les paramètres ont été enregistrés avec succès !
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;