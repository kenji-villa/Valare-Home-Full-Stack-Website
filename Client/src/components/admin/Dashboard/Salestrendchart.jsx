import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Groups orders into the last 6 calendar months. Assumes each order has a
// createdAt timestamp (standard with Mongoose { timestamps: true }) - if
// none are dated yet, the chart shows an empty state instead of guessing.
function buildTrendData(orders) {
  const now = new Date();
  const buckets = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      month: MONTH_LABELS[d.getMonth()],
      revenue: 0,
    });
  }
  const byKey = Object.fromEntries(buckets.map((b) => [b.key, b]));

  let hasDatedOrders = false;
  orders.forEach((order) => {
    if (!order.createdAt) return;
    const d = new Date(order.createdAt);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (byKey[key]) {
      byKey[key].revenue += order.total || 0;
      hasDatedOrders = true;
    }
  });

  return { buckets, hasDatedOrders };
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-100 px-4 py-3">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-sm font-semibold text-[#DA4C2F]">
        ETB {payload[0].value.toFixed(2)}
      </p>
    </div>
  );
};

export default function SalesTrendChart({ orders }) {
  const { buckets, hasDatedOrders } = useMemo(
    () => buildTrendData(orders),
    [orders],
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-semibold text-gray-800">Sales Trend</h3>
        <span className="text-xs text-gray-400">Last 6 months</span>
      </div>

      {!hasDatedOrders ? (
        <p className="text-sm text-gray-400 py-20 text-center">
          Not enough dated orders yet to plot a trend
        </p>
      ) : (
        <div className="h-64 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={buckets} margin={{ left: -20, right: 10 }}>
              <defs>
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
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
                tickFormatter={(v) => `${v / 1000}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#DA4C2F"
                strokeWidth={2.5}
                fill="url(#revenueFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
