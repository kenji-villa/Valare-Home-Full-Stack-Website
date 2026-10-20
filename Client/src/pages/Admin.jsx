import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";
import Dashboard from "../components/admin/Dashboard/Dashboard";
import Analytics from "../components/admin/Analytics/Analytics";
import Products from "../components/admin/Products/Products";
import Orders from "../components/admin/Orders/Orders";
import Customers from "../components/admin/Customers/Customers";
import Settings from "../components/admin/Settings/Settings";
import { getProducts } from "../services/productService";

export default function Admin() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is admin
  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  // Fetch products and orders
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch products from API
        const productResponse = await getProducts({ limit: 100 });
        if (productResponse.success) {
          setProducts(productResponse.products);
        }

        // Fetch orders from API
        const token = localStorage.getItem("authToken");
        const orderResponse = await fetch("http://localhost:3001/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const orderData = await orderResponse.json();
        if (orderData.success) {
          setOrders(orderData.orders);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-[#DA4C2F] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Error Loading Data
          </h3>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 btn-primary inline-flex items-center gap-2"
          >
            Retry
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case "dashboard":
        return (
          <Dashboard
            orders={orders}
            products={products}
            setActiveTab={setActiveTab}
          />
        );
      case "analytics":
        return <Analytics />;
      case "products":
        return (
          <Products
            products={products}
            setProducts={setProducts}
            darkMode={darkMode}
          />
        );
      case "orders":
        return (
          <Orders orders={orders} setOrders={setOrders} darkMode={darkMode} />
        );
      case "customers":
        return <Customers darkMode={darkMode} />;
      case "settings":
        return (
          <Settings darkMode={darkMode} setDarkMode={setDarkMode} user={user} />
        );
      default:
        return <Dashboard orders={orders} products={products} />;
    }
  };

  return (
    <div
      className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"} flex`}
    >
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        darkMode={darkMode}
      />

      <div className="flex-1 overflow-x-hidden">
        <AdminHeader activeTab={activeTab} darkMode={darkMode} user={user} />

        <div className="p-6">{renderContent()}</div>
      </div>
    </div>
  );
}
