import OrderStats from "./OrderStats";
import OrderTable from "./OrderTable";
import { updateOrderStatus, deleteOrder } from "../../../services/orderService";

export default function Orders({ orders, setOrders, darkMode }) {
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const response = await updateOrderStatus(orderId, newStatus);
      if (response.success) {
        setOrders(
          orders.map((order) =>
            (order._id || order.id) === orderId
              ? { ...order, status: newStatus, orderStatus: newStatus }
              : order,
          ),
        );
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status");
    }
  };

  const handleDelete = async (orderId) => {
    if (window.confirm("Delete this order?")) {
      try {
        const response = await deleteOrder(orderId);
        if (response.success) {
          setOrders(
            orders.filter((order) => (order._id || order.id) !== orderId),
          );
        }
      } catch (error) {
        console.error("Error deleting order:", error);
        alert("Failed to delete order");
      }
    }
  };

  return (
    <div>
      <OrderStats orders={orders} />
      <OrderTable
        orders={orders}
        onUpdateStatus={handleUpdateStatus}
        onDelete={handleDelete}
        darkMode={darkMode}
      />
    </div>
  );
}
