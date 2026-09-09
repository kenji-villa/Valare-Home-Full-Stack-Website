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
      color: "text-[#1a2d5e]",
      bg: "bg-[#1a2d5e]/5",
      border: "border-[#1a2d5e]/20",
    },
    {
      icon: ShoppingCart,
      label: "New Order",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
    },
    {
      icon: Users,
      label: "Customers",
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            className={`p-4 ${action.bg} border ${action.border} rounded-xl hover:scale-[1.03] transition-transform text-center group`}
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
