import OrderStatusBadge from "../Orders/OrderStatusBadge";

export default function RecentOrders({ orders }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">Recent Orders</h3>
        <button className="text-sm text-[#DA4C2F] hover:underline">
          View All
        </button>
      </div>
      <div className="space-y-3">
        {orders.slice(0, 4).map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div>
              <p className="font-medium text-sm text-gray-800">{order.id}</p>
              <p className="text-xs text-gray-500">
                {order.customer} • {order.items} items
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-[#DA4C2F]">
                ETB {order.total.toFixed(2)}
              </span>
              <OrderStatusBadge status={order.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
