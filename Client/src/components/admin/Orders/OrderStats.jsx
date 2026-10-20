export default function OrderStats({ orders, globalStats }) {
  const totalOrders = globalStats ? globalStats.totalOrders : orders.length;
  const pending = globalStats
    ? globalStats.pending
    : orders.filter((o) => (o.status || o.orderStatus) === "Pending").length;
  const processing = globalStats
    ? globalStats.processing
    : orders.filter((o) => (o.status || o.orderStatus) === "Processing").length;
  const shipped = globalStats
    ? globalStats.shipped
    : orders.filter((o) => (o.status || o.orderStatus) === "Shipped").length;
  const delivered = globalStats
    ? globalStats.delivered
    : orders.filter((o) => (o.status || o.orderStatus) === "Delivered").length;

  const stats = [
    { label: "Total Orders", value: totalOrders, color: "text-gray-800" },
    { label: "Pending", value: pending, color: "text-yellow-600" },
    { label: "Processing", value: processing, color: "text-blue-600" },
    { label: "Shipped", value: shipped, color: "text-purple-600" },
    { label: "Delivered", value: delivered, color: "text-green-600" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-lg p-4 shadow-sm border border-gray-100"
        >
          <p className="text-xs text-gray-500">{stat.label}</p>
          <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
