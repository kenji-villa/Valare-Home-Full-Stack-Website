import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";

const BAR_SHADES = ["#1a2d5e", "#DA4C2F", "#C9CEDB"];

export default function TopProducts({ products }) {
  const top = [...products]
    .sort(
      (a, b) =>
        (b.reviewCount || b.reviews || 0) - (a.reviewCount || a.reviews || 0),
    )
    .slice(0, 3)
    .map((p) => ({
      name: p.name,
      reviews: p.reviewCount || p.reviews || 0,
    }));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">Top Products</h3>
        <span className="text-xs text-gray-400">By reviews</span>
      </div>

      {top.length === 0 ? (
        <p className="text-sm text-gray-400 py-12 text-center">
          No products yet
        </p>
      ) : (
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={top} barCategoryGap="30%" margin={{ top: 20 }}>
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6B7280", fontSize: 11 }}
                interval={0}
                tickFormatter={(v) =>
                  v.length > 10 ? `${v.slice(0, 10)}…` : v
                }
              />
              <YAxis hide />
              <Bar dataKey="reviews" radius={[6, 6, 0, 0]}>
                {top.map((_, index) => (
                  <Cell
                    key={index}
                    fill={BAR_SHADES[index % BAR_SHADES.length]}
                  />
                ))}
                <LabelList
                  dataKey="reviews"
                  position="top"
                  style={{ fill: "#374151", fontSize: 12, fontWeight: 600 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
