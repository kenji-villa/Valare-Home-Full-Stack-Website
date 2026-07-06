import StatsCards from "./StatsCards";
import RecentOrders from "./RecentOrders";
import QuickActions from "./QuickActions";

export default function Dashboard({ orders, products }) {
  return (
    <div>
      <StatsCards orders={orders} products={products} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <RecentOrders orders={orders} />
        <QuickActions />
      </div>
    </div>
  );
}
