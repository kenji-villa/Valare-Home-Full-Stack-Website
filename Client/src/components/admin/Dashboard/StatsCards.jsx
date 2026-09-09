import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
} from "lucide-react";

export default function StatsCards({ orders, products }) {
  const totalRevenue = orders.reduce(
    (sum, order) => sum + (order.total || 0),
    0,
  );
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const lowStock = products.filter((p) => p.stock < 10).length;

  const stats = [
    {
      label: "Total Sales",
      value: `ETB ${totalRevenue.toFixed(2)}`,
      subValue: "+$456",
      icon: DollarSign,
      change: "+12% vs last month",
      changeColor: "text-emerald-500",
      trend: "up",
      bgGradient: "from-[#DA4C2F]/10 to-[#DA4C2F]/5",
      borderColor: "border-[#DA4C2F]/20",
      iconBg: "bg-[#DA4C2F]/20",
      iconColor: "text-[#DA4C2F]",
    },
    {
      label: "Total Orders",
      value: totalOrders.toLocaleString(),
      subValue: "~1.8% Product sales",
      icon: ShoppingCart,
      change: "1.8% Product sales",
      changeColor: "text-blue-500",
      trend: "up",
      bgGradient: "from-blue-50 to-blue-100/30",
      borderColor: "border-blue-200",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      label: "Total Customers",
      value: "1,247",
      subValue: "~1.8% New customer",
      icon: Users,
      change: "1.8% New customer",
      changeColor: "text-emerald-500",
      trend: "up",
      bgGradient: "from-emerald-50 to-emerald-100/30",
      borderColor: "border-emerald-200",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      label: "Interaction",
      value: "3,247",
      subValue: "~2.8% vs last month",
      icon: Package,
      change: "2.8% vs last month",
      changeColor: "text-amber-500",
      trend: "up",
      bgGradient: "from-amber-50 to-amber-100/30",
      borderColor: "border-amber-200",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`relative overflow-hidden bg-white rounded-2xl p-6 border ${stat.borderColor} hover:shadow-lg transition-all duration-300 group`}
        >
          {/* Background Gradient */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-50`}
          />

          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                  {stat.label}
                </p>
                <h3 className="text-2xl font-bold text-gray-800 mt-2">
                  {stat.value}
                </h3>
                {stat.subValue && (
                  <p className="text-sm text-gray-500 mt-1">{stat.subValue}</p>
                )}
              </div>
              <div
                className={`w-11 h-11 rounded-xl ${stat.iconBg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}
              >
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
            </div>

            <div className="flex items-center gap-1.5 mt-3">
              {stat.trend === "up" ? (
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-xs font-medium ${stat.changeColor}`}>
                {stat.change}
              </span>
            </div>
          </div>

          {/* Decorative Dot */}
          <div className="absolute bottom-0 right-0 w-20 h-20 bg-[#DA4C2F]/5 rounded-full -mr-10 -mb-10 group-hover:scale-150 transition-transform duration-500" />
        </div>
      ))}
    </div>
  );
}
