import { useNavigate, Link, useLocation } from "react-router-dom";

const gestionItems = [
  { to: "/admin", label: "Dashboard", icon: "🏠", end: true },
  { to: "/admin/products", label: "Productos", icon: "📦" },
  { to: "/admin/categories", label: "Categorías", icon: "📂" },
  { to: "/admin/orders", label: "Pedidos", icon: "🛒" },
  { to: "/admin/customers", label: "Clientes", icon: "👥" },
];

const operacionItems = [
  { to: "/admin/shipments", label: "Envíos", icon: "🚚" },
  { to: "/admin/promotions", label: "Promociones", icon: "🎟" },
  { to: "/admin/payments", label: "Formas de pago", icon: "💳" },
];

const analisisItems = [
  { to: "/admin/stats", label: "Estadísticas", icon: "📈" },
  { to: "/admin/messages", label: "Mensajes", icon: "💬" },
  { to: "/admin/settings", label: "Configuración", icon: "⚙" },
];

export default function AdminSidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => {
    sessionStorage.removeItem("adminSimulatedAuth");
    navigate("/admin/login", { replace: true });
  };

  const isActive = (item) => {
    if (item.end) return pathname === item.to;
    return pathname === item.to || pathname.startsWith(item.to + "/");
  };

  return (
    <aside
      className="p-3"
      style={{
        width: 280,
        background: "#fff",
        borderRight: "1px solid #eee",
      }}
    >
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <div className="fw-bold">Bella Imagen</div>
          <div className="text-muted" style={{ fontSize: 12 }}>
            Admin Panel
          </div>
        </div>
      </div>

<div className="d-flex flex-column gap-1">
        <div className="text-uppercase text-muted px-2 mb-1" style={{ fontSize: 11, letterSpacing: 0.5 }}>
          Gestión
        </div>
        {gestionItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="text-decoration-none"
            style={{
              padding: "10px 12px",
              borderRadius: 10,
color: isActive(item) ? "#ffffff" : "#001219",
              background: isActive(item) ? "#ee9b00" : "transparent",
              border: "1px solid transparent",
              fontWeight: isActive(item) ? 600 : 400,
            }}
          >
            <div className="d-flex align-items-center gap-2">
              <span style={{ width: 26, textAlign: "center" }}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          </Link>
        ))}

        <div className="text-uppercase text-muted px-2 mt-3 mb-1" style={{ fontSize: 11, letterSpacing: 0.5 }}>
          Operación
        </div>
        {operacionItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="text-decoration-none"
            style={{
              padding: "10px 12px",
              borderRadius: 10,
              color: isActive(item) ? "#ffffff" : "#001219",
              background: isActive(item) ? "#ee9b00" : "transparent",
              border: "1px solid transparent",
              fontWeight: isActive(item) ? 600 : 400,
            }}
          >
            <div className="d-flex align-items-center gap-2">
              <span style={{ width: 26, textAlign: "center" }}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          </Link>
        ))}

        <div className="text-uppercase text-muted px-2 mt-3 mb-1" style={{ fontSize: 11, letterSpacing: 0.5 }}>
          Análisis
        </div>
        {analisisItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="text-decoration-none"
            style={{
              padding: "10px 12px",
              borderRadius: 10,
              color: isActive(item) ? "#ffffff" : "#001219",
              background: isActive(item) ? "#ee9b00" : "transparent",
              border: "1px solid transparent",
              fontWeight: isActive(item) ? 600 : 400,
            }}
          >
            <div className="d-flex align-items-center gap-2">
              <span style={{ width: 26, textAlign: "center" }}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-auto pt-4">
        <button
          type="button"
          className="btn w-100"
          style={{
            background: "transparent",
            border: "1px solid #eee",
            color: "#001219",
            borderRadius: 10,
          }}
          onClick={handleLogout}
        >
          🚪 Cerrar sesión
        </button>
      </div>
    </aside>
  );
}


