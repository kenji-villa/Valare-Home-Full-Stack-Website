import { Plus, Eye, ShoppingCart, Users } from "lucide-react";

export default function QuickActions() {
  const actions = [
    {
      icon: Plus,
      label: "Add Product",
      color: "text-[#DA4C2F]",
      bg: "bg-[#DA4C2F]/5",
      border: "border-[#DA4C2F]/20",
    },
    {
      icon: Eye,
      label: "View Analytics",
      color: "text-blue-500",
      bg: "bg-blue-50",
      border: "border-blue-200",
    },
    {
      icon: ShoppingCart,
      label: "New Order",
      color: "text-green-500",
      bg: "bg-green-50",
      border: "border-green-200",
    },
    {
      icon: Users,
      label: "Customers",
      color: "text-purple-500",
      bg: "bg-purple-50",
      border: "border-purple-200",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            className={`p-4 ${action.bg} border ${action.border} rounded-lg hover:scale-105 transition-transform text-center group`}
          >
            <action.icon
              className={`w-6 h-6 ${action.color} mx-auto mb-2 group-hover:scale-110 transition-transform`}
            />
            <p className="text-sm font-medium text-gray-700">{action.label}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
