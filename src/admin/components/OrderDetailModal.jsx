import { useState } from "react";
import { ORDER_STATUSES } from "../services/orderService";

/**
 * OrderDetailModal
 * ─────────────────────────────────────────────────
 * Modal Bootstrap que muestra el detalle completo de un pedido
 * y permite cambiar su estado.
 *
 * Props:
 *   show          → booleano (controla visibilidad)
 *   order         → objeto pedido a visualizar
 *   onClose       → fn() — cierra el modal
 *   onStatusChange → fn(id, newStatus) — cambia el estado
 */

const STATUS_STYLES = {
  Pendiente: { bg: "#fff8e1", color: "#f57f17", dot: "🟡" },
  Preparando: { bg: "#e3f2fd", color: "#1565c0", dot: "🔵" },
  Enviado: { bg: "#fff3e0", color: "#e65100", dot: "🟠" },
  Entregado: { bg: "#e8f5e9", color: "#2e7d32", dot: "🟢" },
  Cancelado: { bg: "#e9d8a6", color: "#c62828", dot: "🔴" },
};

export default function OrderDetailModal({
  show,
  order,
  onClose,
  onStatusChange,
}) {
  const [updating, setUpdating] = useState(false);

  if (!show || !order) return null;

  const currentStyle = STATUS_STYLES[order.estado] || STATUS_STYLES.Pendiente;

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    if (newStatus === order.estado) return;
    try {
      setUpdating(true);
      await onStatusChange(order.id, newStatus);
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
                🧾 Pedido {order.pedNum}
              </h5>
              <p className="text-muted mb-0" style={{ fontSize: 14 }}>
                Detalle completo del pedido
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
                  Estado del pedido
                </label>
                <select
                  className="form-select"
                  value={order.estado}
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
                  }}
                >
                  {ORDER_STATUSES.map((st) => {
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

              {/* Número de pedido */}
              <div className="col-6 col-md-3">
                <label className="form-label fw-semibold" style={{ fontSize: 12, color: "#888" }}>
                  N° Pedido
                </label>
                <div className="fw-bold" style={{ fontSize: 15 }}>
                  {order.pedNum}
                </div>
              </div>

              {/* Fecha */}
              <div className="col-6 col-md-3">
                <label className="form-label fw-semibold" style={{ fontSize: 12, color: "#888" }}>
                  Fecha
                </label>
                <div style={{ fontSize: 14 }}>{order.fecha}</div>
              </div>

              {/* Hora */}
              <div className="col-6 col-md-3">
                <label className="form-label fw-semibold" style={{ fontSize: 12, color: "#888" }}>
                  Hora
                </label>
                <div style={{ fontSize: 14 }}>{order.hora}</div>
              </div>

{/* Método de envío */}
              <div className="col-6 col-md-3">
                <label className="form-label fw-semibold" style={{ fontSize: 12, color: "#888" }}>
                  Método de envío
                </label>
                <div
                  className="badge rounded-pill"
                  style={{
                    background: "#e9d8a6",
                    color: "#ee9b00",
                    fontSize: 12,
                    fontWeight: 500,
                    padding: "6px 14px",
                  }}
                >
                  {order.metodoEnvio}
                </div>
              </div>

              {/* Método de pago */}
              <div className="col-6 col-md-3">
                <label className="form-label fw-semibold" style={{ fontSize: 12, color: "#888" }}>
                  Método de pago
                </label>
                <div
                  className="badge rounded-pill"
                  style={{
                    background: "#e8f5e9",
                    color: "#2e7d32",
                    fontSize: 12,
                    fontWeight: 500,
                    padding: "6px 14px",
                  }}
                >
                  {order.metodoPago || "—"}
                </div>
              </div>

              {/* Cliente */}
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold" style={{ fontSize: 12, color: "#888" }}>
                  Cliente
                </label>
                <div className="fw-semibold" style={{ fontSize: 15 }}>
                  {order.cliente}
                </div>
              </div>

              {/* WhatsApp */}
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold" style={{ fontSize: 12, color: "#888" }}>
                  WhatsApp
                </label>
                <div style={{ fontSize: 14 }}>{order.whatsapp}</div>
              </div>

              {/* Email */}
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold" style={{ fontSize: 12, color: "#888" }}>
                  Email
                </label>
                <div style={{ fontSize: 14 }}>{order.email}</div>
              </div>

              {/* Dirección */}
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold" style={{ fontSize: 12, color: "#888" }}>
                  Dirección
                </label>
                <div style={{ fontSize: 14 }}>{order.direccion}</div>
              </div>

              {/* Ciudad */}
              <div className="col-6 col-md-3">
                <label className="form-label fw-semibold" style={{ fontSize: 12, color: "#888" }}>
                  Ciudad
                </label>
                <div style={{ fontSize: 14 }}>{order.ciudad}</div>
              </div>

              {/* Código Postal */}
              <div className="col-6 col-md-3">
                <label className="form-label fw-semibold" style={{ fontSize: 12, color: "#888" }}>
                  Código Postal
                </label>
                <div style={{ fontSize: 14 }}>{order.codigoPostal}</div>
              </div>

              {/* Separador */}
              <div className="col-12">
                <hr style={{ borderTop: "1px solid #e9d8a6" }} />
              </div>

              {/* Productos comprados */}
              <div className="col-12">
                <label className="form-label fw-semibold" style={{ fontSize: 14 }}>
                  Productos comprados
                </label>
                <div
                  className="table-responsive"
                  style={{ borderRadius: 12, overflow: "hidden" }}
                >
                  <table
                    className="table align-middle mb-0"
                    style={{ fontSize: 14 }}
                  >
                    <thead>
                      <tr style={{ background: "#e9d8a6" }}>
                        <th style={{ padding: "10px 14px", fontWeight: 600 }}>
                          Producto
                        </th>
                        <th
                          style={{ padding: "10px 14px", fontWeight: 600 }}
                          className="text-center"
                        >
                          Categoría
                        </th>
                        <th
                          style={{ padding: "10px 14px", fontWeight: 600 }}
                          className="text-center"
                        >
                          Cant.
                        </th>
                        <th
                          style={{ padding: "10px 14px", fontWeight: 600 }}
                          className="text-end"
                        >
                          Precio
                        </th>
                        <th
                          style={{ padding: "10px 14px", fontWeight: 600 }}
                          className="text-end"
                        >
                          Subtotal
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.productos.map((prod, idx) => (
                        <tr
                          key={idx}
                          style={{ borderBottom: "1px solid #f5f5f5" }}
                        >
                          <td style={{ padding: "10px 14px" }}>
                            <div className="d-flex align-items-center gap-2">
                              {prod.imagen && (
                                <img
                                  src={prod.imagen}
                                  alt={prod.nombre}
                                  style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 8,
                                    objectFit: "cover",
                                    border: "1px solid #e9d8a6",
                                  }}
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              )}
                              <span>{prod.nombre}</span>
                            </div>
                          </td>
                          <td
                            style={{ padding: "10px 14px" }}
                            className="text-center"
                          >
                            <span
                              className="badge rounded-pill"
                              style={{
                                background: "#e9d8a6",
                                color: "#ee9b00",
                                fontSize: 11,
                                fontWeight: 500,
                              }}
                            >
                              {prod.categoria}
                            </span>
                          </td>
                          <td
                            style={{ padding: "10px 14px" }}
                            className="text-center"
                          >
                            {prod.cantidad}
                          </td>
                          <td
                            style={{ padding: "10px 14px" }}
                            className="text-end"
                          >
                            $ {prod.precio.toLocaleString("es-AR")}
                          </td>
                          <td
                            style={{ padding: "10px 14px" }}
                            className="text-end fw-semibold"
                          >
                            ${" "}
                            {(
                              prod.cantidad * prod.precio
                            ).toLocaleString("es-AR")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

{/* Totales */}
              <div className="col-12">
                <div className="d-flex flex-column align-items-end gap-1">
                  <div
                    className="d-flex justify-content-between"
                    style={{ width: 220, fontSize: 14 }}
                  >
                    <span className="text-muted">Subtotal:</span>
                    <span className="fw-semibold">
                      $ {order.subtotal.toLocaleString("es-AR")}
                    </span>
                  </div>
                  {order.descuento > 0 && (
                    <div
                      className="d-flex justify-content-between"
                      style={{ width: 220, fontSize: 14 }}
                    >
                      <span className="text-muted">
                        Descuento{order.promocion ? ` (${order.promocion})` : ""}:
                      </span>
                      <span className="fw-semibold" style={{ color: "#2e7d32" }}>
                        -$ {order.descuento.toLocaleString("es-AR")}
                      </span>
                    </div>
                  )}
                  <div
                    className="d-flex justify-content-between"
                    style={{ width: 220, fontSize: 14 }}
                  >
                    <span className="text-muted">Envío:</span>
                    <span className="fw-semibold">
                      {order.envio === 0
                        ? "Gratis"
                        : `$ ${order.envio.toLocaleString("es-AR")}`}
                    </span>
                  </div>
                  <div
                    className="d-flex justify-content-between"
                    style={{
                      width: 220,
                      fontSize: 16,
                      borderTop: "2px solid #e9d8a6",
                      paddingTop: 6,
                    }}
                  >
                    <span className="fw-bold">Total:</span>
                    <span
                      className="fw-bold"
                      style={{ color: "#2e7d32" }}
                    >
                      $ {order.total.toLocaleString("es-AR")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Observaciones */}
              {order.observaciones && (
                <div className="col-12">
                  <hr style={{ borderTop: "1px solid #e9d8a6" }} />
                  <label className="form-label fw-semibold" style={{ fontSize: 12, color: "#888" }}>
                    Observaciones
                  </label>
                  <div
                    className="p-3 rounded-3"
                    style={{
                      background: "#e9d8a6",
                      fontSize: 14,
                      color: "#333",
                    }}
                  >
                    {order.observaciones}
                  </div>
                </div>
              )}

              {/* Última actualización */}
              <div className="col-12">
                <hr style={{ borderTop: "1px solid #e9d8a6" }} />
                <div
                  className="text-muted"
                  style={{ fontSize: 12, textAlign: "right" }}
                >
                  Última actualización: {order.ultimaActualizacion}
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

