export default function OrderStats({ orders }) {
  const totalOrders = orders.length;
  const pending = orders.filter((o) => o.status === "Pending").length;
  const processing = orders.filter((o) => o.status === "Processing").length;
  const delivered = orders.filter((o) => o.status === "Delivered").length;

  const stats = [
    { label: "Total Orders", value: totalOrders, color: "text-gray-800" },
    { label: "Pending", value: pending, color: "text-yellow-600" },
    { label: "Processing", value: processing, color: "text-blue-600" },
    { label: "Delivered", value: delivered, color: "text-green-600" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
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
