import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";
import Dashboard from "../components/admin/Dashboard/Dashboard";
import Products from "../components/admin/Products/Products";
import Orders from "../components/admin/Orders/Orders";
import Customers from "../components/admin/Customers/Customers";
import Settings from "../components/admin/Settings/Settings";

export default function Admin() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Check if user is admin
  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  // Mock data - In production, fetch from API
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Modern Sectional Sofa",
      price: 639.2,
      originalPrice: 799.0,
      discount: 20,
      stock: 45,
      category: "Living Room",
      status: "Active",
      color: "Brown",
      material: "Fabric",
      sku: "VLR-SF-2025-001",
      availability: "In Stock",
      description: "Elevate your living space with our modern sectional sofa.",
      images: ["/assets/images/p1.jpg", "/assets/images/p2.jpg"],
      specifications: {
        material: "Premium fabric, solid wood frame",
        color: "Brown, Gray, Black",
        style: "Modern, Contemporary",
        assembly: "Required (tools included)",
        weightCapacity: "600 lbs",
        warranty: "2 years limited",
      },
      reviews: 128,
      rating: 4.5,
      image: "/assets/images/p1.jpg",
    },
    {
      id: 2,
      name: "Ergonomic Office Chair",
      price: 450.0,
      originalPrice: 550.0,
      discount: 10,
      stock: 32,
      category: "Chairs",
      status: "Active",
      color: "Black",
      material: "Leather",
      sku: "VLR-CH-2025-002",
      availability: "In Stock",
      description:
        "Experience ultimate comfort with our ergonomic office chair.",
      images: ["/assets/images/Chair.jpg", "/assets/images/Office1.jpg"],
      specifications: {
        material: "Leather, Aluminum",
        color: "Black, Gray",
        style: "Modern, Ergonomic",
        assembly: "Minimal assembly required",
        weightCapacity: "300 lbs",
        warranty: "3 years limited",
      },
      reviews: 89,
      rating: 4.8,
      image: "/assets/images/Chair.jpg",
    },
    {
      id: 3,
      name: "Solid Wood Dining Table",
      price: 850.0,
      originalPrice: 1050.0,
      discount: 15,
      stock: 12,
      category: "Dining",
      status: "Active",
      color: "Wood",
      material: "Wood",
      sku: "VLR-DT-2025-003",
      availability: "In Stock",
      description:
        "Crafted from premium solid wood, this dining table brings warmth and elegance.",
      images: ["/assets/images/p6.jpg", "/assets/images/p5.jpg"],
      specifications: {
        material: "Solid Oak Wood",
        color: "Natural Wood, Walnut",
        style: "Rustic, Modern",
        assembly: "Required (tools included)",
        weightCapacity: "400 lbs",
        warranty: "2 years limited",
      },
      reviews: 56,
      rating: 4.6,
      image: "/assets/images/p6.jpg",
    },
    {
      id: 4,
      name: "Minimalist Bookshelf",
      price: 350.0,
      originalPrice: 450.0,
      discount: 0,
      stock: 0,
      category: "Storage",
      status: "Out of Stock",
      color: "Wood",
      material: "Wood",
      sku: "VLR-BK-2025-004",
      availability: "Out of Stock",
      description:
        "A sleek and modern bookshelf that combines functionality with minimalist design.",
      images: ["/assets/images/Shelves.jpg"],
      specifications: {
        material: "Engineered Wood",
        color: "Natural Wood",
        style: "Minimalist",
        assembly: "Required (tools included)",
        weightCapacity: "200 lbs",
        warranty: "1 year limited",
      },
      reviews: 34,
      rating: 4.2,
      image: "/assets/images/Shelves.jpg",
    },
    {
      id: 5,
      name: "Leather Recliner",
      price: 720.0,
      originalPrice: 890.0,
      discount: 10,
      stock: 18,
      category: "Living Room",
      status: "Active",
      color: "Black",
      material: "Leather",
      sku: "VLR-RC-2025-005",
      availability: "In Stock",
      description:
        "Premium leather recliner with adjustable positions for ultimate relaxation.",
      images: ["/assets/images/p4.jpg", "/assets/images/p3.jpg"],
      specifications: {
        material: "Premium Leather",
        color: "Black, Brown",
        style: "Classic",
        assembly: "Minimal assembly required",
        weightCapacity: "350 lbs",
        warranty: "3 years limited",
      },
      reviews: 72,
      rating: 4.7,
      image: "/assets/images/p4.jpg",
    },
  ]);

  const [orders, setOrders] = useState([
    {
      id: "ORD-2025-001",
      customer: "Helen M.",
      email: "helen@email.com",
      date: "2025-06-28",
      total: 1250.0,
      status: "Delivered",
      items: 3,
      address: "Bole, Addis Ababa",
      payment: "Credit Card",
    },
    {
      id: "ORD-2025-002",
      customer: "David K.",
      email: "david@email.com",
      date: "2025-06-27",
      total: 2150.0,
      status: "Processing",
      items: 5,
      address: "CMC, Addis Ababa",
      payment: "Bank Transfer",
    },
    {
      id: "ORD-2025-003",
      customer: "Sarah T.",
      email: "sarah@email.com",
      date: "2025-06-26",
      total: 780.0,
      status: "Shipped",
      items: 2,
      address: "Piassa, Addis Ababa",
      payment: "Credit Card",
    },
    {
      id: "ORD-2025-004",
      customer: "Michael R.",
      email: "michael@email.com",
      date: "2025-06-25",
      total: 3400.0,
      status: "Pending",
      items: 4,
      address: "Bole, Addis Ababa",
      payment: "Cash on Delivery",
    },
    {
      id: "ORD-2025-005",
      customer: "Grace L.",
      email: "grace@email.com",
      date: "2025-06-24",
      total: 560.0,
      status: "Delivered",
      items: 1,
      address: "CMC, Addis Ababa",
      payment: "Credit Card",
    },
  ]);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard orders={orders} products={products} />;
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
