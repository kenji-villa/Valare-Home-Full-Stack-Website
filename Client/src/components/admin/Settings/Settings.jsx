import AppearanceSettings from "./AppearanceSettings";
import PreferenceSettings from "./PreferenceSettings";
import SecuritySettings from "./SecuritySettings";
import AccountInfo from "./AccountInfo";

export default function Settings({ darkMode, setDarkMode, user }) {
  return (
    <div className="max-w-4xl mx-auto">
      <h2
        className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"} mb-6`}
      >
        Settings
      </h2>

      <AppearanceSettings darkMode={darkMode} setDarkMode={setDarkMode} />
      <PreferenceSettings darkMode={darkMode} />
      <SecuritySettings darkMode={darkMode} />
      <AccountInfo darkMode={darkMode} user={user} />
    </div>
  );
}
