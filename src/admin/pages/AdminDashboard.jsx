import useDashboard from "../hooks/useDashboard";
import formatPrice from "../utils/formatPrice";

function StatCard({ title, value, icon, color }) {
  return (
    <div
      className="card border-0 shadow-sm h-100"
      style={{
        borderRadius: 14,
        background: "#fff",
      }}
    >
      <div className="card-body d-flex align-items-center gap-3">
        <div
          className="d-flex align-items-center justify-content-center"
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: color || "#e9d8a6",
            fontSize: 22,
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <div className="text-muted" style={{ fontSize: 13 }}>
            {title}
          </div>
          <div className="fw-bold" style={{ fontSize: 22 }}>
            {value}
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="text-center py-5">
      <div
        className="spinner-border text-danger mb-3"
        role="status"
        style={{ width: 40, height: 40 }}
      ></div>
      <div className="text-muted">Cargando datos del dashboard...</div>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="alert alert-danger" role="alert">
      <div className="fw-semibold mb-1">Ocurrió un error</div>
      <div className="mb-3" style={{ fontSize: 14 }}>
        {message}
      </div>
      <button type="button" className="btn btn-outline-danger btn-sm" onClick={onRetry}>
        Reintentar
      </button>
    </div>
  );
}

export default function AdminDashboard() {
  const {
    metrics,
    recentOrders,
    statusBreakdown,
    topCategories,
    loading,
    error,
    refresh,
  } = useDashboard();

  const statusColors = {
    Pendiente: "#f59e0b",
    Preparando: "#3b82f6",
    Enviado: "#8b5cf6",
    Entregado: "#10b981",
    Cancelado: "#ef4444",
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h3 className="fw-bold mb-1">Dashboard</h3>
          <div className="text-muted" style={{ fontSize: 13 }}>
            Resumen general de Bella Imagen
          </div>
        </div>
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          onClick={() => refresh()}
          disabled={loading}
        >
          {loading ? "Cargando..." : "🔄 Actualizar"}
        </button>
      </div>

      {error && <ErrorState message={error} onRetry={refresh} />}

      {loading ? (
        <LoadingState />
      ) : (
        <>
          {/* ── Tarjetas de métricas ─────────────── */}
          <div className="row g-3">
            <div className="col-12 col-md-6 col-lg-4">
              <StatCard
                title="📦 Productos"
                value={metrics.productos}
                icon="📦"
                color="#e9d8a6"
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <StatCard
                title="📂 Categorías"
                value={metrics.categorias}
                icon="📂"
                color="#e0f2fe"
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <StatCard
                title="🛒 Pedidos"
                value={metrics.pedidos}
                icon="🛒"
                color="#fef3c7"
              />
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <StatCard
                title="👥 Clientes"
                value={metrics.clientes}
                icon="👥"
                color="#d1fae5"
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <StatCard
                title="🚚 Envíos"
                value={metrics.envios}
                icon="🚚"
                color="#ede9fe"
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <StatCard
                title="📈 Ventas"
                value={formatPrice(metrics.ventas)}
                icon="📈"
                color="#dcfce7"
              />
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <StatCard
                title="⚠️ Stock bajo (≤5)"
                value={metrics.stockBajo}
                icon="⚠️"
                color="#fee2e2"
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <StatCard
                title="✅ Categorías activas"
                value={metrics.categoriasActivas}
                icon="✅"
                color="#cffafe"
              />
            </div>
          </div>

          {/* ── Sección inferior: pedidos + categorías ── */}
          <div className="row g-3 mt-1">
            {/* Pedidos recientes */}
            <div className="col-12 col-lg-7">
              <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 14 }}>
                <div className="card-body">
                  <div className="fw-semibold mb-3">🛒 Pedidos recientes</div>
                  {recentOrders.length === 0 ? (
                    <p className="text-muted mb-0">No hay pedidos registrados.</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover align-middle mb-0" style={{ fontSize: 14 }}>
                        <thead>
                          <tr>
                            <th>Nº</th>
                            <th>Cliente</th>
                            <th>Total</th>
                            <th>Estado</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentOrders.map((o) => (
                            <tr key={o.id}>
                              <td className="fw-semibold">{o.pedNum || o.id}</td>
                              <td>{o.cliente}</td>
                              <td>{formatPrice(o.total)}</td>
                              <td>
                                <span
                                  className="badge"
                                  style={{
                                    background: (statusColors[o.estado] || "#6b7280") + "22",
                                    color: statusColors[o.estado] || "#6b7280",
                                  }}
                                >
                                  {o.estado}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Desglose por estado + top categorías */}
            <div className="col-12 col-lg-5">
              <div className="card border-0 shadow-sm mb-3" style={{ borderRadius: 14 }}>
                <div className="card-body">
                  <div className="fw-semibold mb-3">📊 Pedidos por estado</div>
                  {statusBreakdown.map(({ estado, cantidad }) => (
                    <div key={estado} className="d-flex align-items-center justify-content-between mb-2">
                      <span className="text-muted" style={{ fontSize: 14 }}>
                        {estado}
                      </span>
                      <span className="fw-bold">{cantidad}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card border-0 shadow-sm" style={{ borderRadius: 14 }}>
                <div className="card-body">
                  <div className="fw-semibold mb-3">🏷️ Top categorías</div>
                  {topCategories.length === 0 ? (
                    <p className="text-muted mb-0">Sin categorías con productos.</p>
                  ) : (
                    topCategories.map(({ name, cantidad }) => (
                      <div key={name} className="d-flex align-items-center justify-content-between mb-2">
                        <span className="text-muted" style={{ fontSize: 14 }}>
                          {name}
                        </span>
                        <span className="fw-bold">{cantidad}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
