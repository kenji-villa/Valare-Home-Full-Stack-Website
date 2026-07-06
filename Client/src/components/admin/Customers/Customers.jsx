import { Users } from "lucide-react";

export default function Customers({ darkMode }) {
  return (
    <div
      className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"} rounded-lg shadow-sm border p-8 text-center`}
    >
      <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3
        className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-800"} mb-2`}
      >
        Customer Management
      </h3>
      <p className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>
        Coming soon! Customer management features will be available in the next
        update.
      </p>
    </div>
  );
}
