import { useState, useMemo } from "react";

/**
 * MessageTable
 * ─────────────────────────────────────────────────
 * Tabla responsive de mensajes con búsqueda/filtro.
 *
 * Props:
 *   messages     → array de mensajes
 *   loading      → booleano (muestra spinner)
 *   error        → string (muestra alerta)
 *   onViewDetail → fn(message) — abre el detalle del mensaje
 *   onDelete     → fn(message) — abre modal de confirmación para eliminar
 */
export default function MessageTable({
  messages,
  loading,
  error,
  onViewDetail,
  onDelete,
}) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return messages;
    const q = search.toLowerCase();
    return messages.filter(
      (m) =>
        (m.nombre || "").toLowerCase().includes(q) ||
        (m.email || "").toLowerCase().includes(q) ||
        (m.asunto || "").toLowerCase().includes(q) ||
        (m.mensaje || "").toLowerCase().includes(q)
    );
  }, [messages, search]);

  const EstadoBadge = ({ estado }) => {
    const styles = {
      Nuevo: { bg: "#e9d8a6", color: "#ee9b00" },
      Leído: { bg: "#e0f2fe", color: "#0369a1" },
      Respondido: { bg: "#e8f5e9", color: "#2e7d32" },
    };
    const s = styles[estado] || styles.Nuevo;
    return (
      <span
        className="badge rounded-pill"
        style={{
          background: s.bg,
          color: s.color,
          fontSize: 12,
          fontWeight: 600,
          padding: "6px 14px",
        }}
      >
        {estado === "Nuevo" ? "● " : "○ "}
        {estado}
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
          placeholder="Buscar mensaje (nombre, asunto, email)..."
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
      <div style={{ fontSize: 48, marginBottom: 12 }}>💬</div>
      <p className="fw-semibold mb-1">
        {search.trim()
          ? "No se encontraron mensajes con ese filtro."
          : "No hay mensajes para mostrar."}
      </p>
      <p className="mb-3" style={{ fontSize: 14 }}>
        {search.trim()
          ? "Intentá con otros términos de búsqueda."
          : "Los mensajes de contacto aparecerán acá."}
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

  const btnView = (message) => (
    <button
      type="button"
      className="btn btn-sm d-inline-flex align-items-center gap-1"
      onClick={() => onViewDetail?.(message)}
      title="Ver detalle"
      style={{
        background: "transparent",
        border: "1px solid #e9d8a6",
        color: "#ee9b00",
        borderRadius: 8,
        padding: "6px 10px",
        fontSize: 13,
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
    >
      👁️ Ver
    </button>
  );

  const btnDelete = (message) => (
    <button
      type="button"
      className="btn btn-sm d-inline-flex align-items-center gap-1"
      onClick={() => onDelete?.(message)}
      title="Eliminar mensaje"
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
          <span>Cargando mensajes…</span>
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
          <span style={{ fontSize: 18 }}>💬</span>
          <span className="fw-semibold">
            Total de mensajes:{" "}
            <span style={{ color: "#ee9b00" }}>{messages.length}</span>
          </span>
          {messages.filter((m) => m.estado === "Nuevo").length > 0 && (
            <span className="text-muted" style={{ fontSize: 13 }}>
              · <strong style={{ color: "#ee9b00" }}>
                {messages.filter((m) => m.estado === "Nuevo").length} nuevos
              </strong>
            </span>
          )}
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
                  <th style={{ padding: "14px 16px", fontWeight: 600 }}>De</th>
                  <th style={{ padding: "14px 16px", fontWeight: 600 }}>Asunto</th>
                  <th style={{ padding: "14px 16px", fontWeight: 600 }}>Fecha</th>
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
                {filtered.map((message) => (
                  <tr
                    key={message.id}
                    style={{
                      borderBottom: "1px solid #f5f5f5",
                      background: message.estado === "Nuevo" ? "#fffaf0" : "#fff",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#e9d8a6")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background =
                        message.estado === "Nuevo" ? "#fffaf0" : "#fff")
                    }
                  >
                    <td style={{ padding: "12px 16px" }}>
                      <div className="fw-semibold" style={{ color: "#001219" }}>
                        {message.nombre}
                      </div>
                      <div
                        style={{ color: "#888", fontSize: 12 }}
                      >
                        {message.email || "Sin email"}
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          color: "#555",
                          fontSize: 13,
                          display: "-webkit-box",
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {message.asunto || "Consulta general"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ color: "#555", fontSize: 13 }}>
                        {message.fecha}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <EstadoBadge estado={message.estado} />
                    </td>
                    <td style={{ padding: "12px 16px" }} className="text-center">
                      <div className="d-flex gap-1 justify-content-center">
                        {btnView(message)}
                        {btnDelete(message)}
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
              Mostrando {filtered.length} de {messages.length} mensajes
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
            {filtered.map((message) => (
              <div
                key={message.id}
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
                      💬
                    </div>
                    <div className="flex-grow-1 min-w-0">
                      <div className="fw-bold mb-1" style={{ fontSize: 15, color: "#001219" }}>
                        {message.nombre}
                      </div>
                      <div className="d-flex flex-wrap gap-2 mb-1">
                        <EstadoBadge estado={message.estado} />
                        <span
                          className="badge rounded-pill"
                          style={{
                            background: "#fff",
                            color: "#ee9b00",
                            fontSize: 11,
                            fontWeight: 500,
                            border: "1px solid #e9d8a6",
                          }}
                        >
                          {message.fecha}
                        </span>
                      </div>
                      <p
                        className="text-muted mb-0"
                        style={{ fontSize: 13, lineHeight: 1.4 }}
                      >
                        <strong>{message.asunto || "Consulta general"}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="d-flex gap-2 mt-3 pt-2 border-top">
                    <button
                      type="button"
                      className="btn btn-sm flex-grow-1 d-inline-flex align-items-center justify-content-center gap-1"
                      onClick={() => onViewDetail?.(message)}
                      style={{
                        background: "transparent",
                        border: "1px solid #e9d8a6",
                        color: "#ee9b00",
                        borderRadius: 8,
                      }}
                    >
                      👁️ Ver
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm flex-grow-1 d-inline-flex align-items-center justify-content-center gap-1"
                      onClick={() => onDelete?.(message)}
                      style={{
                        background: "transparent",
                        border: "1px solid #ffcdd2",
                        color: "#e53935",
                        borderRadius: 8,
                      }}
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
              Mostrando {filtered.length} de {messages.length} mensajes
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
