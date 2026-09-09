import { Users, UserPlus, Star } from "lucide-react";

// Placeholder metrics, same spirit as the static "1,247 customers" stat
// card - swap for real values once a customer-analytics endpoint exists
const rows = [
  { icon: UserPlus, label: "New this month", value: "128" },
  { icon: Users, label: "Returning customers", value: "342" },
  { icon: Star, label: "Avg. satisfaction", value: "4.6 / 5" },
];

export default function CustomerOverview() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">Customer Overview</h3>
        <span className="text-[10px] uppercase tracking-wide text-gray-300">
          Preview
        </span>
      </div>
      <div className="space-y-4">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#1a2d5e]/5 flex items-center justify-center">
                <row.icon className="w-4 h-4 text-[#1a2d5e]" />
              </div>
              <span className="text-sm text-gray-600">{row.label}</span>
            </div>
            <span className="text-sm font-semibold text-gray-800">
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
