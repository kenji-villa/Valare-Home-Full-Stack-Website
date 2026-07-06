import { Info } from "lucide-react";

export default function AccountInfo({ darkMode, user }) {
  const info = [
    { label: "Username", value: user?.username || "Admin" },
    { label: "Email", value: user?.email || "admin@velarehome.com" },
    { label: "Role", value: "Administrator", isBadge: true },
    { label: "Member Since", value: "January 2025" },
  ];

  return (
    <div
      className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"} rounded-lg shadow-sm border p-6`}
    >
      <h3
        className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-800"} mb-4 flex items-center gap-2`}
      >
        <Info className="w-5 h-5 text-[#DA4C2F]" />
        Account Information
      </h3>
      <div className="space-y-3 text-sm">
        {info.map((item, index) => (
          <div
            key={index}
            className="flex justify-between py-2 border-b border-gray-200 last:border-0"
          >
            <span className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              {item.label}
            </span>
            {item.isBadge ? (
              <span className="px-2 py-0.5 bg-[#DA4C2F]/10 text-[#DA4C2F] rounded-full text-xs font-medium">
                {item.value}
              </span>
            ) : (
              <span
                className={`${darkMode ? "text-white" : "text-gray-800"} font-medium`}
              >
                {item.value}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
