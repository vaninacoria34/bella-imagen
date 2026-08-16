import { useState, useMemo } from "react";
import formatPrice from "../utils/formatPrice";

/**
 * PromotionTable
 * ─────────────────────────────────────────────────
 * Tabla responsive de promociones con búsqueda/filtro.
 *
 * Props:
 *   promotions     → array de promociones
 *   loading        → booleano (muestra spinner)
 *   error          → string (muestra alerta)
 *   onEdit         → fn(promotion) — ejecuta edición de la promoción
 *   onDelete       → fn(promotion) — abre modal de confirmación para eliminar
 *   onToggleEstado → fn(promotion) — activa/desactiva la promoción
 */
export default function PromotionTable({
  promotions,
  loading,
  error,
  onEdit,
  onDelete,
  onToggleEstado,
}) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return promotions;
    const q = search.toLowerCase();
    return promotions.filter(
      (p) =>
        p.codigo.toLowerCase().includes(q) ||
        (p.descripcion || "").toLowerCase().includes(q)
    );
  }, [promotions, search]);

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

  const DescuentoBadge = ({ tipo, valor }) => (
    <span
      className="badge rounded-pill"
      style={{
        background: tipo === "porcentaje" ? "#ede9fe" : "#e0f2fe",
        color: tipo === "porcentaje" ? "#6d28d9" : "#0369a1",
        fontSize: 12,
        fontWeight: 600,
        padding: "6px 14px",
      }}
    >
      {tipo === "porcentaje" ? `${valor}%` : formatPrice(valor)}
    </span>
  );

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
          placeholder="Buscar promoción por código..."
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
      <div style={{ fontSize: 48, marginBottom: 12 }}>🎟</div>
      <p className="fw-semibold mb-1">
        {search.trim()
          ? "No se encontraron promociones con ese filtro."
          : "No hay promociones para mostrar."}
      </p>
      <p className="mb-3" style={{ fontSize: 14 }}>
        {search.trim()
          ? "Intentá con otros términos de búsqueda."
          : "Agregá tu primera promoción para comenzar."}
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

  const btnEdit = (promotion) => (
    <button
      type="button"
      className="btn btn-sm d-inline-flex align-items-center gap-1"
      onClick={() => onEdit?.(promotion)}
      title="Editar promoción"
      style={actionBtnStyle("#f3c6de", "#ee9b00", "#e9d8a6")}
    >
      ✏️ Editar
    </button>
  );

  const btnDelete = (promotion) => (
    <button
      type="button"
      className="btn btn-sm d-inline-flex align-items-center gap-1"
      onClick={() => onDelete?.(promotion)}
      title="Eliminar promoción"
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

  const btnToggle = (promotion) => (
    <button
      type="button"
      className="btn btn-sm d-inline-flex align-items-center gap-1"
      onClick={() => onToggleEstado?.(promotion)}
      title={promotion.estado === "Activa" ? "Desactivar promoción" : "Activar promoción"}
      style={actionBtnStyle("#e0e0e0", "#555", "#e9d8a6")}
    >
      {promotion.estado === "Activa" ? "🔴" : "🟢"}
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
          <span>Cargando promociones…</span>
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
          <span style={{ fontSize: 18 }}>🎟</span>
          <span className="fw-semibold">
            Total de promociones:{" "}
            <span style={{ color: "#ee9b00" }}>{promotions.length}</span>
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
                  <th style={{ padding: "14px 16px", fontWeight: 600 }}>Código</th>
                  <th style={{ padding: "14px 16px", fontWeight: 600 }}>Descuento</th>
                  <th style={{ padding: "14px 16px", fontWeight: 600 }}>Descripción</th>
                  <th style={{ padding: "14px 16px", fontWeight: 600 }}>Vigencia</th>
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
                {filtered.map((promotion) => (
                  <tr
                    key={promotion.id}
                    style={{ borderBottom: "1px solid #f5f5f5" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#e9d8a6")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <td style={{ padding: "12px 16px" }}>
                      <span className="fw-bold" style={{ color: "#ee9b00", letterSpacing: 0.5 }}>
                        {promotion.codigo}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <DescuentoBadge tipo={promotion.tipo} valor={promotion.valor} />
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
                        {promotion.descripcion || "—"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ color: "#555", fontSize: 13 }}>
                        {promotion.fechaInicio || "—"}
                        {promotion.fechaFin ? ` → ${promotion.fechaFin}` : ""}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <EstadoBadge estado={promotion.estado} />
                    </td>
                    <td style={{ padding: "12px 16px" }} className="text-center">
                      <div className="d-flex gap-1 justify-content-center">
                        {btnToggle(promotion)}
                        {btnEdit(promotion)}
                        {btnDelete(promotion)}
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
              Mostrando {filtered.length} de {promotions.length} promociones
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
            {filtered.map((promotion) => (
              <div
                key={promotion.id}
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
                      🎟
                    </div>
                    <div className="flex-grow-1 min-w-0">
                      <div className="fw-bold mb-1" style={{ fontSize: 15, color: "#ee9b00" }}>
                        {promotion.codigo}
                      </div>
                      <div className="d-flex flex-wrap gap-2 mb-1">
                        <EstadoBadge estado={promotion.estado} />
                        <DescuentoBadge tipo={promotion.tipo} valor={promotion.valor} />
                      </div>
                      {promotion.descripcion && (
                        <p className="text-muted mb-1" style={{ fontSize: 13, lineHeight: 1.4 }}>
                          {promotion.descripcion}
                        </p>
                      )}
                      {(promotion.fechaInicio || promotion.fechaFin) && (
                        <p className="mb-0" style={{ fontSize: 12, color: "#888", lineHeight: 1.4 }}>
                          <strong>Vigencia:</strong> {promotion.fechaInicio || "—"}
                          {promotion.fechaFin ? ` → ${promotion.fechaFin}` : ""}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="d-flex gap-2 mt-3 pt-2 border-top">
                    <button
                      type="button"
                      className="btn btn-sm flex-grow-1 d-inline-flex align-items-center justify-content-center gap-1"
                      onClick={() => onToggleEstado?.(promotion)}
                      style={actionBtnStyle("#e0e0e0", "#555", "#e9d8a6")}
                    >
                      {promotion.estado === "Activa" ? "🔴 Desactivar" : "🟢 Activar"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm flex-grow-1 d-inline-flex align-items-center justify-content-center gap-1"
                      onClick={() => onEdit?.(promotion)}
                      style={actionBtnStyle("#f3c6de", "#ee9b00", "#e9d8a6")}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm flex-grow-1 d-inline-flex align-items-center justify-content-center gap-1"
                      onClick={() => onDelete?.(promotion)}
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
              Mostrando {filtered.length} de {promotions.length} promociones
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
