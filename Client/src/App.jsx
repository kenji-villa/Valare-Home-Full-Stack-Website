import { Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import ScrollToTop from "./components/common/ScrollToTop";
import Home from "./pages/Home";
import HomeFurniture from "./pages/HomeFurniture";
import Office from "./pages/Office";
import Specials from "./pages/Specials";
import Services from "./pages/Services";
import LoginPage from "./pages/LoginPage";
import ProductDetail from "./pages/ProductDetail";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ShippingFAQ from "./pages/ShippingFAQ";
import Favorites from "./pages/Favorites";
import Checkout from "./pages/Checkout";
import Contact from "./pages/Contact";
import TermsConditions from "./pages/TermsConditions";
import GiftCard from "./pages/GiftCard";
import BundleSave from "./pages/BundleSave";
import Admin from "./pages/Admin";
import ProtectedRoute from "./components/common/ProtectedRoute";
import SearchResults from "./pages/SearchResults";
import MyOrders from "./pages/MyOrders";
import Profile from "./pages/Profile";
import { ToastProvider } from "./context/ToastContext";

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <CartProvider>
          <ToastProvider>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home-furniture" element={<HomeFurniture />} />
              <Route path="/office" element={<Office />} />
              <Route path="/specials" element={<Specials />} />
              <Route path="/services" element={<Services />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/shipping" element={<ShippingFAQ />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms" element={<TermsConditions />} />
              <Route path="/gift-card" element={<GiftCard />} />
              <Route path="/bundle-save" element={<BundleSave />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/my-orders" element={<MyOrders />} />
              <Route path="/profile" element={<Profile />} />
              {/* Protected Routes - Require Login */}
              <Route
                path="/favorites"
                element={
                  <ProtectedRoute>
                    <Favorites />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />

              {/* Admin Only Route */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <Admin />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </ToastProvider>
        </CartProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
