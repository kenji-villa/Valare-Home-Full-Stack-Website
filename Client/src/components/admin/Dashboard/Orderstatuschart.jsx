import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";

// Deepest navy for the largest status, fading lighter outward - the
// brand's own structural color doing the work instead of a generic
// rainbow legend
const SHADE_STEPS = ["#1a2d5e", "#3f5590", "#7c8fc0", "#b3bfe0", "#dde2f2"];

export default function OrderStatusChart({ orders }) {
  const counts = {};
  orders.forEach((order) => {
    const status = order.status || "Unknown";
    counts[status] = (counts[status] || 0) + 1;
  });

  const data = Object.entries(counts)
    .map(([status, count]) => ({ status, count }))
    .sort((a, b) => b.count - a.count)
    .map((entry, index) => ({
      ...entry,
      fill: SHADE_STEPS[index % SHADE_STEPS.length],
    }));

  const total = orders.length;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="font-semibold text-gray-800 mb-2">Order Status</h3>

      {total === 0 ? (
        <p className="text-sm text-gray-400 py-16 text-center">No orders yet</p>
      ) : (
        <>
          <div className="relative h-48">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="88%"
                innerRadius="30%"
                outerRadius="100%"
                startAngle={180}
                endAngle={0}
                data={data}
                barCategoryGap={4}
              >
                <RadialBar
                  dataKey="count"
                  cornerRadius={6}
                  background={{ fill: "#F1F3F9" }}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-x-0 bottom-1 text-center pointer-events-none">
              <p className="text-2xl font-bold text-gray-800">{total}</p>
              <p className="text-xs text-gray-500">Total Orders</p>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {data.map((entry) => (
              <div
                key={entry.status}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: entry.fill }}
                  ></span>
                  <span className="text-gray-600">{entry.status}</span>
                </div>
                <span className="font-medium text-gray-800">
                  {entry.count} · {Math.round((entry.count / total) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
