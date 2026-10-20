import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { TrendingUp, Target } from "lucide-react";

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

function buildSalesData(orders) {
  const now = new Date();
  const buckets = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({
      month: MONTH_LABELS[d.getMonth()],
      revenue: 0,
      target: 22000 + Math.random() * 3000,
    });
  }

  orders.forEach((order) => {
    if (!order.createdAt || order.status === "Cancelled") return;

    const orderDate = new Date(order.createdAt);
    const orderMonth = orderDate.getMonth();
    const orderYear = orderDate.getFullYear();

    const bucket = buckets.find(
      (b) => b.monthIndex === orderMonth && b.year === orderYear,
    );
    if (bucket) {
      bucket.revenue += order.total || 0;
    }
  });

  return buckets;
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-100 px-4 py-3">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-sm font-semibold text-[#DA4C2F]">
        Revenue: ETB {payload[0].value.toFixed(2)}
      </p>
      <p className="text-xs text-gray-500">
        Target: ETB {payload[1]?.value?.toFixed(2)}
      </p>
    </div>
  );
};

export default function SalesOverview({ orders }) {
  const data = useMemo(() => buildSalesData(orders), [orders]);
  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);
  const hasData = totalRevenue > 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-gray-800">Sales Overview</h3>
          <p className="text-sm text-gray-400">Revenue vs Target</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#DA4C2F]"></div>
            <span className="text-gray-600">Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#1a2d5e] border border-dashed"></div>
            <span className="text-gray-600">Target</span>
          </div>
        </div>
      </div>

      {!hasData ? (
        <p className="text-sm text-gray-400 py-16 text-center">
          No revenue data available for the last 7 months
        </p>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ left: -20, right: 10 }}>
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
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#F1F3F9"
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
                tickFormatter={(v) => `ETB ${v / 1000}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={15000} stroke="#F1F3F9" strokeDasharray="3 3" />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#DA4C2F"
                strokeWidth={2.5}
                fill="url(#revenueGradient)"
                name="Revenue"
              />
              <Area
                type="monotone"
                dataKey="target"
                stroke="#1a2d5e"
                strokeWidth={1.5}
                strokeDasharray="5 5"
                fill="none"
                name="Target"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#DA4C2F]/10">
            <TrendingUp className="w-4 h-4 text-[#DA4C2F]" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Average Sales / Month</p>
            <p className="text-sm font-semibold text-gray-800">
              ETB {(totalRevenue / 7).toFixed(2)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#1a2d5e]/10">
            <Target className="w-4 h-4 text-[#1a2d5e]" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Total Revenue (7 Months)</p>
            <p className="text-sm font-semibold text-gray-800">
              ETB {totalRevenue.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
