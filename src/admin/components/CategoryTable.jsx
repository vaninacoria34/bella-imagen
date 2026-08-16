import { useState, useMemo } from "react";

/**
 * CategoryTable
 * ─────────────────────────────────────────────────
 * Tabla responsive de categorías con búsqueda/filtro.
 *
 * Props:
 *   categories  → array de categorías normalizadas
 *   loading     → booleano (muestra spinner)
 *   error       → string (muestra alerta)
 *   onEdit      → fn(category) — ejecuta edición de la categoría
 *   onDelete    → fn(category) — abre modal de confirmación para eliminar
 *   onToggleEstado → fn(category) — activa/desactiva categoría
 */
export default function CategoryTable({
  categories,
  loading,
  error,
  onEdit,
  onDelete,
  onToggleEstado,
}) {
  const [search, setSearch] = useState("");

  // Filtro local por nombre (insensible a mayúsculas)
  const filtered = useMemo(() => {
    if (!search.trim()) return categories;
    const q = search.toLowerCase();
    return categories.filter((c) => c.name.toLowerCase().includes(q));
  }, [categories, search]);

  // ── Badge de estado ──────────────────────────────
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

  // ── Estado vacío ─────────────────────────────────
  if (!loading && !error && filtered.length === 0) {
    return (
      <section>
        {/* Buscador */}
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
              placeholder="Buscar por nombre..."
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

        <div className="text-center py-5 text-muted">
          <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
          <p className="fw-semibold mb-1">
            {search.trim()
              ? "No se encontraron categorías con ese filtro."
              : "No hay categorías para mostrar."}
          </p>
          <p className="mb-3" style={{ fontSize: 14 }}>
            {search.trim()
              ? "Intentá con otros términos de búsqueda."
              : "Agregá tu primera categoría para comenzar."}
          </p>
          <div className="d-flex justify-content-center gap-2">
            {search.trim() ? (
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
            ) : null}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      {/* Buscador */}
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
            placeholder="Buscar por nombre..."
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

      {/* Loading */}
      {loading && (
        <div className="d-flex align-items-center gap-2 py-4 text-muted">
          <div
            className="spinner-border spinner-border-sm"
            role="status"
            style={{ color: "#ee9b00" }}
          />
          <span>Cargando categorías…</span>
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

      {/* Contador de categorías */}
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
          <span style={{ fontSize: 18 }}>📂</span>
          <span className="fw-semibold">
            Total de categorías:{" "}
            <span style={{ color: "#ee9b00" }}>{categories.length}</span>
          </span>
          {search.trim() && (
            <span className="text-muted" style={{ fontSize: 13 }}>
              (filtradas: {filtered.length})
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
                    Imagen
                  </th>
                  <th style={{ padding: "14px 16px", fontWeight: 600 }}>
                    Nombre
                  </th>
                  <th style={{ padding: "14px 16px", fontWeight: 600 }}>
                    Descripción
                  </th>
                  <th style={{ padding: "14px 16px", fontWeight: 600 }}>
                    Orden
                  </th>
                  <th style={{ padding: "14px 16px", fontWeight: 600 }}>
                    Estado
                  </th>
                  <th
                    style={{ padding: "14px 16px", fontWeight: 600 }}
                    className="text-center"
                  >
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((category) => (
                  <tr
                    key={category.id}
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
                    {/* Imagen */}
                    <td style={{ padding: "12px 16px" }}>
                      <img
                        src={category.image}
                        alt={category.name}
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 12,
                          objectFit: "cover",
                          border: "2px solid #e9d8a6",
                        }}
                      />
                    </td>

                    {/* Nombre */}
                    <td style={{ padding: "12px 16px" }}>
                      <span className="fw-semibold">{category.name}</span>
                    </td>

                    {/* Descripción */}
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
                        {category.description || "—"}
                      </span>
                    </td>

                    {/* Orden */}
                    <td style={{ padding: "12px 16px" }}>
                      <span className="fw-semibold">{category.orden ?? "—"}</span>
                    </td>

                    {/* Estado */}
                    <td style={{ padding: "12px 16px" }}>
                      <EstadoBadge estado={category.estado} />
                    </td>

                    {/* Acciones */}
                    <td
                      style={{ padding: "12px 16px" }}
                      className="text-center"
                    >
                      <div className="d-flex gap-1 justify-content-center">
                        {/* Activar / Desactivar */}
                        <button
                          type="button"
                          className="btn btn-sm d-inline-flex align-items-center gap-1"
                          onClick={() => onToggleEstado?.(category)}
                          title={
                            category.estado === "Activa"
                              ? "Desactivar categoría"
                              : "Activar categoría"
                          }
                          style={{
                            background: "transparent",
                            border: "1px solid #e0e0e0",
                            color: "#555",
                            borderRadius: 8,
                            padding: "6px 10px",
                            fontSize: 13,
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#e9d8a6";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                          }}
                        >
                          {category.estado === "Activa" ? "🔴" : "🟢"}
                        </button>

                        {/* Editar */}
                        <button
                          type="button"
                          className="btn btn-sm d-inline-flex align-items-center gap-1"
                          onClick={() => onEdit?.(category)}
                          title="Editar categoría"
                          style={{
                            background: "transparent",
                            border: "1px solid #f3c6de",
                            color: "#ee9b00",
                            borderRadius: 8,
                            padding: "6px 12px",
                            fontSize: 13,
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#e9d8a6";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                          }}
                        >
                          ✏️ Editar
                        </button>

                        {/* Eliminar */}
                        <button
                          type="button"
                          className="btn btn-sm d-inline-flex align-items-center gap-1"
                          onClick={() => onDelete?.(category)}
                          title="Eliminar categoría"
                          style={{
                            background: "transparent",
                            border: "1px solid #ffcdd2",
                            color: "#e53935",
                            borderRadius: 8,
                            padding: "6px 12px",
                            fontSize: 13,
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#ffebee";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                          }}
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pie: total de categorías */}
          <div
            className="d-flex justify-content-between align-items-center mt-2"
            style={{ fontSize: 13, color: "#888" }}
          >
            <span>
              Mostrando {filtered.length} de {categories.length} categorías
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

      {/* Vista móvil — cards en lugar de tabla */}
      {!loading && !error && (
        <div className="d-md-none">
          <div className="d-flex flex-column gap-3">
            {filtered.map((category) => (
              <div
                key={category.id}
                className="card border-0 shadow-sm"
                style={{ borderRadius: 16, overflow: "hidden" }}
              >
                <div className="card-body p-3">
                  <div className="d-flex gap-3">
                    {/* Imagen */}
                    <img
                      src={category.image}
                      alt={category.name}
                      style={{
                        width: 72,
                        height: 72,
                        borderRadius: 12,
                        objectFit: "cover",
                        border: "2px solid #e9d8a6",
                        flexShrink: 0,
                      }}
                    />

                    {/* Info */}
                    <div className="flex-grow-1 min-w-0">
                      <div className="fw-semibold mb-1" style={{ fontSize: 15 }}>
                        {category.name}
                      </div>
                      <div className="d-flex flex-wrap gap-2 mb-1">
                        <EstadoBadge estado={category.estado} />
                        {category.orden && (
                          <span
                            className="badge rounded-pill"
                            style={{
                              background: "#e9d8a6",
                              color: "#ee9b00",
                              fontSize: 11,
                              fontWeight: 500,
                            }}
                          >
                            Orden: {category.orden}
                          </span>
                        )}
                      </div>
                      {category.description && (
                        <p
                          className="text-muted mb-0"
                          style={{ fontSize: 13, lineHeight: 1.4 }}
                        >
                          {category.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Acciones móvil */}
                  <div className="d-flex gap-2 mt-3 pt-2 border-top">
                    <button
                      type="button"
                      className="btn btn-sm flex-grow-1 d-inline-flex align-items-center justify-content-center gap-1"
                      onClick={() => onToggleEstado?.(category)}
                      title={
                        category.estado === "Activa"
                          ? "Desactivar categoría"
                          : "Activar categoría"
                      }
                      style={{
                        background: "transparent",
                        border: "1px solid #e0e0e0",
                        color: "#555",
                        borderRadius: 8,
                        padding: "6px 10px",
                        fontSize: 13,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#e9d8a6";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      {category.estado === "Activa" ? "🔴 Desactivar" : "🟢 Activar"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm flex-grow-1 d-inline-flex align-items-center justify-content-center gap-1"
                      onClick={() => onEdit?.(category)}
                      title="Editar categoría"
                      style={{
                        background: "transparent",
                        border: "1px solid #f3c6de",
                        color: "#ee9b00",
                        borderRadius: 8,
                        padding: "6px 12px",
                        fontSize: 13,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#e9d8a6";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm flex-grow-1 d-inline-flex align-items-center justify-content-center gap-1"
                      onClick={() => onDelete?.(category)}
                      title="Eliminar categoría"
                      style={{
                        background: "transparent",
                        border: "1px solid #ffcdd2",
                        color: "#e53935",
                        borderRadius: 8,
                        padding: "6px 12px",
                        fontSize: 13,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#ffebee";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      🗑️ Eliminar
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
              Mostrando {filtered.length} de {categories.length} categorías
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

