import { create } from 'zustand';

interface Settings {
  profile: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
  };
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    issueAssigned: boolean;
    projectUpdates: boolean;
    qaResults: boolean;
    apiAlerts: boolean;
  };
  preferences: {
    language: string;
    timezone: string;
  };
}

interface SettingsState {
  settings: Settings;
  updateProfile: (profile: Settings['profile']) => void;
  updateNotifications: (notifications: Settings['notifications']) => void;
  updatePreferences: (preferences: Settings['preferences']) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: {
    profile: {
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA'
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: false,
      issueAssigned: true,
      projectUpdates: true,
      qaResults: true,
      apiAlerts: false
    },
    preferences: {
      language: 'en',
      timezone: 'UTC'
    }
  },
  updateProfile: (profile) => {
    set((state) => ({
      settings: { ...state.settings, profile }
    }));
  },
  updateNotifications: (notifications) => {
    set((state) => ({
      settings: { ...state.settings, notifications }
    }));
  },
  updatePreferences: (preferences) => {
    set((state) => ({
      settings: { ...state.settings, preferences }
    }));
  }
}));