import StatsCards from "./StatsCards";
import SalesOverview from "./SalesOverview";
import RecentOrders from "./RecentOrders";
import QuickActions from "./QuickActions";
import TopProducts from "./TopProducts.jsx";
import CustomerOverview from "./CustomerOverview.jsx";
import OrderStatusChart from "./OrderStatusChart.jsx";
import SalesTrendChart from "./Salestrendchart.";

export default function Dashboard({ orders, products, setActiveTab }) {
  return (
    <div className="space-y-6">
      <StatsCards orders={orders} products={products} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesOverview orders={orders} />
        </div>
        <div>
          <OrderStatusChart orders={orders} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesTrendChart orders={orders} />
        </div>
        <div>
          <TopProducts products={products} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentOrders orders={orders} />
        </div>
        <div className="space-y-6">
          <QuickActions setActiveTab={setActiveTab} />
          <CustomerOverview />
        </div>
      </div>
    </div>
  );
}
