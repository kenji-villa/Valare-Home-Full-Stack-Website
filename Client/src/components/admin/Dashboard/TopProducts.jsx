import { Trophy, Star } from "lucide-react";

export default function TopProducts({ products }) {
  const top = [...products]
    .sort(
      (a, b) =>
        (b.reviewCount || b.reviews || 0) - (a.reviewCount || a.reviews || 0),
    )
    .slice(0, 3)
    .map((p, index) => ({
      ...p,
      rank: index + 1,
      reviews: p.reviewCount || p.reviews || 0,
    }));

  const totalSales = top.reduce((sum, p) => sum + p.reviews, 0);

  const rankColors = {
    1: "text-amber-400",
    2: "text-gray-400",
    3: "text-amber-600",
  };

  const rankBg = {
    1: "bg-amber-100",
    2: "bg-gray-100",
    3: "bg-amber-100/60",
  };

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
        <>
          <div className="space-y-3">
            {top.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div
                  className={`w-8 h-8 rounded-full ${rankBg[product.rank]} flex items-center justify-center flex-shrink-0`}
                >
                  {product.rank === 1 ? (
                    <Trophy className={`w-4 h-4 ${rankColors[product.rank]}`} />
                  ) : (
                    <span
                      className={`font-bold text-sm ${rankColors[product.rank]}`}
                    >
                      #{product.rank}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {product.name}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-gray-500">
                      {product.rating || product.averageRating || 0} ·{" "}
                      {product.reviews} reviews
                    </span>
                  </div>
                </div>
                <span className="text-sm font-semibold text-[#DA4C2F]">
                  {product.reviews} units
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
            <span className="text-gray-500">Total Sales Today</span>
            <span className="font-semibold text-gray-800">
              {totalSales} units
            </span>
          </div>
        </>
      )}
    </div>
  );
}
