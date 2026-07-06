import { useState } from "react";
import { UserCog } from "lucide-react";

export default function PreferenceSettings({ darkMode }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [language, setLanguage] = useState("en");

  return (
    <div
      className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"} rounded-lg shadow-sm border p-6 mb-6`}
    >
      <h3
        className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-800"} mb-4 flex items-center gap-2`}
      >
        <UserCog className="w-5 h-5 text-[#DA4C2F]" />
        Preferences
      </h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p
              className={`font-medium ${darkMode ? "text-white" : "text-gray-700"}`}
            >
              Notifications
            </p>
            <p
              className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              Receive email notifications for orders and updates
            </p>
          </div>
          <button
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className={`relative w-12 h-6 rounded-full transition-colors ${notificationsEnabled ? "bg-[#DA4C2F]" : "bg-gray-300"}`}
          >
            <div
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${notificationsEnabled ? "right-1" : "left-1"}`}
            ></div>
          </button>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div>
            <p
              className={`font-medium ${darkMode ? "text-white" : "text-gray-700"}`}
            >
              Language
            </p>
            <p
              className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              Select your preferred language
            </p>
          </div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className={`px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#DA4C2F] ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
          >
            <option value="en">English</option>
            <option value="am">አማርኛ</option>
            <option value="fr">Français</option>
          </select>
        </div>
      </div>
    </div>
  );
}
