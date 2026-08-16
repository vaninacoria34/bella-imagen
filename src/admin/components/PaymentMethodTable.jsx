import { useState, useMemo } from "react";

/**
 * PaymentMethodTable
 * ─────────────────────────────────────────────────
 * Tabla responsive de métodos de pago con búsqueda/filtro.
 *
 * Props:
 *   paymentMethods → array de métodos de pago
 *   loading        → booleano (muestra spinner)
 *   error          → string (muestra alerta)
 *   onEdit         → fn(method) — ejecuta edición del método
 *   onDelete       → fn(method) — abre modal de confirmación para eliminar
 *   onToggleEstado → fn(method) — activa/desactiva el método
 */
export default function PaymentMethodTable({
  paymentMethods,
  loading,
  error,
  onEdit,
  onDelete,
  onToggleEstado,
}) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return paymentMethods;
    const q = search.toLowerCase();
    return paymentMethods.filter(
      (m) =>
        m.nombre.toLowerCase().includes(q) ||
        (m.descripcion || "").toLowerCase().includes(q)
    );
  }, [paymentMethods, search]);

  const EstadoBadge = ({ estado }) => {
    const isActive = estado === "Activa";
    return (
      <span
        className="badge rounded-pill"
        style={{
          background: isActive ? "#e8f5e9" : "#e9d8a6",
          color: isActive ? "#2e7d32" : "#c62828",
          fontSize: 12,
          fontWeight: 600,
          padding: "6px 14px",
        }}
      >
        {isActive ? "● Activa" : "○ Inactiva"}
      </span>
    );
  };

  const renderSearchBox = () => (
    <div className="mb-3" style={{ maxWidth: 360 }}>
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
          placeholder="Buscar método de pago..."
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
  );

  const renderEmpty = () => (
    <div className="text-center py-5 text-muted">
      <div style={{ fontSize: 48, marginBottom: 12 }}>💳</div>
      <p className="fw-semibold mb-1">
        {search.trim()
          ? "No se encontraron métodos de pago con ese filtro."
          : "No hay métodos de pago para mostrar."}
      </p>
      <p className="mb-3" style={{ fontSize: 14 }}>
        {search.trim()
          ? "Intentá con otros términos de búsqueda."
          : "Agregá tu primer método de pago para comenzar."}
      </p>
      {search.trim() && (
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
          onClick={() => setSearch("")}
        >
          Limpiar filtro
        </button>
      )}
    </div>
  );

  if (!loading && !error && filtered.length === 0) {
    return (
      <section>
        {renderSearchBox()}
        {renderEmpty()}
      </section>
    );
  }

  const actionBtnStyle = (border, color, bgHover) => ({
    background: "transparent",
    border: `1px solid ${border}`,
    color,
    borderRadius: 8,
    padding: "6px 10px",
    fontSize: 13,
    cursor: "pointer",
    transition: "all 0.2s ease",
  });

  const btnEdit = (method) => (
    <button
      type="button"
      className="btn btn-sm d-inline-flex align-items-center gap-1"
      onClick={() => onEdit?.(method)}
      title="Editar método de pago"
      style={actionBtnStyle("#f3c6de", "#ee9b00", "#e9d8a6")}
    >
      ✏️ Editar
    </button>
  );

  const btnDelete = (method) => (
    <button
      type="button"
      className="btn btn-sm d-inline-flex align-items-center gap-1"
      onClick={() => onDelete?.(method)}
      title="Eliminar método de pago"
      style={{
        background: "transparent",
        border: "1px solid #ffcdd2",
        color: "#e53935",
        borderRadius: 8,
        padding: "6px 10px",
        fontSize: 13,
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
    >
      🗑️ Eliminar
    </button>
  );

  const btnToggle = (method) => (
    <button
      type="button"
      className="btn btn-sm d-inline-flex align-items-center gap-1"
      onClick={() => onToggleEstado?.(method)}
      title={method.estado === "Activa" ? "Desactivar método" : "Activar método"}
      style={actionBtnStyle("#e0e0e0", "#555", "#e9d8a6")}
    >
      {method.estado === "Activa" ? "🔴" : "🟢"}
    </button>
  );

  return (
    <section>
      {renderSearchBox()}

      {/* Loading */}
      {loading && (
        <div className="d-flex align-items-center gap-2 py-4 text-muted">
          <div
            className="spinner-border spinner-border-sm"
            role="status"
            style={{ color: "#ee9b00" }}
          />
          <span>Cargando métodos de pago…</span>
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

      {/* Contador */}
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
          <span style={{ fontSize: 18 }}>💳</span>
          <span className="fw-semibold">
            Total de métodos:{" "}
            <span style={{ color: "#ee9b00" }}>{paymentMethods.length}</span>
          </span>
          {search.trim() && (
            <span className="text-muted" style={{ fontSize: 13 }}>
              (filtrados: {filtered.length})
            </span>
          )}
        </div>
      )}

      {/* Tabla desktop */}
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
                  <th style={{ padding: "14px 16px", fontWeight: 600 }}>Icono</th>
                  <th style={{ padding: "14px 16px", fontWeight: 600 }}>Nombre</th>
                  <th style={{ padding: "14px 16px", fontWeight: 600 }}>Descripción</th>
                  <th style={{ padding: "14px 16px", fontWeight: 600 }}>Datos / Instrucciones</th>
                  <th style={{ padding: "14px 16px", fontWeight: 600 }}>Orden</th>
                  <th style={{ padding: "14px 16px", fontWeight: 600 }}>Estado</th>
                  <th
                    style={{ padding: "14px 16px", fontWeight: 600 }}
                    className="text-center"
                  >
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((method) => (
                  <tr
                    key={method.id}
                    style={{ borderBottom: "1px solid #f5f5f5" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#e9d8a6")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <td style={{ padding: "12px 16px", fontSize: 26, textAlign: "center" }}>
                      {method.icono}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span className="fw-semibold">{method.nombre}</span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          color: "#555",
                          fontSize: 13,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {method.descripcion || "—"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          color: "#555",
                          fontSize: 13,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {method.datos || "—"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span className="fw-semibold">{method.orden ?? "—"}</span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <EstadoBadge estado={method.estado} />
                    </td>
                    <td style={{ padding: "12px 16px" }} className="text-center">
                      <div className="d-flex gap-1 justify-content-center">
                        {btnToggle(method)}
                        {btnEdit(method)}
                        {btnDelete(method)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div
            className="d-flex justify-content-between align-items-center mt-2"
            style={{ fontSize: 13, color: "#888" }}
          >
            <span>
              Mostrando {filtered.length} de {paymentMethods.length} métodos
            </span>
            {search.trim() && (
              <button
                type="button"
                className="btn btn-sm"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#ee9b00",
                  textDecoration: "underline",
                }}
                onClick={() => setSearch("")}
              >
                Limpiar filtro
              </button>
            )}
          </div>
        </div>
      )}

      {/* Vista móvil */}
      {!loading && !error && (
        <div className="d-md-none">
          <div className="d-flex flex-column gap-3">
            {filtered.map((method) => (
              <div
                key={method.id}
                className="card border-0 shadow-sm"
                style={{ borderRadius: 16, overflow: "hidden" }}
              >
                <div className="card-body p-3">
                  <div className="d-flex gap-3">
                    <div
                      className="d-flex align-items-center justify-content-center"
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 12,
                        background: "#e9d8a6",
                        fontSize: 26,
                        flexShrink: 0,
                      }}
                    >
                      {method.icono}
                    </div>
                    <div className="flex-grow-1 min-w-0">
                      <div className="fw-semibold mb-1" style={{ fontSize: 15 }}>
                        {method.nombre}
                      </div>
                      <div className="d-flex flex-wrap gap-2 mb-1">
                        <EstadoBadge estado={method.estado} />
                        {method.orden && (
                          <span
                            className="badge rounded-pill"
                            style={{
                              background: "#e9d8a6",
                              color: "#ee9b00",
                              fontSize: 11,
                              fontWeight: 500,
                            }}
                          >
                            Orden: {method.orden}
                          </span>
                        )}
                      </div>
                      {method.descripcion && (
                        <p className="text-muted mb-1" style={{ fontSize: 13, lineHeight: 1.4 }}>
                          {method.descripcion}
                        </p>
                      )}
                      {method.datos && (
                        <p className="mb-0" style={{ fontSize: 12, color: "#888", lineHeight: 1.4 }}>
                          <strong>Datos:</strong> {method.datos}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="d-flex gap-2 mt-3 pt-2 border-top">
                    <button
                      type="button"
                      className="btn btn-sm flex-grow-1 d-inline-flex align-items-center justify-content-center gap-1"
                      onClick={() => onToggleEstado?.(method)}
                      style={actionBtnStyle("#e0e0e0", "#555", "#e9d8a6")}
                    >
                      {method.estado === "Activa" ? "🔴 Desactivar" : "🟢 Activar"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm flex-grow-1 d-inline-flex align-items-center justify-content-center gap-1"
                      onClick={() => onEdit?.(method)}
                      style={actionBtnStyle("#f3c6de", "#ee9b00", "#e9d8a6")}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm flex-grow-1 d-inline-flex align-items-center justify-content-center gap-1"
                      onClick={() => onDelete?.(method)}
                      style={actionBtnStyle("#ffcdd2", "#e53935", "#ffebee")}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            className="d-flex justify-content-between align-items-center mt-2"
            style={{ fontSize: 13, color: "#888" }}
          >
            <span>
              Mostrando {filtered.length} de {paymentMethods.length} métodos
            </span>
            {search.trim() && (
              <button
                type="button"
                className="btn btn-sm"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#ee9b00",
                  textDecoration: "underline",
                }}
                onClick={() => setSearch("")}
              >
                Limpiar filtro
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

