import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Truck,
  Users,
  Filter,
  Calendar,
  Download,
  Eye,
  ShoppingBag,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("weekly");
  const [loading, setLoading] = useState(false);

  // Mock data - Replace with API calls
  const revenueData = [
    { name: "Mon", revenue: 12000, profit: 8500 },
    { name: "Tue", revenue: 18000, profit: 12000 },
    { name: "Wed", revenue: 15000, profit: 10000 },
    { name: "Thu", revenue: 22000, profit: 16000 },
    { name: "Fri", revenue: 25000, profit: 18000 },
    { name: "Sat", revenue: 20000, profit: 14000 },
    { name: "Sun", revenue: 16000, profit: 11000 },
  ];

  const salesData = [
    { name: "Office Furniture", value: 45 },
    { name: "Home furniture", value: 55 },
  ];

  const COLORS = ["#DA4C2F", "#1a2d5e", "#7c8fc0", "#b3bfe0"];

  const recentOrders = [
    {
      id: "#75845735",
      product: "Macbook Pro M3 Pro",
      variant: "Black, 18/512GB",
      payment: "stripe",
      date: "22 Jan 2022",
      status: "Shipped",
    },
    {
      id: "#75845736",
      product: "iPhone 15 Pro Max",
      variant: "Natural Titanium, 256GB",
      payment: "VISA",
      date: "20 Jan 2022",
      status: "Delivered",
    },
    {
      id: "#75845737",
      product: "Samsung Galaxy S24 Ultra",
      variant: "Titanium Gray, 512GB",
      payment: "Bank Transfer",
      date: "19 Jan 2022",
      status: "Processing",
    },
    {
      id: "#75845738",
      product: "Sony WH-1000XM5",
      variant: "Black, Wireless",
      payment: "stripe",
      date: "18 Jan 2022",
      status: "Pending",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Shipped":
        return "bg-blue-100 text-blue-700";
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Processing":
        return "bg-yellow-100 text-yellow-700";
      case "Pending":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white rounded-lg shadow-lg border border-gray-100 px-4 py-3">
        <p className="text-xs text-gray-400 mb-1">{label}</p>
        <p className="text-sm font-semibold text-[#DA4C2F]">
          Revenue: ETB {payload[0].value.toFixed(2)}
        </p>
        <p className="text-xs text-gray-500">
          Profit: ETB {payload[1]?.value?.toFixed(2)}
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Analytics Overview
          </h2>
          <p className="text-sm text-gray-500">
            Track your business performance and insights
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            <Calendar className="w-4 h-4" />
            {timeRange === "weekly" ? "This Week" : "This Month"}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                Total Products
              </p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">20K+</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#DA4C2F]/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-[#DA4C2F]" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs text-emerald-500 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              34%
            </span>
            <span className="text-xs text-gray-400">vs last month</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">$889K This month</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                Total Sales
              </p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">2,649</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs text-emerald-500 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              12.5%
            </span>
            <span className="text-xs text-gray-400">vs last month</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">New Customer</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                Total Delivery
              </p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">5,830</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Truck className="w-5 h-5 text-emerald-500" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs text-red-500 flex items-center gap-0.5">
              <TrendingDown className="w-3 h-3" />
              2.3%
            </span>
            <span className="text-xs text-gray-400">vs last month</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">This month</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                Revenue Summary
              </p>
              <div className="mt-1 space-y-1">
                <p className="text-sm font-semibold text-gray-800">
                  Profit: 35.564
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  Spend: 3.564
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  Camp: 5.564
                </p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-amber-500" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-gray-400">Weekly</span>
            <span className="text-xs text-emerald-500 font-medium">+8.2%</span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-800">Revenue Summary</h3>
              <p className="text-xs text-gray-400">Weekly performance</p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#DA4C2F]"></div>
                <span className="text-gray-600">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#1a2d5e]"></div>
                <span className="text-gray-600">Profit</span>
              </div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ left: -20, right: 10 }}>
                <defs>
                  <linearGradient
                    id="revenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#DA4C2F" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#DA4C2F" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="profitGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#1a2d5e" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#1a2d5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#F1F3F9"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9CA3AF", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9CA3AF", fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#DA4C2F"
                  strokeWidth={2.5}
                  fill="url(#revenueGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stroke="#1a2d5e"
                  strokeWidth={2.5}
                  fill="url(#profitGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales Summary Pie Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Sale Summary</h3>
            <span className="text-xs text-gray-400">Weekly</span>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={salesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {salesData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span className="text-xs text-gray-600">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <button className="w-full text-center text-sm text-[#DA4C2F] font-medium hover:underline">
              Take a look at our more campaign insights →
            </button>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-800">Recent Orders</h3>
              <p className="text-xs text-gray-400">
                240 orders active · Keep track of orders and others information.
              </p>
            </div>
            <button className="text-sm text-[#DA4C2F] hover:underline font-medium flex items-center gap-1">
              View All Order
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                  Transaction ID
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                  Product Name
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                  Product Variant
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                  Payment Method
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                  Order Date
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                  Order Status
                </th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((order, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-800">
                      {order.id}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">
                      {order.product}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500">
                      {order.variant}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600 capitalize">
                      {order.payment}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500">{order.date}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights Banner */}
      <div className="bg-gradient-to-r from-[#1a2d5e] to-[#243b7a] rounded-2xl p-6 text-white">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold">Get More Insights</h3>
            <p className="text-gray-300 text-sm">
              Access detailed analytics and advanced reporting
            </p>
          </div>
          <button className="px-6 py-2.5 bg-[#DA4C2F] hover:bg-[#c43d22] transition-colors rounded-lg font-medium flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Get More Insights
          </button>
        </div>
      </div>
    </div>
  );
}
