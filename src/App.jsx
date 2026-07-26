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

import ProductsCrudPlaceholder from "./admin/pages/ProductsCrudPlaceholder";

import CategoriesCrudPlaceholder from "./admin/pages/CategoriesCrudPlaceholder";
import OrdersPlaceholder from "./admin/pages/OrdersPlaceholder";
import CustomersPlaceholder from "./admin/pages/CustomersPlaceholder";
import ShipmentsPlaceholder from "./admin/pages/ShipmentsPlaceholder";
import PaymentsMethodsPlaceholder from "./admin/pages/PaymentsMethodsPlaceholder";
import StatsPlaceholder from "./admin/pages/StatsPlaceholder";
import SettingsPlaceholder from "./admin/pages/SettingsPlaceholder";

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
        <Route path="products" element={<ProductsCrudPlaceholder />} />
        <Route path="categories" element={<CategoriesCrudPlaceholder />} />
        <Route path="orders" element={<OrdersPlaceholder />} />
        <Route path="customers" element={<CustomersPlaceholder />} />
        <Route path="shipments" element={<ShipmentsPlaceholder />} />
        <Route
          path="promotions"
          element={<AdminPlaceholder title="🎟 Promociones" />}
        />
        <Route path="payments" element={<PaymentsMethodsPlaceholder />} />
        <Route path="stats" element={<StatsPlaceholder />} />
        <Route
          path="messages"
          element={<AdminPlaceholder title="💬 Mensajes" />}
        />
        <Route path="settings" element={<SettingsPlaceholder />} />
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







