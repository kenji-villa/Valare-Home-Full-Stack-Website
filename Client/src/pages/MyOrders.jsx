import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  ShoppingBag,
  Eye,
  X,
  RefreshCw,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Calendar,
  User,
} from "lucide-react";
import { getMyOrders, cancelOrder } from "../services/orderService";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";

const statusConfig = {
  Pending: {
    icon: Clock,
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
  },
  Processing: {
    icon: Package,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  Shipped: {
    icon: Truck,
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
  },
  Delivered: {
    icon: CheckCircle,
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
  },
  Cancelled: {
    icon: XCircle,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
  },
};

export default function MyOrders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const socket = useSocket();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelling, setCancelling] = useState(null);
  const [filter, setFilter] = useState("all");
  const [liveUpdate, setLiveUpdate] = useState(null);

  // Fetch orders
  const fetchOrders = useCallback(async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) setRefreshing(true);
      else setLoading(true);

      const response = await getMyOrders();

      if (response.success) {
        const normalizedOrders = response.orders.map((order) => ({
          ...order,
          status: order.status || "Pending",
        }));
        setOrders(normalizedOrders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchOrders();
  }, [user, navigate, fetchOrders]);

  // Socket.IO: Listen for real-time order updates
  useEffect(() => {
    if (!socket || !user) return;

    // Join user-specific room
    socket.emit("join-user-room", user._id);

    // Listen for order status updates
    const handleOrderUpdate = (data) => {
      console.log("🔔 Real-time order update:", data);

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === data.orderId
            ? { ...order, status: data.status, updatedAt: data.updatedAt }
            : order,
        ),
      );

      // Show notification
      setLiveUpdate({
        orderId: data.orderNumber,
        status: data.status,
        message: `Order ${data.orderNumber} is now ${data.status}`,
      });

      // Auto-dismiss
      setTimeout(() => setLiveUpdate(null), 5000);

      // Also update selected order if it's open
      setSelectedOrder((prev) =>
        prev && prev._id === data.orderId
          ? { ...prev, status: data.status }
          : prev,
      );
    };

    // Listen for order cancelled
    const handleOrderCancelled = (data) => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === data.orderId
            ? { ...order, status: "Cancelled" }
            : order,
        ),
      );
    };

    socket.on("order-status-updated", handleOrderUpdate);
    socket.on("order-cancelled", handleOrderCancelled);

    return () => {
      socket.off("order-status-updated", handleOrderUpdate);
      socket.off("order-cancelled", handleOrderCancelled);
    };
  }, [socket, user]);

  // Refetch on window focus
  useEffect(() => {
    const handleFocus = () => {
      if (user) {
        fetchOrders(true).catch((err) => {
          // Silently ignore - server might be temporarily down
          console.log("Background refetch skipped:", err.message);
        });
      }
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [user, fetchOrders]);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      setCancelling(orderId);
      const response = await cancelOrder(orderId);

      console.log("🚫 Cancel response:", response);

      if (response.success && response.order) {
        // ✅ Update with the SERVER's response, not just a local change
        setOrders((prevOrders) =>
          prevOrders.map((o) =>
            o._id === orderId
              ? {
                  ...o,
                  status: response.order.status,
                  updatedAt: response.order.updatedAt,
                }
              : o,
          ),
        );

        // Update selected order if it's open
        setSelectedOrder((prev) =>
          prev && prev._id === orderId
            ? { ...prev, status: response.order.status }
            : prev,
        );

        // Optional: show a nice toast
        setLiveUpdate({
          orderId: response.order.orderNumber,
          status: "Cancelled",
          message: `Order ${response.order.orderNumber} has been cancelled`,
        });
        setTimeout(() => setLiveUpdate(null), 5000);
      } else {
        throw new Error(response.message || "Failed to cancel order");
      }
    } catch (error) {
      console.error("❌ Cancel error:", error);
      alert(error.message || "Failed to cancel order");
    } finally {
      setCancelling(null);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/assets/images/placeholder.jpg";
    if (imagePath.startsWith("http")) return imagePath;
    if (imagePath.startsWith("/uploads"))
      return `http://localhost:3001${imagePath}`;
    return imagePath;
  };

  const filteredOrders =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-[#DA4C2F] border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      {/* Real-time Update Toast */}
      {liveUpdate && (
        <div className="fixed top-20 right-4 z-[100] bg-[#1a2d5e] text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 animate-slide-in">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
          <div>
            <p className="text-xs text-gray-300">Order Update</p>
            <p className="text-sm font-medium">{liveUpdate.message}</p>
          </div>
          <button
            onClick={() => setLiveUpdate(null)}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <main className="bg-gray-50 min-h-screen py-8">
        <div className="container">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#1a2d5e] mb-2">
                My Orders
              </h1>
              <p className="text-gray-600">Track and manage your orders</p>
            </div>
            <button
              onClick={() => fetchOrders(true)}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
              />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {[
              "all",
              "Pending",
              "Processing",
              "Shipped",
              "Delivered",
              "Cancelled",
            ].map((status) => {
              const count =
                status === "all"
                  ? orders.length
                  : orders.filter((o) => o.status === status).length;

              return (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    filter === status
                      ? "bg-[#DA4C2F] text-white"
                      : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {status === "all" ? "All Orders" : status}
                  <span
                    className={`ml-2 text-xs ${
                      filter === status ? "text-white/80" : "text-gray-400"
                    }`}
                  >
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {filter === "all" ? "No orders yet" : `No ${filter} orders`}
              </h3>
              <p className="text-gray-600 mb-6">
                {filter === "all"
                  ? "You haven't placed any orders yet. Start shopping to see your orders here."
                  : `You don't have any ${filter.toLowerCase()} orders.`}
              </p>
              <Link
                to="/home-furniture"
                className="btn-primary inline-flex items-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const StatusIcon = statusConfig[order.status]?.icon || Package;
                const statusColor =
                  statusConfig[order.status]?.color || "text-gray-600";
                const statusBg = statusConfig[order.status]?.bg || "bg-gray-50";
                const statusBorder =
                  statusConfig[order.status]?.border || "border-gray-200";

                return (
                  <div
                    key={order._id}
                    className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100"
                  >
                    {/* Order Header */}
                    <div className="p-4 md:p-6 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-xl ${statusBg} flex items-center justify-center border ${statusBorder}`}
                        >
                          <StatusIcon className={`w-6 h-6 ${statusColor}`} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">
                            {order.orderNumber}
                          </p>
                          <p className="text-sm text-gray-500">
                            Placed on{" "}
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold ${statusBg} ${statusColor} border ${statusBorder}`}
                        >
                          {order.status}
                        </span>
                        <span className="text-lg font-bold text-[#DA4C2F]">
                          ETB {order.total?.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="p-4 md:p-6">
                      <div className="flex flex-wrap gap-3 mb-4">
                        {order.items.slice(0, 4).map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 bg-gray-50 rounded-lg p-3"
                          >
                            <img
                              src={getImageUrl(item.image)}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded"
                              onError={(e) => {
                                e.target.src = "/assets/images/placeholder.jpg";
                              }}
                            />
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-800 truncate max-w-[150px]">
                                {item.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                Qty: {item.quantity} × ETB{" "}
                                {item.price.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                        {order.items.length > 4 && (
                          <div className="flex items-center justify-center bg-gray-50 rounded-lg px-4 text-sm text-gray-500">
                            +{order.items.length - 4} more
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 flex-wrap gap-3">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>
                            {order.items.length}{" "}
                            {order.items.length === 1 ? "item" : "items"}
                          </span>
                          <span>•</span>
                          <span>{order.paymentMethod}</span>
                          <span>•</span>
                          <span className="capitalize">
                            {order.deliveryMethod}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {["Pending", "Processing"].includes(order.status) && (
                            <button
                              onClick={() => handleCancelOrder(order._id)}
                              disabled={cancelling === order._id}
                              className="px-3 py-1.5 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                            >
                              {cancelling === order._id
                                ? "Cancelling..."
                                : "Cancel"}
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="px-4 py-1.5 text-sm font-medium text-white bg-[#DA4C2F] rounded-lg hover:bg-[#c43d22] transition-colors flex items-center gap-1.5"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Order Details
                </h3>
                <p className="text-sm text-gray-500">
                  {selectedOrder.orderNumber}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                  Status
                </h4>
                <div className="flex items-center gap-3">
                  {(() => {
                    const StatusIcon =
                      statusConfig[selectedOrder.status]?.icon || Package;
                    const statusColor =
                      statusConfig[selectedOrder.status]?.color;
                    const statusBg = statusConfig[selectedOrder.status]?.bg;
                    return (
                      <>
                        <div
                          className={`w-10 h-10 rounded-full ${statusBg} flex items-center justify-center`}
                        >
                          <StatusIcon className={`w-5 h-5 ${statusColor}`} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">
                            {selectedOrder.status}
                          </p>
                          <p className="text-sm text-gray-500">
                            Last updated:{" "}
                            {new Date(
                              selectedOrder.updatedAt,
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                  Items
                </h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 bg-gray-50 rounded-lg p-3"
                    >
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                        onError={(e) => {
                          e.target.src = "/assets/images/placeholder.jpg";
                        }}
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-[#DA4C2F]">
                        ETB {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                  Shipping Address
                </h4>
                <div className="bg-gray-50 rounded-lg p-4 text-sm">
                  <p className="font-medium text-gray-800 flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    {selectedOrder.shippingAddress.fullName}
                  </p>
                  <p className="text-gray-600 flex items-center gap-2 mt-1">
                    <Phone className="w-4 h-4 text-gray-400" />
                    {selectedOrder.shippingAddress.phone}
                  </p>
                  <p className="text-gray-600 flex items-center gap-2 mt-1">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {selectedOrder.shippingAddress.email}
                  </p>
                  <p className="text-gray-600 flex items-start gap-2 mt-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                    <span>
                      {selectedOrder.shippingAddress.address}
                      <br />
                      {selectedOrder.shippingAddress.city},{" "}
                      {selectedOrder.shippingAddress.state}{" "}
                      {selectedOrder.shippingAddress.zipCode}
                      <br />
                      {selectedOrder.shippingAddress.country}
                    </span>
                  </p>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                  Order Summary
                </h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">
                      ETB {selectedOrder.subtotal?.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      ETB {selectedOrder.shippingCost?.toFixed(2) || "0.00"}
                    </span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span className="font-medium">
                        -ETB {selectedOrder.discount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-gray-200 text-lg font-bold">
                    <span>Total</span>
                    <span className="text-[#DA4C2F]">
                      ETB {selectedOrder.total?.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status History */}
              {selectedOrder.statusHistory &&
                selectedOrder.statusHistory.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                      Status History
                    </h4>
                    <div className="space-y-2">
                      {selectedOrder.statusHistory.map((entry, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 text-sm p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="w-2 h-2 rounded-full bg-[#DA4C2F]"></div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">
                              {entry.status}
                            </p>
                            {entry.note && (
                              <p className="text-xs text-gray-500">
                                {entry.note}
                              </p>
                            )}
                          </div>
                          <span className="text-xs text-gray-400">
                            {new Date(entry.changedAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
