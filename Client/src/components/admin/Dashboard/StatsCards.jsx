import {
  DollarSign,
  ShoppingCart,
  Package,
  User,
  ArrowUpRight,
} from "lucide-react";

export default function StatsCards({ orders, products }) {
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const lowStock = products.filter((p) => p.stock < 10).length;
  const pendingOrders = orders.filter((o) => o.status === "Pending").length;

  const stats = [
    {
      label: "Total Revenue",
      value: `ETB ${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "text-[#DA4C2F]",
      change: "+12.5%",
      changeColor: "text-green-600",
    },
    {
      label: "Total Orders",
      value: totalOrders,
      icon: ShoppingCart,
      color: "text-blue-500",
      change: `${pendingOrders} pending`,
      changeColor: "text-gray-500",
    },
    {
      label: "Total Products",
      value: totalProducts,
      icon: Package,
      color: "text-purple-500",
      change: `${lowStock} low in stock`,
      changeColor: "text-red-500",
    },
    {
      label: "Customers",
      value: "1,247",
      icon: User,
      color: "text-green-500",
      change: "+5.7%",
      changeColor: "text-green-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500">
              {stat.label}
            </span>
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
          <p
            className={`text-xs flex items-center gap-1 mt-1 ${stat.changeColor}`}
          >
            {stat.change}
          </p>
        </div>
      ))}
    </div>
  );
}
