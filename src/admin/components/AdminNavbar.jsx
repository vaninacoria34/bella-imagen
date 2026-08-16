import { useNavigate } from "react-router-dom";

export default function AdminNavbar() {
  const navigate = useNavigate();

  return (
    <header
      className="d-flex align-items-center justify-content-between px-4 py-3"
      style={{
        background: "#fff",
        borderBottom: "1px solid #eee",
      }}
    >
      <div className="d-flex align-items-center gap-3">
        <button
          type="button"
          className="btn d-flex align-items-center gap-1"
          style={{
            background: "transparent",
            border: "1px solid #eee",
            borderRadius: 10,
            color: "#001219",
            fontSize: 13,
            padding: "6px 14px",
          }}
          onClick={() => navigate("/")}
        >
          ← Volver a la tienda
        </button>
        <div>
          <div className="fw-bold">Panel de Administración</div>
          <div className="text-muted" style={{ fontSize: 12 }}>
            Gestión general
          </div>
        </div>
      </div>

      <div className="d-flex align-items-center gap-3">
        <div className="text-muted" style={{ fontSize: 12 }}>
          Aldana
        </div>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: "#e9d8a6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
border: "1px solid #ee9b00",
          }}
        >
          💖
        </div>
      </div>
    </header>
  );
}

