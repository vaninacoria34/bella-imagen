import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CartSidebar from "./components/CartSidebar";
import TopBar from "./components/TopBar";
import Checkout from "./components/Checkout";
import ProductDetail from "./pages/ProductDetail";

import {
  Routes,
  Route,
  Outlet,
} from "react-router-dom";

import AdminProtectedRoute from "./admin/routes/AdminProtectedRoute";
import AdminLayout from "./admin/layouts/AdminLayout";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminPlaceholder from "./admin/pages/AdminPlaceholder";

import AdminLogin from "./admin/pages/AdminLogin";

import ProductsCrud from "./admin/pages/ProductsCrud";

import CategoriesCrud from "./admin/pages/CategoriesCrud";
import OrdersCrud from "./admin/pages/OrdersCrud";
import CustomersCrud from "./admin/pages/CustomersCrud";
import ShipmentsCrud from "./admin/pages/ShipmentsCrud";
import PaymentsMethodsCrud from "./admin/pages/PaymentsMethodsCrud";
import PromotionsCrud from "./admin/pages/PromotionsCrud";
import MessagesCrud from "./admin/pages/MessagesCrud";
import Stats from "./admin/pages/Stats";
import Settings from "./admin/pages/Settings";

export default function App() {
  return (
    <Routes>
      <Route path="/*" element={<TopLevelTienda />} />

      {/* AUTH ADMIN */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* PANEL ADMIN (separado + protegido) */}
      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AdminLayout>
              <Outlet />
            </AdminLayout>
          </AdminProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<ProductsCrud />} />
        <Route path="categories" element={<CategoriesCrud />} />
        <Route path="orders" element={<OrdersCrud />} />
        <Route path="customers" element={<CustomersCrud />} />
        <Route path="shipments" element={<ShipmentsCrud />} />
        <Route path="promotions" element={<PromotionsCrud />} />
        <Route path="payments" element={<PaymentsMethodsCrud />} />
        <Route path="stats" element={<Stats />} />
        <Route path="messages" element={<MessagesCrud />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

function TopLevelTienda() {
  return (
    <>
      {/* Tienda pública */}
      <TopBar />
      <Navbar />
      <CartSidebar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/product/:id" element={<ProductDetail />} />
      </Routes>
    </>
  );
}
