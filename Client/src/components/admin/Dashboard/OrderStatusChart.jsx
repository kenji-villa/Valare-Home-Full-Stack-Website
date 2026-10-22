import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#DA4C2F", "#1a2d5e", "#7c8fc0", "#b3bfe0", "#dde2f2"];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-100 px-3 py-2 text-sm">
      <p className="font-medium text-gray-800">{payload[0].name}</p>
      <p className="text-gray-600">{payload[0].value} orders</p>
    </div>
  );
};

export default function OrderStatusChart({ orders }) {
  const counts = {};
  orders.forEach((order) => {
    const status = order.status || "Unknown";
    counts[status] = (counts[status] || 0) + 1;
  });

  const data = Object.entries(counts).map(([status, count]) => ({
    name: status,
    value: count,
  }));

  const total = orders.length;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">Order Status</h3>
        <span className="text-xs text-gray-400">{total} total</span>
      </div>

      {total === 0 ? (
        <p className="text-sm text-gray-400 py-16 text-center">No orders yet</p>
      ) : (
        <>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-2">
            {data.map((entry) => {
              const percent = Math.round((entry.value / total) * 100);
              return (
                <div
                  key={entry.name}
                  className="flex items-center gap-2 text-sm"
                >
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor:
                          COLORS[data.indexOf(entry) % COLORS.length],
                      }}
                    />
                    <span className="text-gray-600 truncate">{entry.name}</span>
                  </div>
                  <span className="font-medium text-gray-800 whitespace-nowrap">
                    {entry.value} ({percent}%)
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
