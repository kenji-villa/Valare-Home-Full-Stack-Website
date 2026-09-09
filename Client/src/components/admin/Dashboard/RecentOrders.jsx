import { ShoppingBag } from "lucide-react";
import OrderStatusBadge from "../Orders/OrderStatusBadge";

function timeAgo(dateString) {
  if (!dateString) return null;
  const diffMs = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function RecentOrders({ orders }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">Recent Orders</h3>
        <button className="text-sm text-[#DA4C2F] hover:underline font-medium">
          View All
        </button>
      </div>
      <div className="space-y-1">
        {orders.slice(0, 4).map((order) => {
          const ago = timeAgo(order.createdAt);
          return (
            <div
              key={order.id}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#1a2d5e]/5 flex items-center justify-center flex-shrink-0">
                  <ShoppingBag className="w-4 h-4 text-[#1a2d5e]" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm text-gray-800 truncate">
                    {order.id}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {order.customer} · {order.items} items
                    {ago ? ` · ${ago}` : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-sm font-semibold text-[#DA4C2F]">
                  ETB {order.total?.toFixed(2) || order.total}
                </span>
                <OrderStatusBadge status={order.status} />
              </div>
            </div>
          );
        })}
        {orders.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-8">
            No orders yet
          </p>
        )}
      </div>
    </div>
  );
}
