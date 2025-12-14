const SETTINGS_KEY = 'gameHubSettings';

/**
 * Save settings to localStorage
 * @param {object} settings - Settings object containing name, avatar, difficulty, darkMode
 */
export function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
}

/**
 * Load settings from localStorage
 * @returns {object|null} Settings object or null if not found
 */
export function loadSettings() {
  try {
    const settings = localStorage.getItem(SETTINGS_KEY);
    return settings ? JSON.parse(settings) : null;
  } catch (error) {
    console.error('Failed to load settings:', error);
    return null;
  }
}

/**
 * Clear settings from localStorage
 */
export function clearSettings() {
  try {
    localStorage.removeItem(SETTINGS_KEY);
  } catch (error) {
    console.error('Failed to clear settings:', error);
  }
}