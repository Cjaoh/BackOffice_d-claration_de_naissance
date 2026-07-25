export interface SettingsState {
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

export interface SettingsSectionProps {
  settings: SettingsState;
  handleInputChange: (section: keyof SettingsState, field: string, value: string | boolean | number) => void;
}
