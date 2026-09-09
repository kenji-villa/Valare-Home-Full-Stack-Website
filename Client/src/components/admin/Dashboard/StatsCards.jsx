import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  ArrowUpRight,
  TrendingDown,
} from "lucide-react";

export default function StatsCards({ orders, products }) {
  const totalRevenue = orders.reduce(
    (sum, order) => sum + (order.total || 0),
    0,
  );
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const lowStock = products.filter((p) => p.stock < 10).length;
  const pendingOrders = orders.filter((o) => o.status === "Pending").length;

  const stats = [
    {
      label: "Total Revenue",
      value: `ETB ${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      iconColor: "text-[#DA4C2F]",
      iconBg: "bg-[#DA4C2F]/10",
      change: "+12.5% vs last month",
      changeColor: "text-green-600",
      trend: "up",
    },
    {
      label: "Total Orders",
      value: totalOrders,
      icon: ShoppingCart,
      iconColor: "text-[#1a2d5e]",
      iconBg: "bg-[#1a2d5e]/10",
      change: `${pendingOrders} pending`,
      changeColor: "text-gray-500",
      trend: null,
    },
    {
      label: "Total Products",
      value: totalProducts,
      icon: Package,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-50",
      change: `${lowStock} low in stock`,
      changeColor: lowStock > 0 ? "text-red-500" : "text-gray-500",
      trend: lowStock > 0 ? "down" : null,
    },
    {
      label: "Customers",
      value: "1,247",
      icon: Users,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50",
      change: "+5.7% vs last month",
      changeColor: "text-green-600",
      trend: "up",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`w-9 h-9 rounded-lg ${stat.iconBg} flex items-center justify-center flex-shrink-0`}
              >
                <stat.icon className={`w-4 h-4 ${stat.iconColor}`} />
              </div>
              <span className="text-xs uppercase tracking-wide text-gray-400 font-semibold">
                {stat.label}
              </span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mt-4">
            {stat.value}
          </h3>
          <p
            className={`text-xs flex items-center gap-1 mt-2 ${stat.changeColor}`}
          >
            {stat.trend === "up" && <ArrowUpRight className="w-3 h-3" />}
            {stat.trend === "down" && <TrendingDown className="w-3 h-3" />}
            {stat.change}
          </p>
        </div>
      ))}
    </div>
  );
}
