function StatCard({ title, value }) {
  return (
    <div
      className="card border-0 shadow-sm"
      style={{
        borderRadius: 14,
        background: "#fff",
      }}
    >
      <div className="card-body">
        <div className="text-muted" style={{ fontSize: 13 }}>
          {title}
        </div>
        <div className="fw-bold" style={{ fontSize: 24 }}>
          {value}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h3 className="fw-bold mb-1">Dashboard</h3>
          <div className="text-muted" style={{ fontSize: 13 }}>
            Datos de ejemplo (fase inicial)
          </div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-12 col-md-6 col-lg-4">
          <StatCard title="📦 Productos" value="128" />
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <StatCard title="📂 Categorías" value="9" />
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <StatCard title="🛒 Pedidos" value="42" />
        </div>

        <div className="col-12 col-md-6 col-lg-4">
          <StatCard title="👥 Clientes" value="76" />
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <StatCard title="🚚 Envíos" value="31" />
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <StatCard title="📈 Ventas" value="$ 1.240.000" />
        </div>

        <div className="col-12 col-md-6 col-lg-4">
          <StatCard title="⭐ Productos destacados" value="6" />
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <StatCard title="⚙ Configuración" value="Listo" />
        </div>

        <div className="col-12">
          <div
            className="card border-0 shadow-sm"
            style={{ borderRadius: 14 }}
          >
            <div className="card-body">
              <div className="fw-semibold mb-2">Próximos pasos</div>
              <div className="text-muted" style={{ fontSize: 13 }}>
                Esta fase deja preparada la arquitectura para: Firebase Authentication,
                Firestore, Firebase Storage y módulos CRUD para productos, categorías,
                pedidos, clientes, promociones, estadísticas y más.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

