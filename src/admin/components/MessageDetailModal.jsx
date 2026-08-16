import { useState } from "react";
import { MESSAGE_STATUSES } from "../services/messageService";

/**
 * MessageDetailModal
 * ─────────────────────────────────────────────────
 * Modal Bootstrap que muestra el detalle completo de un mensaje
 * y permite cambiar su estado (Nuevo / Leído / Respondido).
 *
 * Props:
 *   show        → booleano (controla visibilidad)
 *   message     → objeto mensaje a visualizar
 *   onClose     → fn() — cierra el modal
 *   onStatusChange → fn(id, estado) — cambia el estado
 */

const STATUS_STYLES = {
  Nuevo: { bg: "#e9d8a6", color: "#ee9b00", dot: "🟡" },
  Leído: { bg: "#e0f2fe", color: "#0369a1", dot: "🔵" },
  Respondido: { bg: "#e8f5e9", color: "#2e7d32", dot: "🟢" },
};

export default function MessageDetailModal({
  show,
  message,
  onClose,
  onStatusChange,
}) {
  const [updating, setUpdating] = useState(false);

  if (!show || !message) return null;

  const currentStyle = STATUS_STYLES[message.estado] || STATUS_STYLES.Nuevo;

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    if (newStatus === message.estado) return;
    try {
      setUpdating(true);
      await onStatusChange(message.id, newStatus);
    } catch (err) {
      alert(
        err?.message ||
          "Ocurrió un error al cambiar el estado. Intentalo de nuevo."
      );
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div
      className="modal d-block"
      tabIndex={-1}
      role="dialog"
      style={{ background: "rgba(0,0,0,0.5)", overflowY: "auto" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
        role="document"
      >
        <div
          className="modal-content border-0"
          style={{ borderRadius: 18, overflow: "hidden" }}
        >
          {/* ── Header ──────────────────────────── */}
          <div
            className="modal-header border-0 px-4 pt-4 pb-0"
            style={{ background: "#fff" }}
          >
            <div>
              <h5 className="fw-bold mb-1" style={{ color: "#001219" }}>
                💬 {message.asunto || "Consulta general"}
              </h5>
              <p className="text-muted mb-0" style={{ fontSize: 14 }}>
                Mensaje de {message.nombre}
              </p>
            </div>
            <button
              type="button"
              className="btn-close"
              aria-label="Cerrar"
              onClick={onClose}
            />
          </div>

          {/* ── Body ────────────────────────────── */}
          <div className="modal-body px-4 py-3">
            <div className="row g-3">
              {/* Estado actual */}
              <div className="col-12 mb-2">
                <label className="form-label fw-semibold" style={{ fontSize: 14 }}>
                  Estado del mensaje
                </label>
                <select
                  className="form-select"
                  value={message.estado}
                  onChange={handleStatusChange}
                  disabled={updating}
                  style={{
                    borderRadius: 10,
                    padding: "10px 14px",
                    fontSize: 14,
                    border: "1px solid #e0e0e0",
                    background: currentStyle.bg,
                    fontWeight: 600,
                    color: currentStyle.color,
                    maxWidth: 260,
                  }}
                >
                  {MESSAGE_STATUSES.map((st) => {
                    const stStyle = STATUS_STYLES[st];
                    return (
                      <option key={st} value={st}>
                        {stStyle.dot} {st}
                      </option>
                    );
                  })}
                </select>
                {updating && (
                  <div className="text-muted mt-1" style={{ fontSize: 13 }}>
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      style={{ marginRight: 6 }}
                    />
                    Actualizando estado…
                  </div>
                )}
              </div>

              {/* Nombre */}
              <div className="col-6 col-md-4">
                <label className="form-label fw-semibold" style={{ fontSize: 12, color: "#888" }}>
                  Nombre
                </label>
                <div className="fw-semibold" style={{ fontSize: 15 }}>
                  {message.nombre}
                </div>
              </div>

              {/* Teléfono */}
              <div className="col-6 col-md-4">
                <label className="form-label fw-semibold" style={{ fontSize: 12, color: "#888" }}>
                  Teléfono
                </label>
                <div style={{ fontSize: 14 }}>{message.telefono || "—"}</div>
              </div>

              {/* Email */}
              <div className="col-6 col-md-4">
                <label className="form-label fw-semibold" style={{ fontSize: 12, color: "#888" }}>
                  Email
                </label>
                <div style={{ fontSize: 14 }}>{message.email || "—"}</div>
              </div>

              {/* Fecha */}
              <div className="col-12">
                <label className="form-label fw-semibold" style={{ fontSize: 12, color: "#888" }}>
                  Fecha
                </label>
                <div style={{ fontSize: 14 }}>{message.fecha}</div>
              </div>

              {/* Separador */}
              <div className="col-12">
                <hr style={{ borderTop: "1px solid #e9d8a6" }} />
              </div>

              {/* Asunto */}
              <div className="col-12">
                <label className="form-label fw-semibold" style={{ fontSize: 12, color: "#888" }}>
                  Asunto
                </label>
                <div className="fw-semibold" style={{ fontSize: 15 }}>
                  {message.asunto || "Consulta general"}
                </div>
              </div>

              {/* Mensaje */}
              <div className="col-12">
                <label className="form-label fw-semibold" style={{ fontSize: 12, color: "#888" }}>
                  Mensaje
                </label>
                <div
                  className="p-3 rounded-3"
                  style={{
                    background: "#e9d8a6",
                    fontSize: 14,
                    color: "#333",
                    whiteSpace: "pre-wrap",
                    lineHeight: 1.6,
                  }}
                >
                  {message.mensaje}
                </div>
              </div>
            </div>
          </div>

          {/* ── Footer ──────────────────────────── */}
          <div
            className="modal-footer border-0 px-4 pb-4 pt-2 gap-2"
            style={{ background: "#fff" }}
          >
            <button
              type="button"
              className="btn px-4 py-2"
              onClick={onClose}
              style={{
                background: "transparent",
                border: "1px solid #e0e0e0",
                color: "#333",
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
