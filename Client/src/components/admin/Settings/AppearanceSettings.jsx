import { Monitor, Sun, Moon } from "lucide-react";

export default function AppearanceSettings({ darkMode, setDarkMode }) {
  return (
    <div
      className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"} rounded-lg shadow-sm border p-6 mb-6`}
    >
      <h3
        className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-800"} mb-4 flex items-center gap-2`}
      >
        <Monitor className="w-5 h-5 text-[#DA4C2F]" />
        Appearance
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => setDarkMode(false)}
          className={`p-4 border-2 rounded-lg text-center transition-all ${
            !darkMode
              ? "border-[#DA4C2F] bg-[#DA4C2F]/5"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <Sun className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
          <p
            className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
          >
            Light Mode
          </p>
        </button>
        <button
          onClick={() => setDarkMode(true)}
          className={`p-4 border-2 rounded-lg text-center transition-all ${
            darkMode
              ? "border-[#DA4C2F] bg-[#DA4C2F]/5"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <Moon className="w-8 h-8 mx-auto mb-2 text-indigo-500" />
          <p
            className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
          >
            Dark Mode
          </p>
        </button>
        <button
          className={`p-4 border-2 border-gray-200 rounded-lg text-center hover:border-gray-300 transition-all`}
        >
          <Monitor className="w-8 h-8 mx-auto mb-2 text-gray-500" />
          <p
            className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
          >
            System Default
          </p>
        </button>
      </div>
    </div>
  );
}
