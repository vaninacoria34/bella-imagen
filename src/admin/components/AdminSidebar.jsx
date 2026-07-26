import { useNavigate, Link } from "react-router-dom";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: "🏠" },
  { to: "/admin/products", label: "Productos", icon: "📦" },
  { to: "/admin/categories", label: "Categorías", icon: "📂" },
];

export default function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("adminSimulatedAuth");
    navigate("/admin/login", { replace: true });
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

      <div className="d-flex flex-column gap-2">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="text-decoration-none"
            style={{
              padding: "10px 12px",
              borderRadius: 10,
              color: "#111",
              background: "transparent",
              border: "1px solid transparent",
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
            color: "#111",
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


