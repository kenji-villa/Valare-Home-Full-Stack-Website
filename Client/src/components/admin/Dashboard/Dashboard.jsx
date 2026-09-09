import StatsCards from "./StatsCards";
import SalesOverview from "./SalesOverview";
import RecentOrders from "./RecentOrders";
import QuickActions from "./QuickActions";
import TopProducts from "./TopProducts";
import CustomerOverview from "./CustomerOverview";
import OrderStatusChart from "./OrderStatusChart";
import SalesTrendChart from "./SalesTrendChart";

export default function Dashboard({ orders, products }) {
  return (
    <div className="space-y-6">
      {/* Stats Cards Row */}
      <StatsCards orders={orders} products={products} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesOverview orders={orders} />
        </div>
        <div>
          <OrderStatusChart orders={orders} />
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesTrendChart orders={orders} />
        </div>
        <div>
          <TopProducts products={products} />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentOrders orders={orders} />
        </div>
        <div className="space-y-6">
          <QuickActions />
          <CustomerOverview />
        </div>
      </div>
    </div>
  );
}
