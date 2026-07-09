import { Edit, Trash2, MoreVertical } from "lucide-react";
import OrderStatusBadge from "../Orders/OrderStatusBadge";

export default function ProductTable({ products, onEdit, onDelete, darkMode }) {
  const getImageUrl = (product) => {
    if (product.coverImage) {
      // If it's a server path, prepend with the base URL
      if (product.coverImage.startsWith("/uploads/")) {
        return `http://localhost:3001${product.coverImage}`;
      }
      return product.coverImage;
    }
    if (product.images && product.images.length > 0) {
      if (product.images[0].startsWith("/uploads/")) {
        return `http://localhost:3001${product.images[0]}`;
      }
      return product.images[0];
    }
    return "/assets/images/placeholder.jpg";
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
                Product
              </th>
              <th
                className={`text-left text-xs font-medium ${darkMode ? "text-gray-400" : "text-gray-500"} uppercase tracking-wider px-6 py-3`}
              >
                Category
              </th>
              <th
                className={`text-left text-xs font-medium ${darkMode ? "text-gray-400" : "text-gray-500"} uppercase tracking-wider px-6 py-3`}
              >
                Price
              </th>
              <th
                className={`text-left text-xs font-medium ${darkMode ? "text-gray-400" : "text-gray-500"} uppercase tracking-wider px-6 py-3`}
              >
                Stock
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
            {products.map((product) => (
              <tr
                key={product._id || product.id}
                className={`${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"} transition-colors`}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={getImageUrl(product)}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/assets/images/placeholder.jpg";
                      }}
                    />
                    <span
                      className={`font-medium text-sm ${darkMode ? "text-white" : "text-gray-800"}`}
                    >
                      {product.name}
                    </span>
                  </div>
                </td>
                <td
                  className={`px-6 py-4 text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}
                >
                  {product.category}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-[#DA4C2F]">
                  ETB {product.price?.toFixed(2) || product.price}
                </td>
                <td
                  className={`px-6 py-4 text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}
                >
                  {product.stock}
                </td>
                <td className="px-6 py-4">
                  <OrderStatusBadge status={product.status || "Active"} />
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(product)}
                      className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(product._id || product.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div
        className={`px-6 py-3 border-t ${darkMode ? "border-gray-700" : "border-gray-200"} flex items-center justify-between`}
      >
        <p
          className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
        >
          Showing {products.length} products
        </p>
        <div className="flex gap-1">
          <button
            className={`px-3 py-1 border rounded-lg text-sm ${darkMode ? "border-gray-600 text-gray-400 hover:bg-gray-700" : "border-gray-300 hover:bg-gray-50"}`}
          >
            Previous
          </button>
          <button className="px-3 py-1 bg-[#DA4C2F] text-white rounded-lg text-sm">
            1
          </button>
          <button
            className={`px-3 py-1 border rounded-lg text-sm ${darkMode ? "border-gray-600 text-gray-400 hover:bg-gray-700" : "border-gray-300 hover:bg-gray-50"}`}
          >
            2
          </button>
          <button
            className={`px-3 py-1 border rounded-lg text-sm ${darkMode ? "border-gray-600 text-gray-400 hover:bg-gray-700" : "border-gray-300 hover:bg-gray-50"}`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
