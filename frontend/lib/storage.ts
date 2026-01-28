export const STORAGE_KEYS = {
  AUTH: 'auth_token',
  USER: 'user_data',
  ONBOARDING_COMPLETE: 'onboarding_complete',
  PREFERENCES: 'user_preferences',
  THEME: 'theme',
};

export const storage = {
  set(key: string, value: any): void {
    if (typeof window === 'undefined') return;
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  get<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },

  remove(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  },

  clear(): void {
    if (typeof window === 'undefined') return;
    localStorage.clear();
  },
};
