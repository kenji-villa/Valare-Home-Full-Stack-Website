import OrderStats from "./OrderStats";
import OrderTable from "./OrderTable";
import { useState, useEffect, useCallback } from "react";
import {
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} from "../../../services/orderService";

export default function Orders({ orders, setOrders, darkMode }) {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [notification, setNotification] = useState(null);

  // ✅ Use useCallback to prevent stale closures
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const filters = filter !== "all" ? { status: filter } : {};
      const response = await getAllOrders(filters);

      if (response.success) {
        // ✅ Normalize status to ensure consistency
        const normalizedOrders = response.orders.map((order) => ({
          ...order,
          status: order.status || "Pending",
        }));
        setOrders(normalizedOrders);
        console.log("📥 Admin fetched orders:", normalizedOrders.length);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }, [filter, setOrders]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      console.log("🔄 Updating order:", orderId, "to:", newStatus);

      const response = await updateOrderStatus(orderId, newStatus);
      console.log("✅ Update response:", response);

      if (response.success) {
        // ✅ Update local state immediately
        setOrders(
          orders.map((o) =>
            (o._id || o.id) === orderId
              ? { ...o, status: newStatus, updatedAt: new Date().toISOString() }
              : o,
          ),
        );
        showNotification(`Order status updated to ${newStatus}`, "success");

        // ✅ Optionally refetch to ensure fresh data
        // await fetchOrders();
      }
    } catch (error) {
      console.error("❌ Update status error:", error);
      showNotification(error.message || "Failed to update status", "error");
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDelete = async (orderId) => {
    if (window.confirm("Delete this order?")) {
      try {
        const response = await deleteOrder(orderId);
        if (response.success) {
          setOrders(
            orders.filter((order) => (order._id || order.id) !== orderId),
          );
          showNotification("Order deleted successfully", "success");
        }
      } catch (error) {
        console.error("Error deleting order:", error);
        showNotification("Failed to delete order", "error");
      }
    }
  };

  // ✅ Calculate counts for each status
  const getStatusCount = (status) => {
    if (status === "all") return orders.length;
    return orders.filter((o) => o.status === status).length;
  };

  return (
    <div>
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          {notification.message}
        </div>
      )}

      {/* Filter Tabs with Counts */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {[
          "all",
          "Pending",
          "Processing",
          "Shipped",
          "Delivered",
          "Cancelled",
        ].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              filter === status
                ? "bg-[#DA4C2F] text-white"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            {status === "all" ? "All" : status}
            <span
              className={`ml-2 text-xs ${filter === status ? "text-white/80" : "text-gray-400"}`}
            >
              ({getStatusCount(status)})
            </span>
          </button>
        ))}
      </div>

      <OrderStats orders={orders} />

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-4 border-[#DA4C2F] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <OrderTable
          orders={orders}
          onUpdateStatus={handleUpdateStatus}
          onDelete={handleDelete}
          darkMode={darkMode}
        />
      )}
    </div>
  );
}
