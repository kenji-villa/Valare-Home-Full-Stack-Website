import { ShoppingBag, Clock, CheckCircle, Truck, XCircle } from "lucide-react";

const statusConfig = {
  Delivered: {
    icon: CheckCircle,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
  },
  Processing: { icon: Clock, color: "text-blue-500", bg: "bg-blue-50" },
  Shipped: { icon: Truck, color: "text-amber-500", bg: "bg-amber-50" },
  Pending: { icon: Clock, color: "text-yellow-500", bg: "bg-yellow-50" },
  Cancelled: { icon: XCircle, color: "text-red-500", bg: "bg-red-50" },
};

function timeAgo(dateString) {
  if (!dateString) return null;
  const diffMs = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function RecentOrders({ orders }) {
  // Get the number of items from the items array
  const getItemCount = (order) => {
    if (Array.isArray(order.items)) {
      return order.items.length;
    }
    return order.items || 0;
  };

  // Get customer name from shippingAddress or order fields
  const getCustomerName = (order) => {
    if (order.shippingAddress?.fullName) {
      return order.shippingAddress.fullName;
    }
    if (order.customer) {
      return order.customer;
    }
    return "Anonymous";
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-800">Recent Activity</h3>
          <p className="text-xs text-gray-400">Latest orders and updates</p>
        </div>
        <button className="text-sm text-[#DA4C2F] hover:underline font-medium">
          View All
        </button>
      </div>

      <div className="space-y-2">
        {orders.slice(0, 5).map((order) => {
          const ago = timeAgo(order.createdAt);
          const StatusIcon = statusConfig[order.status]?.icon || Clock;
          const statusColor =
            statusConfig[order.status]?.color || "text-gray-400";
          const statusBg = statusConfig[order.status]?.bg || "bg-gray-50";
          const itemCount = getItemCount(order);
          const customerName = getCustomerName(order);

          return (
            <div
              key={order._id || order.id}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div
                className={`w-10 h-10 rounded-xl ${statusBg} flex items-center justify-center flex-shrink-0`}
              >
                <StatusIcon className={`w-4 h-4 ${statusColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm text-gray-800 truncate">
                    {order.orderNumber || order.id}
                  </p>
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full ${statusBg} ${statusColor} font-medium`}
                  >
                    {order.status || order.orderStatus || "Unknown"}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {customerName} · {itemCount} items
                  {ago ? ` · ${ago}` : ""}
                </p>
              </div>
              <span className="text-sm font-semibold text-[#DA4C2F]">
                ETB {(order.total || order.subtotal || 0).toFixed(2)}
              </span>
            </div>
          );
        })}
        {orders.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-8">
            No recent activity
          </p>
        )}
      </div>
    </div>
  );
}
