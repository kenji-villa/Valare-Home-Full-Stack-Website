import { CheckCircle, Clock, Package, XCircle } from "lucide-react";

export default function OrderStatusBadge({ status }) {
  const getStatusConfig = (status) => {
    switch (status) {
      case "Delivered":
        return { color: "bg-green-100 text-green-700", icon: CheckCircle };
      case "Processing":
        return { color: "bg-blue-100 text-blue-700", icon: Clock };
      case "Shipped":
        return { color: "bg-purple-100 text-purple-700", icon: Package };
      case "Pending":
        return { color: "bg-yellow-100 text-yellow-700", icon: Clock };
      case "Out of Stock":
        return { color: "bg-red-100 text-red-700", icon: XCircle };
      default:
        return { color: "bg-gray-100 text-gray-700", icon: Clock };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${config.color}`}
    >
      <Icon className="w-3 h-3" />
      {status}
    </span>
  );
}
