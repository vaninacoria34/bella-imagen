import { Navigate } from "react-router-dom";

/**
 * AdminProtectedRoute
 * ─────────────────────────────────────────────────
 *  Protege las rutas del panel admin.
 *  Renderiza {children} cuando el usuario está autenticado.
 *  Redirige a /admin/login si no.
 *
 *  🔁 Cuando llegue Firebase Authentication:
 *     Reemplazar la validación simulada por onAuthStateChanged.
 */
export default function AdminProtectedRoute({ children }) {
  // En esta etapa NO está implementado Firebase.
  // Por eso el panel se habilita solo con un "login simulado".
  const simulated = sessionStorage.getItem("adminSimulatedAuth") === "true";

  if (simulated) {
    return children;
  }

  // Sin Firebase: mandamos al login.
  // (Cuando integremos Firebase se reemplaza esta lógica.)
  return <Navigate to="/admin/login" replace />;
}






