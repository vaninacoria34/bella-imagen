import { useState, useMemo } from "react";
import formatPrice from "../utils/formatPrice";

/**
 * OrderTable
 * ─────────────────────────────────────────────────
 * Tabla responsive de pedidos con búsqueda y filtros por estado.
 *
 * Props:
 *   orders       → array de pedidos
 *   loading      → booleano (muestra spinner)
 *   error        → string (muestra alerta)
 *   onViewDetail → fn(order) — abre modal de detalle
 */

const STATUS_STYLES = {
  Pendiente: { bg: "#fff8e1", color: "#f57f17", dot: "🟡" },
  Preparando: { bg: "#e3f2fd", color: "#1565c0", dot: "🔵" },
  Enviado: { bg: "#fff3e0", color: "#e65100", dot: "🟠" },
  Entregado: { bg: "#e8f5e9", color: "#2e7d32", dot: "🟢" },
  Cancelado: { bg: "#e9d8a6", color: "#c62828", dot: "🔴" },
};

const STATUS_FILTERS = [
  { label: "Todos", value: "" },
  { label: "🟡 Pendiente", value: "Pendiente" },
  { label: "🔵 Preparando", value: "Preparando" },
  { label: "🟠 Enviado", value: "Enviado" },
  { label: "🟢 Entregado", value: "Entregado" },
  { label: "🔴 Cancelado", value: "Cancelado" },
];

export default function OrderTable({
  orders,
  loading,
  error,
  onViewDetail,
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Filtro local por número de pedido, cliente o producto
  const filtered = useMemo(() => {
    let result = orders;

    // Filtro por estado
    if (statusFilter) {
      result = result.filter((o) => o.estado === statusFilter);
    }

    // Filtro por búsqueda
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (o) =>
          o.pedNum.toLowerCase().includes(q) ||
          o.cliente.toLowerCase().includes(q) ||
          o.productos.some((p) => p.nombre.toLowerCase().includes(q))
      );
    }

    return result;
  }, [orders, search, statusFilter]);

  // ── Badge de estado ──────────────────────────────
  const EstadoBadge = ({ estado }) => {
    const style = STATUS_STYLES[estado] || STATUS_STYLES.Pendiente;
    return (
      <span
        className="badge rounded-pill"
        style={{
          background: style.bg,
          color: style.color,
          fontSize: 12,
          fontWeight: 600,
          padding: "6px 14px",
        }}
      >
        {style.dot} {estado}
      </span>
    );
  };

  // ── Estado vacío ─────────────────────────────────
  if (!loading && !error && filtered.length === 0) {
    return (
      <section>
        {/* Buscador + Filtros */}
        <div className="d-flex flex-wrap gap-3 mb-3">
          <div style={{ maxWidth: 360, flex: 1, minWidth: 200 }}>
            <div className="input-group">
              <span
                className="input-group-text"
                style={{
                  background: "#e9d8a6",
                  border: "none",
                  borderRadius: "12px 0 0 12px",
                  color: "#ee9b00",
                }}
              >
                🔍
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Buscar por N° pedido, cliente o producto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  background: "#e9d8a6",
                  border: "none",
                  borderRadius: "0 12px 12px 0",
                  padding: "12px 16px",
                  fontSize: 14,
                }}
              />
            </div>
          </div>

          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              width: "auto",
              minWidth: 160,
              borderRadius: 12,
              padding: "8px 14px",
              fontSize: 14,
              border: "1px solid #e0e0e0",
              background: "#fff",
            }}
          >
            {STATUS_FILTERS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        <div className="text-center py-5 text-muted">
          <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
          <p className="fw-semibold mb-1">
            {search.trim() || statusFilter
              ? "No se encontraron pedidos con esos filtros."
              : "No hay pedidos para mostrar."}
          </p>
          <p className="mb-3" style={{ fontSize: 14 }}>
            {search.trim() || statusFilter
              ? "Intentá con otros términos de búsqueda."
              : "Los pedidos aparecerán aquí cuando los clientes realicen compras."}
          </p>
          <div className="d-flex justify-content-center gap-2">
            {(search.trim() || statusFilter) && (
              <button
                type="button"
                className="btn btn-sm"
                style={{
                  background: "#e9d8a6",
                  color: "#ee9b00",
                  borderRadius: 8,
                  border: "none",
                  padding: "8px 18px",
                }}
                onClick={() => {
                  setSearch("");
                  setStatusFilter("");
                }}
              >
                Limpiar filtros
              </button>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      {/* Buscador + Filtros */}
      <div className="d-flex flex-wrap gap-3 mb-3">
        <div style={{ maxWidth: 360, flex: 1, minWidth: 200 }}>
          <div className="input-group">
            <span
              className="input-group-text"
              style={{
                background: "#e9d8a6",
                border: "none",
                borderRadius: "12px 0 0 12px",
                color: "#ee9b00",
              }}
            >
              🔍
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por N° pedido, cliente o producto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                background: "#e9d8a6",
                border: "none",
                borderRadius: "0 12px 12px 0",
                padding: "12px 16px",
                fontSize: 14,
              }}
            />
          </div>
        </div>

        <select
          className="form-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            width: "auto",
            minWidth: 160,
            borderRadius: 12,
            padding: "8px 14px",
            fontSize: 14,
            border: "1px solid #e0e0e0",
            background: "#fff",
          }}
        >
          {STATUS_FILTERS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      {/* Loading */}
      {loading && (
        <div className="d-flex align-items-center gap-2 py-4 text-muted">
          <div
            className="spinner-border spinner-border-sm"
            role="status"
            style={{ color: "#ee9b00" }}
          />
          <span>Cargando pedidos…</span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          className="alert alert-danger d-flex align-items-center gap-2 py-2"
          role="alert"
          style={{ borderRadius: 12, fontSize: 14 }}
        >
          <span>⚠️</span> {error}
        </div>
      )}

      {/* Contador de pedidos */}
      {!loading && !error && (
        <div
          className="d-flex align-items-center gap-2 mb-3 px-3 py-2"
          style={{
            background: "#e9d8a6",
            borderRadius: 12,
            fontSize: 14,
            color: "#333",
          }}
        >
          <span style={{ fontSize: 18 }}>🛒</span>
          <span className="fw-semibold">
            Total de pedidos:{" "}
            <span style={{ color: "#ee9b00" }}>{orders.length}</span>
          </span>
          {(search.trim() || statusFilter) && (
            <span className="text-muted" style={{ fontSize: 13 }}>
              (filtrados: {filtered.length})
            </span>
          )}
        </div>
      )}

      {/* Tabla — solo visible en md+ */}
      {!loading && !error && (
        <div className="d-none d-md-block">
          <div
            className="table-responsive"
            style={{ borderRadius: 16, overflow: "hidden" }}
          >
            <table
              className="table align-middle mb-0"
              style={{ background: "#fff", fontSize: 14 }}
            >
              <thead>
                <tr style={{ background: "#e9d8a6", color: "#333" }}>
                  <th style={{ padding: "14px 16px", fontWeight: 600 }}>
                    N° Pedido
                  </th>
                  <th style={{ padding: "14px 16px", fontWeight: 600 }}>
                    Fecha
                  </th>
                  <th style={{ padding: "14px 16px", fontWeight: 600 }}>
                    Cliente
                  </th>
                  <th style={{ padding: "14px 16px", fontWeight: 600 }}>
                    Productos
                  </th>
                  <th style={{ padding: "14px 16px", fontWeight: 600 }}>
                    Total
                  </th>
                  <th style={{ padding: "14px 16px", fontWeight: 600 }}>
                    Estado
                  </th>
                  <th
                    style={{ padding: "14px 16px", fontWeight: 600 }}
                    className="text-center"
                  >
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr
                    key={order.id}
                    style={{
                      borderBottom: "1px solid #f5f5f5",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#e9d8a6")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    {/* N° Pedido */}
                    <td style={{ padding: "12px 16px" }}>
                      <span className="fw-bold" style={{ color: "#ee9b00" }}>
                        {order.pedNum}
                      </span>
                    </td>

                    {/* Fecha */}
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ fontSize: 13 }}>
                        {order.fecha}
                        <br />
                        <span className="text-muted">{order.hora}</span>
                      </span>
                    </td>

                    {/* Cliente */}
                    <td style={{ padding: "12px 16px" }}>
                      <span className="fw-semibold">{order.cliente}</span>
                      <br />
                      <span
                        className="text-muted"
                        style={{ fontSize: 12 }}
                      >
                        {order.whatsapp}
                      </span>
                    </td>

                    {/* Productos */}
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ fontSize: 13 }}>
                        {order.productos.length === 1
                          ? order.productos[0].nombre
                          : `${order.productos[0].nombre} y ${
                              order.productos.length - 1
                            } más`}
                      </span>
                    </td>

                    {/* Total */}
                    <td style={{ padding: "12px 16px" }}>
                      <span className="fw-bold" style={{ color: "#2e7d32" }}>
                        {formatPrice(order.total)}
                      </span>
                    </td>

                    {/* Estado */}
                    <td style={{ padding: "12px 16px" }}>
                      <EstadoBadge estado={order.estado} />
                    </td>

                    {/* Acción */}
                    <td
                      style={{ padding: "12px 16px" }}
                      className="text-center"
                    >
                      <button
                        type="button"
                        className="btn btn-sm d-inline-flex align-items-center gap-1"
                        onClick={() => onViewDetail?.(order)}
                        title="Ver detalle del pedido"
                        style={{
                          background: "#ee9b00",
                          color: "#fff",
                          border: "none",
                          borderRadius: 8,
                          padding: "6px 14px",
                          fontSize: 13,
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#ca6702";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "#ee9b00";
                        }}
                      >
                        👁️ Ver detalle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pie: total de pedidos */}
          <div
            className="d-flex justify-content-between align-items-center mt-2"
            style={{ fontSize: 13, color: "#888" }}
          >
            <span>
              Mostrando {filtered.length} de {orders.length} pedidos
            </span>
            {(search.trim() || statusFilter) && (
              <button
                type="button"
                className="btn btn-sm"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#ee9b00",
                  textDecoration: "underline",
                }}
                onClick={() => {
                  setSearch("");
                  setStatusFilter("");
                }}
              >
                Limpiar filtros
              </button>
            )}
          </div>
        </div>
      )}

      {/* Vista móvil — cards en lugar de tabla */}
      {!loading && !error && (
        <div className="d-md-none">
          <div className="d-flex flex-column gap-3">
            {filtered.map((order) => (
              <div
                key={order.id}
                className="card border-0 shadow-sm"
                style={{ borderRadius: 16, overflow: "hidden" }}
              >
                <div className="card-body p-3">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <span
                        className="fw-bold"
                        style={{ color: "#ee9b00", fontSize: 15 }}
                      >
                        {order.pedNum}
                      </span>
                      <div
                        className="text-muted"
                        style={{ fontSize: 12 }}
                      >
                        {order.fecha} {order.hora}
                      </div>
                    </div>
                    <EstadoBadge estado={order.estado} />
                  </div>

                  <div className="fw-semibold mb-1" style={{ fontSize: 14 }}>
                    {order.cliente}
                  </div>
                  <div
                    className="text-muted"
                    style={{ fontSize: 13, marginBottom: 4 }}
                  >
                    {order.whatsapp}
                  </div>
                  <div style={{ fontSize: 13, marginBottom: 8 }}>
                    {order.productos.length === 1
                      ? order.productos[0].nombre
                      : `${order.productos[0].nombre} y ${
                          order.productos.length - 1
                        } más`}
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <span
                      className="fw-bold"
                      style={{ color: "#2e7d32", fontSize: 16 }}
                    >
                      {formatPrice(order.total)}
                    </span>

                    <button
                      type="button"
                      className="btn btn-sm d-inline-flex align-items-center gap-1"
                      onClick={() => onViewDetail?.(order)}
                      title="Ver detalle del pedido"
                      style={{
                        background: "#ee9b00",
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        padding: "6px 14px",
                        fontSize: 13,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#ca6702";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#ee9b00";
                      }}
                    >
                      👁️ Detalle
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pie móvil */}
          <div
            className="d-flex justify-content-between align-items-center mt-2"
            style={{ fontSize: 13, color: "#888" }}
          >
            <span>
              Mostrando {filtered.length} de {orders.length} pedidos
            </span>
            {(search.trim() || statusFilter) && (
              <button
                type="button"
                className="btn btn-sm"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#ee9b00",
                  textDecoration: "underline",
                }}
                onClick={() => {
                  setSearch("");
                  setStatusFilter("");
                }}
              >
                Limpiar filtros
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

