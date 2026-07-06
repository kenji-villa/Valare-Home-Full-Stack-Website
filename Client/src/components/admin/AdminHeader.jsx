import { RefreshCw, Download } from "lucide-react";

export default function AdminHeader({ activeTab, darkMode, user }) {
  return (
    <div
      className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10`}
    >
      <div>
        <h1
          className={`text-xl font-bold capitalize ${darkMode ? "text-white" : "text-gray-800"}`}
        >
          {activeTab}
        </h1>
        <p
          className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
        >
          Welcome back, {user?.username || "Admin"}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          className={`p-2 ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"} rounded-lg transition-colors`}
        >
          <RefreshCw
            className={`w-5 h-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
          />
        </button>
        <button
          className={`p-2 ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"} rounded-lg transition-colors`}
        >
          <Download
            className={`w-5 h-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
          />
        </button>
        <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
          <div className="w-8 h-8 rounded-full bg-[#DA4C2F] text-white flex items-center justify-center font-semibold text-sm">
            {user?.username?.charAt(0) || "A"}
          </div>
        </div>
      </div>
    </div>
  );
}
