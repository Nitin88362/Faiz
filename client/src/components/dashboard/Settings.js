import { useState } from 'react';
import { motion } from 'framer-motion';

const Settings = () => {
  const [settings, setSettings] = useState({
    theme: 'dark',
    notifications: true,
    language: 'en',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSave = () => {
    // Save settings to backend or localStorage
    localStorage.setItem('settings', JSON.stringify(settings));
    alert('Settings saved!');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <h1 className="text-4xl font-bold mb-8">Settings</h1>
      <div className="bg-gray-900 p-6 rounded-lg">
        <div className="mb-6">
          <label className="block text-gray-300 mb-2">Theme</label>
          <select
            name="theme"
            value={settings.theme}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </div>
        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="notifications"
              checked={settings.notifications}
              onChange={handleChange}
              className="mr-2"
            />
            <span className="text-gray-300">Enable Notifications</span>
          </label>
        </div>
        <div className="mb-6">
          <label className="block text-gray-300 mb-2">Default Language</label>
          <select
            name="language"
            value={settings.language}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>
        <button
          onClick={handleSave}
          className="neon-button px-6 py-2 rounded-lg text-white font-semibold"
        >
          Save Settings
        </button>
      </div>
    </motion.div>
  );
};

export default Settings;