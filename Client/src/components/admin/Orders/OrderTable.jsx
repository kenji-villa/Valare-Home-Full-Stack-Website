import { Eye, Trash2 } from "lucide-react";
import OrderStatusBadge from "./OrderStatusBadge";

export default function OrderTable({
  orders,
  onUpdateStatus,
  onDelete,
  darkMode,
}) {
  const getItemCount = (order) => {
    if (Array.isArray(order.items)) {
      return order.items.length;
    }
    return order.items || 0;
  };

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
    <div
      className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"} rounded-lg shadow-sm border overflow-hidden`}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={darkMode ? "bg-gray-700" : "bg-gray-50"}>
            <tr>
              <th
                className={`text-left text-xs font-medium ${darkMode ? "text-gray-400" : "text-gray-500"} uppercase tracking-wider px-6 py-3`}
              >
                Order ID
              </th>
              <th
                className={`text-left text-xs font-medium ${darkMode ? "text-gray-400" : "text-gray-500"} uppercase tracking-wider px-6 py-3`}
              >
                Customer
              </th>
              <th
                className={`text-left text-xs font-medium ${darkMode ? "text-gray-400" : "text-gray-500"} uppercase tracking-wider px-6 py-3`}
              >
                Date
              </th>
              <th
                className={`text-left text-xs font-medium ${darkMode ? "text-gray-400" : "text-gray-500"} uppercase tracking-wider px-6 py-3`}
              >
                Items
              </th>
              <th
                className={`text-left text-xs font-medium ${darkMode ? "text-gray-400" : "text-gray-500"} uppercase tracking-wider px-6 py-3`}
              >
                Total
              </th>
              <th
                className={`text-left text-xs font-medium ${darkMode ? "text-gray-400" : "text-gray-500"} uppercase tracking-wider px-6 py-3`}
              >
                Status
              </th>
              <th
                className={`text-right text-xs font-medium ${darkMode ? "text-gray-400" : "text-gray-500"} uppercase tracking-wider px-6 py-3`}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody
            className={`divide-y ${darkMode ? "divide-gray-700" : "divide-gray-200"}`}
          >
            {orders.map((order) => (
              <tr
                key={order._id || order.id}
                className={`${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"} transition-colors`}
              >
                <td className="px-6 py-4">
                  <span
                    className={`font-medium text-sm ${darkMode ? "text-white" : "text-gray-800"}`}
                  >
                    {order.orderNumber || order.id}
                  </span>
                </td>
                <td
                  className={`px-6 py-4 text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}
                >
                  {getCustomerName(order)}
                </td>
                <td
                  className={`px-6 py-4 text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}
                >
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td
                  className={`px-6 py-4 text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}
                >
                  {getItemCount(order)}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-[#DA4C2F]">
                  ETB {(order.total || order.subtotal || 0).toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  <select
                    value={order.status || order.orderStatus || "Pending"}
                    onChange={(e) =>
                      onUpdateStatus(order._id || order.id, e.target.value)
                    }
                    className="px-2 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-[#DA4C2F]"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(order._id || order.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
