import OrderStats from "./OrderStats";
import OrderTable from "./OrderTable";

export default function Orders({ orders, setOrders, darkMode }) {
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order,
      ),
    );
  };

  const deleteOrder = (orderId) => {
    if (window.confirm(`Delete order ${orderId}?`)) {
      setOrders(orders.filter((order) => order.id !== orderId));
    }
  };

  return (
    <div>
      <OrderStats orders={orders} />
      <OrderTable
        orders={orders}
        onUpdateStatus={updateOrderStatus}
        onDelete={deleteOrder}
        darkMode={darkMode}
      />
    </div>
  );
}
