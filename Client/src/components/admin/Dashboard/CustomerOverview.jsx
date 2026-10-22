import { Users, UserPlus, Star, TrendingUp, TrendingDown } from "lucide-react";

const metrics = [
  {
    icon: UserPlus,
    label: "New this month",
    value: "128",
    trend: "+12%",
    trendUp: true,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
  },
  {
    icon: Users,
    label: "Returning customers",
    value: "342",
    trend: "-2%",
    trendUp: false,
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    icon: Star,
    label: "Avg. satisfaction",
    value: "4.6 / 5",
    trend: "+0.3",
    trendUp: true,
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
];

export default function CustomerOverview() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">Customer Overview</h3>
        <span className="text-xs text-gray-400">This month</span>
      </div>
      <div className="space-y-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-lg ${metric.bg} flex items-center justify-center`}
              >
                <metric.icon className={`w-4 h-4 ${metric.color}`} />
              </div>
              <span className="text-sm text-gray-600">{metric.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-800">
                {metric.value}
              </span>
              <span
                className={`text-xs flex items-center gap-0.5 ${metric.trendUp ? "text-emerald-500" : "text-red-500"}`}
              >
                {metric.trendUp ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {metric.trend}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
