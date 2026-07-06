import { Lock, ChevronRight } from "lucide-react";

export default function SecuritySettings({ darkMode }) {
  const options = [
    "Change Password",
    "Two-Factor Authentication",
    "Session Management",
  ];

  return (
    <div
      className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"} rounded-lg shadow-sm border p-6 mb-6`}
    >
      <h3
        className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-800"} mb-4 flex items-center gap-2`}
      >
        <Lock className="w-5 h-5 text-[#DA4C2F]" />
        Security
      </h3>
      <div className="space-y-3">
        {options.map((option) => (
          <button
            key={option}
            className={`w-full text-left px-4 py-3 border rounded-lg ${darkMode ? "border-gray-700 hover:bg-gray-700" : "border-gray-200 hover:bg-gray-50"} transition-colors flex items-center justify-between`}
          >
            <span className={`${darkMode ? "text-white" : "text-gray-700"}`}>
              {option}
            </span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        ))}
      </div>
    </div>
  );
}
