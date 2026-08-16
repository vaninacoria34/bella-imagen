import useStats from "../hooks/useStats";
import formatPrice from "../utils/formatPrice";

/**
 * Stats
 * ─────────────────────────────────────────────────
 * Página de estadísticas con KPIs y reportes
 * calculados desde los datos reales del sistema.
 */
export default function Stats() {
  const {
    summary,
    byStatus,
    byPayment,
    byShipping,
    topProducts,
    byMonth,
    loading,
    error,
    refresh,
  } = useStats();

  function KpiCard({ title, value, icon, color }) {
    return (
      <div
        className="card border-0 shadow-sm h-100"
        style={{ borderRadius: 14, background: "#fff" }}
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
        <div className="text-muted">Cargando estadísticas...</div>
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
        <button
          type="button"
          className="btn btn-outline-danger btn-sm"
          onClick={onRetry}
        >
          Reintentar
        </button>
      </div>
    );
  }

  function MiniBar({ value, max, color }) {
    const pct = max > 0 ? (value / max) * 100 : 0;
    return (
      <div
        style={{
          height: 8,
          borderRadius: 4,
          background: "#f0f0f0",
          overflow: "hidden",
          flex: 1,
          minWidth: 60,
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            borderRadius: 4,
            background: color || "#ee9b00",
            transition: "width 0.3s ease",
          }}
        ></div>
      </div>
    );
  }

  return (
    <div>
      {/* ── Header ─────────────────────────────── */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h3 className="fw-bold mb-1">Estadísticas</h3>
          <div className="text-muted" style={{ fontSize: 13 }}>
            KPIs y reportes en tiempo real
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
          {/* ── KPIs ──────────────────────────────── */}
          <div className="row g-3 mb-2">
            <div className="col-6 col-md-4 col-lg-3">
              <KpiCard
                title="Ventas totales"
                value={formatPrice(summary.ventas)}
                icon="📈"
                color="#dcfce7"
              />
            </div>
            <div className="col-6 col-md-4 col-lg-3">
              <KpiCard
                title="Pedidos"
                value={summary.pedidos}
                icon="🛒"
                color="#fef3c7"
              />
            </div>
            <div className="col-6 col-md-4 col-lg-3">
              <KpiCard
                title="Ticket promedio"
                value={formatPrice(summary.ticketPromedio)}
                icon="🎟️"
                color="#e0f2fe"
              />
            </div>
            <div className="col-6 col-md-4 col-lg-3">
              <KpiCard
                title="Clientes"
                value={summary.clientes}
                icon="👥"
                color="#d1fae5"
              />
            </div>
            <div className="col-6 col-md-4 col-lg-3">
              <KpiCard
                title="Productos"
                value={summary.productos}
                icon="📦"
                color="#e9d8a6"
              />
            </div>
            <div className="col-6 col-md-4 col-lg-3">
              <KpiCard
                title="Envíos realizados"
                value={summary.envios}
                icon="🚚"
                color="#ede9fe"
              />
            </div>
            <div className="col-6 col-md-4 col-lg-3">
              <KpiCard
                title="Cancelados"
                value={summary.cancelados}
                icon="❌"
                color="#fee2e2"
              />
            </div>
          </div>

          {/* ── Sección inferior ─────────────────── */}
          <div className="row g-3 mt-1">
            {/* Pedidos por estado (bar chart) */}
            <div className="col-12 col-lg-6">
              <div
                className="card border-0 shadow-sm h-100"
                style={{ borderRadius: 14 }}
              >
                <div className="card-body">
                  <div className="fw-semibold mb-3">
                    📊 Pedidos por estado
                  </div>
                  {byStatus.length === 0 ? (
                    <p className="text-muted mb-0">
                      No hay pedidos registrados.
                    </p>
                  ) : (
                    <>
                      {byStatus.map(({ estado, cantidad, ventas }) => {
                        const maxVentas = Math.max(
                          ...byStatus.map((s) => s.ventas),
                          1
                        );
                        const pct =
                          maxVentas > 0
                            ? Math.round(
                                ((cantidad > 0 ? ventas : 0) / maxVentas) * 100
                              )
                            : 0;
                        return (
                          <div key={estado} className="mb-3">
                            <div className="d-flex align-items-center justify-content-between mb-1">
                              <span
                                className="fw-semibold"
                                style={{ fontSize: 14 }}
                              >
                                {estado}
                              </span>
                              <span
                                className="text-muted"
                                style={{ fontSize: 13 }}
                              >
                                {cantidad} pedidos —{" "}
                                {cantidad > 0 ? formatPrice(ventas) : "$ 0"}
                              </span>
                            </div>
                            <MiniBar
                              value={cantidad > 0 ? ventas : 0}
                              max={maxVentas}
                              color={
                                {
                                  Pendiente: "#f59e0b",
                                  Preparando: "#3b82f6",
                                  Enviado: "#8b5cf6",
                                  Entregado: "#10b981",
                                  Cancelado: "#ef4444",
                                }[estado] || "#6b7280"
                              }
                            />
                            <div
                              className="text-muted text-end"
                              style={{ fontSize: 11, marginTop: 2 }}
                            >
                              {pct}%
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Top productos */}
            <div className="col-12 col-lg-6">
              <div
                className="card border-0 shadow-sm h-100"
                style={{ borderRadius: 14 }}
              >
                <div className="card-body">
                  <div className="fw-semibold mb-3">
                    🏆 Productos más vendidos
                  </div>
                  {topProducts.length === 0 ? (
                    <p className="text-muted mb-0">
                      No hay productos con ventas registradas.
                    </p>
                  ) : (
                    <>
                      {topProducts.map(
                        ({ nombre, cantidad, ventas }, idx) => {
                          const maxCant = Math.max(
                            ...topProducts.map((p) => p.cantidad),
                            1
                          );
                          return (
                            <div key={nombre} className="mb-3">
                              <div className="d-flex align-items-center gap-2 mb-1">
                                <span
                                  className="text-muted"
                                  style={{
                                    fontSize: 12,
                                    minWidth: 20,
                                    fontWeight: 600,
                                  }}
                                >
                                  {idx + 1}
                                </span>
                                <span
                                  className="fw-semibold"
                                  style={{ fontSize: 14, flex: 1 }}
                                >
                                  {nombre}
                                </span>
                                <span
                                  className="text-muted"
                                  style={{ fontSize: 13 }}
                                >
                                  {cantidad} u.
                                </span>
                              </div>
                              <div className="d-flex align-items-center gap-2">
                                <MiniBar
                                  value={cantidad}
                                  max={maxCant}
                                  color="#ee9b00"
                                />
                                <span
                                  className="text-muted"
                                  style={{ fontSize: 11, minWidth: 50 }}
                                >
                                  {formatPrice(ventas)}
                                </span>
                              </div>
                            </div>
                          );
                        }
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Segunda fila inferior ────────────── */}
          <div className="row g-3 mt-1">
            {/* Ventas por método de pago */}
            <div className="col-12 col-md-6">
              <div
                className="card border-0 shadow-sm h-100"
                style={{ borderRadius: 14 }}
              >
                <div className="card-body">
                  <div className="fw-semibold mb-3">
                    💳 Ventas por método de pago
                  </div>
                  {byPayment.length === 0 ? (
                    <p className="text-muted mb-0">
                      Sin datos de métodos de pago.
                    </p>
                  ) : (
                    <>
                      {byPayment.map(({ metodo, ventas }) => {
                        const maxVentas = Math.max(
                          ...byPayment.map((p) => p.ventas),
                          1
                        );
                        return (
                          <div key={metodo} className="mb-3">
                            <div className="d-flex align-items-center justify-content-between mb-1">
                              <span style={{ fontSize: 14 }}>{metodo}</span>
                              <span
                                className="fw-semibold"
                                style={{ fontSize: 13 }}
                              >
                                {formatPrice(ventas)}
                              </span>
                            </div>
                            <MiniBar
                              value={ventas}
                              max={maxVentas}
                              color="#0ea5e9"
                            />
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Ventas por método de envío */}
            <div className="col-12 col-md-6">
              <div
                className="card border-0 shadow-sm h-100"
                style={{ borderRadius: 14 }}
              >
                <div className="card-body">
                  <div className="fw-semibold mb-3">
                    🚚 Ventas por método de envío
                  </div>
                  {byShipping.length === 0 ? (
                    <p className="text-muted mb-0">
                      Sin datos de métodos de envío.
                    </p>
                  ) : (
                    <>
                      {byShipping.map(({ metodo, ventas }) => {
                        const maxVentas = Math.max(
                          ...byShipping.map((s) => s.ventas),
                          1
                        );
                        return (
                          <div key={metodo} className="mb-3">
                            <div className="d-flex align-items-center justify-content-between mb-1">
                              <span style={{ fontSize: 14 }}>{metodo}</span>
                              <span
                                className="fw-semibold"
                                style={{ fontSize: 13 }}
                              >
                                {formatPrice(ventas)}
                              </span>
                            </div>
                            <MiniBar
                              value={ventas}
                              max={maxVentas}
                              color="#8b5cf6"
                            />
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Pedidos por mes ──────────────────── */}
          <div className="row g-3 mt-1">
            <div className="col-12">
              <div
                className="card border-0 shadow-sm"
                style={{ borderRadius: 14 }}
              >
                <div className="card-body">
                  <div className="fw-semibold mb-3">
                    📅 Pedidos y ventas por mes
                  </div>
                  {byMonth.length === 0 ? (
                    <p className="text-muted mb-0">
                      No hay datos mensuales disponibles.
                    </p>
                  ) : (
                    <div className="table-responsive">
                      <table
                        className="table table-hover align-middle mb-0"
                        style={{ fontSize: 14 }}
                      >
                        <thead>
                          <tr>
                            <th>Mes</th>
                            <th>Pedidos</th>
                            <th>Ventas</th>
                            <th style={{ width: "40%" }}>Proporción</th>
                          </tr>
                        </thead>
                        <tbody>
                          {byMonth.map(({ label, pedidos, ventas }) => {
                            const maxVentas = Math.max(
                              ...byMonth.map((m) => m.ventas),
                              1
                            );
                            return (
                              <tr key={label}>
                                <td className="fw-semibold">{label}</td>
                                <td>{pedidos}</td>
                                <td>{formatPrice(ventas)}</td>
                                <td>
                                  <MiniBar
                                    value={ventas}
                                    max={maxVentas}
                                    color="#ee9b00"
                                  />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
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

