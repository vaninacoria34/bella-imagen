import { Navigate, Outlet } from "react-router-dom";

const ADMIN_EMAIL = "santinosamuel26@gmail.com";

export default function AdminProtectedRoute() {
  // En esta etapa NO está implementado Firebase.
  // Por eso el panel se habilita solo con un "login simulado".
  const simulated = sessionStorage.getItem("adminSimulatedAuth") === "true";

  if (simulated) {
    return <Outlet />;
  }

  // Sin Firebase: mandamos al login.
  // (Cuando integremos Firebase se reemplaza esta lógica.)
  return <Navigate to="/admin/login" replace />;
}






