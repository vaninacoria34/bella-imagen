/**
 * CustomerDetailModal
 * ─────────────────────────────────────────────────
 * Modal Bootstrap que muestra el detalle completo de un cliente.
 *
 * Props:
 *   show      → booleano
 *   customer  → objeto cliente
 *   onClose   → fn()
 */

const EstadoBadge = ({ estado }) => {
  const isActive = estado === "Activo";
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
      {isActive ? "● Activo" : "○ Inactivo"}
    </span>
  );
};

export default function CustomerDetailModal({
  show,
  customer,
  onClose,
}) {
  if (!show || !customer) return null;

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
                👤 {customer.nombre} {customer.apellido}
              </h5>
              <p className="text-muted mb-0" style={{ fontSize: 14 }}>
                Detalle completo del cliente
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
              {/* Estado */}
              <div className="col-12">
                <EstadoBadge estado={customer.estado} />
              </div>

              {/* Información personal */}
              <div className="col-12">
                <h6 className="fw-semibold mb-2" style={{ fontSize: 14, color: "#ee9b00" }}>
                  📋 Información personal
                </h6>
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold" style={{ fontSize: 12, color: "#888" }}>
                  Nombre completo
                </label>
                <div style={{ fontSize: 15 }}>
                  {customer.nombre} {customer.apellido}
                </div>
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold" style={{ fontSize: 12, color: "#888" }}>
                  Email
                </label>
                <div style={{ fontSize: 14 }}>{customer.email}</div>
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold" style={{ fontSize: 12, color: "#888" }}>
                  WhatsApp
                </label>
                <div style={{ fontSize: 14 }}>{customer.whatsapp}</div>
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold" style={{ fontSize: 12, color: "#888" }}>
                  Fecha de registro
                </label>
                <div style={{ fontSize: 14 }}>{customer.fechaRegistro}</div>
              </div>

              {/* Dirección */}
              <div className="col-12">
                <hr style={{ borderTop: "1px solid #e9d8a6" }} />
                <h6 className="fw-semibold mb-2" style={{ fontSize: 14, color: "#ee9b00" }}>
                  📍 Dirección
                </h6>
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold" style={{ fontSize: 12, color: "#888" }}>
                  Dirección
                </label>
                <div style={{ fontSize: 14 }}>{customer.direccion}</div>
              </div>

              <div className="col-6 col-md-3">
                <label className="form-label fw-semibold" style={{ fontSize: 12, color: "#888" }}>
                  Ciudad
                </label>
                <div style={{ fontSize: 14 }}>{customer.ciudad}</div>
              </div>

              <div className="col-6 col-md-3">
                <label className="form-label fw-semibold" style={{ fontSize: 12, color: "#888" }}>
                  Código Postal
                </label>
                <div style={{ fontSize: 14 }}>{customer.codigoPostal}</div>
              </div>

              {/* Estadísticas */}
              <div className="col-12">
                <hr style={{ borderTop: "1px solid #e9d8a6" }} />
                <h6 className="fw-semibold mb-2" style={{ fontSize: 14, color: "#ee9b00" }}>
                  📊 Estadísticas de compras
                </h6>
              </div>

              <div className="col-6 col-md-4">
                <div
                  className="p-3 rounded-3 text-center"
                  style={{ background: "#e9d8a6" }}
                >
                  <div className="fw-bold" style={{ fontSize: 22, color: "#ee9b00" }}>
                    {customer.cantidadPedidos}
                  </div>
                  <div style={{ fontSize: 12, color: "#888" }}>Pedidos realizados</div>
                </div>
              </div>

              <div className="col-6 col-md-4">
                <div
                  className="p-3 rounded-3 text-center"
                  style={{ background: "#e8f5e9" }}
                >
                  <div className="fw-bold" style={{ fontSize: 22, color: "#2e7d32" }}>
                    $ {customer.totalComprado.toLocaleString("es-AR")}
                  </div>
                  <div style={{ fontSize: 12, color: "#888" }}>Total comprado</div>
                </div>
              </div>

              <div className="col-6 col-md-4">
                <div
                  className="p-3 rounded-3 text-center"
                  style={{ background: "#e3f2fd" }}
                >
                  <div className="fw-bold" style={{ fontSize: 16, color: "#1565c0" }}>
                    {customer.ultimaCompra || "Sin compras"}
                  </div>
                  <div style={{ fontSize: 12, color: "#888" }}>Última compra</div>
                </div>
              </div>

              {/* Observaciones */}
              {customer.observaciones && (
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
                    {customer.observaciones}
                  </div>
                </div>
              )}
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

