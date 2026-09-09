import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  ChevronUp,
  ChevronDown,
  TrendingUp,
} from "lucide-react";

const navItems = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "analytics", icon: TrendingUp, label: "Analytics" },
  { id: "products", icon: Package, label: "Products" },
  { id: "orders", icon: ShoppingCart, label: "Orders" },
  { id: "customers", icon: Users, label: "Customers" },
  { id: "settings", icon: Settings, label: "Settings" },
];

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  isSidebarOpen,
  setIsSidebarOpen,
  darkMode,
}) {
  return (
    <div
      className={`${isSidebarOpen ? "w-64" : "w-20"} ${darkMode ? "bg-gray-800" : "bg-[#1a2d5e]"} text-white transition-all duration-300 flex flex-col flex-shrink-0 min-h-screen sticky top-0`}
    >
      <div className="p-4 border-b border-white/10">
        {isSidebarOpen ? (
          <div className="flex items-center gap-3">
            <img
              src="/assets/images/Logo_1.png"
              alt="Velaré"
              className="h-8 w-auto filter brightness-0 invert"
            />
            <span className="text-xs text-gray-400">Admin</span>
          </div>
        ) : (
          <div className="flex justify-center">
            <span className="text-xl font-bold text-[#DA4C2F]">V</span>
          </div>
        )}
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        <div className="px-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                activeTab === item.id
                  ? "bg-[#DA4C2F] text-white"
                  : "text-gray-300 hover:bg-white/10"
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {isSidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </div>
      </nav>

      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="p-3 border-t border-white/10 hover:bg-white/10 transition-colors"
      >
        {isSidebarOpen ? (
          <ChevronUp className="w-5 h-5 mx-auto text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 mx-auto text-gray-400" />
        )}
      </button>
    </div>
  );
}
