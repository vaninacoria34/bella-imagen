import formatPrice from "../utils/formatPrice";

/**
 * DeleteConfirmModal
 * ─────────────────────────────────────────────────
 * Modal Bootstrap de confirmación para eliminar un elemento.
 * Reutilizable para productos, categorías, clientes, métodos de pago,
 * métodos de envío, promociones y mensajes del panel.
 *
 * Props comunes:
 *   show      → booleano (controla visibilidad)
 *   item      → objeto a eliminar
 *   onClose   → fn() — cierra el modal sin eliminar
 *   onConfirm → fn() — ejecuta la eliminación
 *   deleting  → booleano (true mientras se elimina)
 *   itemType  → 'product' (default) | 'category' | 'customer' | 'paymentMethod' | 'shippingMethod' | 'promotion' | 'message'
 *
 * Props legacy (compatibilidad):
 *   product   → alias de item para componentes que aún lo usan
 */
export default function DeleteConfirmModal({
  show,
  product,
  item,
  onClose,
  onConfirm,
  deleting,
  itemType = "product",
}) {
  // Compatibilidad hacia atrás: si usan `product` como prop
  const entity = item || product;

  if (!show || !entity) return null;

  // ── Render según tipo ─────────────────────────
  const isCategory = itemType === "category";
  const isCustomer = itemType === "customer";
  const isPaymentMethod = itemType === "paymentMethod";
  const isShippingMethod = itemType === "shippingMethod";
  const isPromotion = itemType === "promotion";
  const isMessage = itemType === "message";

  const CustomerDetails = () => (
    <div
      className="d-flex align-items-start gap-3 p-3 rounded-3"
      style={{ background: "#e9d8a6" }}
    >
      <div className="flex-grow-1 min-w-0">
        <div className="fw-semibold mb-1" style={{ fontSize: 15 }}>
          {entity.nombre} {entity.apellido}
        </div>

        <div className="d-flex flex-wrap gap-2 mb-1">
          <span
            className="badge rounded-pill"
            style={{
              background:
                entity.estado === "Activo" ? "#e8f5e9" : "#e9d8a6",
              color:
                entity.estado === "Activo" ? "#2e7d32" : "#c62828",
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            {entity.estado === "Activo" ? "● Activo" : "○ Inactivo"}
          </span>
        </div>

        <div className="d-flex flex-column gap-1 mt-2" style={{ fontSize: 13, color: "#555" }}>
          <span>📧 {entity.email}</span>
          <span>📱 {entity.whatsapp}</span>
          <span>Pedidos: {entity.cantidadPedidos} | Total: $ {entity.totalComprado.toLocaleString("es-AR")}</span>
        </div>
      </div>
    </div>
  );

  const CategoryDetails = () => (
    <div
      className="d-flex align-items-start gap-3 p-3 rounded-3"
      style={{ background: "#e9d8a6" }}
    >
      {/* Imagen */}
      <img
        src={entity.image}
        alt={entity.name}
        style={{
          width: 72,
          height: 72,
          borderRadius: 12,
          objectFit: "cover",
          border: "2px solid #e9d8a6",
          flexShrink: 0,
        }}
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />

      {/* Datos de la categoría */}
      <div className="flex-grow-1 min-w-0">
        <div className="fw-semibold mb-1" style={{ fontSize: 15 }}>
          {entity.name}
        </div>

        <div className="d-flex flex-wrap gap-2 mb-1">
          <span
            className="badge rounded-pill"
            style={{
              background:
                entity.estado === "Activa" ? "#e8f5e9" : "#e9d8a6",
              color:
                entity.estado === "Activa" ? "#2e7d32" : "#c62828",
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            {entity.estado === "Activa" ? "● Activa" : "○ Inactiva"}
          </span>
          {entity.orden && (
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
              Orden: {entity.orden}
            </span>
          )}
        </div>

        {entity.description && (
          <p
            className="text-muted mb-0"
            style={{ fontSize: 13, lineHeight: 1.4 }}
          >
            {entity.description}
          </p>
        )}
      </div>
    </div>
  );

  const ProductDetails = () => (
    <div
      className="d-flex align-items-start gap-3 p-3 rounded-3"
      style={{ background: "#e9d8a6" }}
    >
      {/* Imagen */}
      <img
        src={entity.image}
        alt={entity.title}
        style={{
          width: 72,
          height: 72,
          borderRadius: 12,
          objectFit: "cover",
          border: "2px solid #e9d8a6",
          flexShrink: 0,
        }}
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />

      {/* Datos del producto */}
      <div className="flex-grow-1 min-w-0">
        <div className="fw-semibold mb-1" style={{ fontSize: 15 }}>
          {entity.title}
        </div>

        <div className="d-flex flex-wrap gap-2 mb-1">
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
            {entity.category}
          </span>
          <span
            className="badge rounded-pill"
            style={{
              background:
                entity.estado === "Activo" ? "#e8f5e9" : "#e9d8a6",
              color:
                entity.estado === "Activo" ? "#2e7d32" : "#c62828",
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            {entity.estado === "Activo" ? "● Activo" : "○ Inactivo"}
          </span>
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <span
            className="fw-bold"
            style={{ color: "#2e7d32", fontSize: 16 }}
          >
            {formatPrice(entity.price)}
          </span>
          <span
            className={`fw-semibold ${
              entity.stock > 0 ? "text-success" : "text-danger"
            }`}
            style={{ fontSize: 13 }}
          >
            Stock: {entity.stock > 0 ? entity.stock : "Sin stock"}
          </span>
        </div>
      </div>
    </div>
  );

  const PaymentMethodDetails = () => (
    <div
      className="d-flex align-items-start gap-3 p-3 rounded-3"
      style={{ background: "#e9d8a6" }}
    >
      <div
        className="d-flex align-items-center justify-content-center"
        style={{
          width: 56,
          height: 56,
          borderRadius: 12,
          background: "#fff",
          fontSize: 26,
          border: "2px solid #e9d8a6",
          flexShrink: 0,
        }}
      >
        {entity.icono || "💳"}
      </div>

      <div className="flex-grow-1 min-w-0">
        <div className="fw-semibold mb-1" style={{ fontSize: 15 }}>
          {entity.nombre}
        </div>

        <div className="d-flex flex-wrap gap-2 mb-1">
          <span
            className="badge rounded-pill"
            style={{
              background:
                entity.estado === "Activa" ? "#e8f5e9" : "#e9d8a6",
              color:
                entity.estado === "Activa" ? "#2e7d32" : "#c62828",
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            {entity.estado === "Activa" ? "● Activa" : "○ Inactiva"}
          </span>
          {entity.orden && (
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
              Orden: {entity.orden}
            </span>
          )}
        </div>

        {entity.descripcion && (
          <p
            className="text-muted mb-1"
            style={{ fontSize: 13, lineHeight: 1.4 }}
          >
            {entity.descripcion}
          </p>
        )}

        {entity.datos && (
          <p
            className="mb-0"
            style={{ fontSize: 12, color: "#888", lineHeight: 1.4 }}
          >
            <strong>Datos:</strong> {entity.datos}
          </p>
        )}
      </div>
    </div>
  );

  const ShippingMethodDetails = () => (
    <div
      className="d-flex align-items-start gap-3 p-3 rounded-3"
      style={{ background: "#e9d8a6" }}
    >
      <div
        className="d-flex align-items-center justify-content-center"
        style={{
          width: 56,
          height: 56,
          borderRadius: 12,
          background: "#fff",
          fontSize: 26,
          border: "2px solid #e9d8a6",
          flexShrink: 0,
        }}
      >
        {entity.icono || "🚚"}
      </div>

      <div className="flex-grow-1 min-w-0">
        <div className="fw-semibold mb-1" style={{ fontSize: 15 }}>
          {entity.nombre}
        </div>

        <div className="d-flex flex-wrap gap-2 mb-1">
          <span
            className="badge rounded-pill"
            style={{
              background:
                entity.estado === "Activa" ? "#e8f5e9" : "#e9d8a6",
              color:
                entity.estado === "Activa" ? "#2e7d32" : "#c62828",
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            {entity.estado === "Activa" ? "● Activa" : "○ Inactiva"}
          </span>
          <span
            className="badge rounded-pill"
            style={{
              background:
                entity.costo === 0 ? "#e9d8a6" : "#e8f5e9",
              color:
                entity.costo === 0 ? "#ee9b00" : "#2e7d32",
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            {entity.costo === 0 ? "Gratis" : formatPrice(entity.costo)}
          </span>
          {entity.orden && (
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
              Orden: {entity.orden}
            </span>
          )}
        </div>

        {entity.descripcion && (
          <p
            className="text-muted mb-1"
            style={{ fontSize: 13, lineHeight: 1.4 }}
          >
            {entity.descripcion}
          </p>
        )}

        {entity.tiempoEstimado && (
          <p
            className="mb-0"
            style={{ fontSize: 12, color: "#888", lineHeight: 1.4 }}
          >
            <strong>⏱ Tiempo:</strong> {entity.tiempoEstimado}
          </p>
        )}

        {entity.gratisDesde > 0 && (
          <p
            className="mb-0 mt-1"
            style={{ fontSize: 12, color: "#2e7d32", lineHeight: 1.4 }}
          >
            <strong>🎁 Envío gratis desde:</strong> {formatPrice(entity.gratisDesde)}
          </p>
        )}
      </div>
    </div>
  );

  const PromotionDetails = () => (
    <div
      className="d-flex align-items-start gap-3 p-3 rounded-3"
      style={{ background: "#e9d8a6" }}
    >
      <div
        className="d-flex align-items-center justify-content-center"
        style={{
          width: 56,
          height: 56,
          borderRadius: 12,
          background: "#fff",
          fontSize: 26,
          border: "2px solid #e9d8a6",
          flexShrink: 0,
        }}
      >
        🎟
      </div>

      <div className="flex-grow-1 min-w-0">
        <div className="fw-bold mb-1" style={{ fontSize: 15, color: "#ee9b00" }}>
          {entity.codigo}
        </div>

        <div className="d-flex flex-wrap gap-2 mb-1">
          <span
            className="badge rounded-pill"
            style={{
              background:
                entity.estado === "Activa" ? "#e8f5e9" : "#e9d8a6",
              color:
                entity.estado === "Activa" ? "#2e7d32" : "#c62828",
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            {entity.estado === "Activa" ? "● Activa" : "○ Inactiva"}
          </span>
          <span
            className="badge rounded-pill"
            style={{
              background: entity.tipo === "porcentaje" ? "#ede9fe" : "#e0f2fe",
              color: entity.tipo === "porcentaje" ? "#6d28d9" : "#0369a1",
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            {entity.tipo === "porcentaje" ? `${entity.valor}%` : formatPrice(entity.valor)}
          </span>
        </div>

        {entity.descripcion && (
          <p
            className="text-muted mb-1"
            style={{ fontSize: 13, lineHeight: 1.4 }}
          >
            {entity.descripcion}
          </p>
        )}

        {(entity.fechaInicio || entity.fechaFin) && (
          <p
            className="mb-0"
            style={{ fontSize: 12, color: "#888", lineHeight: 1.4 }}
          >
            <strong>📅 Vigencia:</strong> {entity.fechaInicio || "—"}
            {entity.fechaFin ? ` → ${entity.fechaFin}` : ""}
          </p>
        )}
      </div>
    </div>
  );

  const MessageDetails = () => (
    <div
      className="d-flex align-items-start gap-3 p-3 rounded-3"
      style={{ background: "#e9d8a6" }}
    >
      <div
        className="d-flex align-items-center justify-content-center"
        style={{
          width: 56,
          height: 56,
          borderRadius: 12,
          background: "#fff",
          fontSize: 26,
          border: "2px solid #e9d8a6",
          flexShrink: 0,
        }}
      >
        💬
      </div>

      <div className="flex-grow-1 min-w-0">
        <div className="fw-semibold mb-1" style={{ fontSize: 15 }}>
          {entity.nombre}
        </div>

        <div className="d-flex flex-wrap gap-2 mb-1">
          <span
            className="badge rounded-pill"
            style={{
              background:
                entity.estado === "Nuevo" ? "#e9d8a6" : "#e8f5e9",
              color:
                entity.estado === "Nuevo" ? "#ee9b00" : "#2e7d32",
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            {entity.estado === "Nuevo" ? "● Nuevo" : `○ ${entity.estado}`}
          </span>
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
            {entity.fecha}
          </span>
        </div>

        {entity.asunto && (
          <p
            className="mb-1"
            style={{ fontSize: 13, color: "#555", lineHeight: 1.4 }}
          >
            <strong>{entity.asunto}</strong>
          </p>
        )}

        {entity.email && (
          <p
            className="mb-1"
            style={{ fontSize: 12, color: "#888", lineHeight: 1.4 }}
          >
            📧 {entity.email}
          </p>
        )}

        {entity.mensaje && (
          <p
            className="mb-0"
            style={{
              fontSize: 13,
              color: "#555",
              lineHeight: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {entity.mensaje}
          </p>
        )}
      </div>
    </div>
  );

  const title = isPromotion
    ? "🗑️ Eliminar promoción"
    : isPaymentMethod
      ? "🗑️ Eliminar método de pago"
      : isShippingMethod
        ? "🗑️ Eliminar método de envío"
        : isCustomer
          ? "🗑️ Eliminar cliente"
          : isCategory
            ? "🗑️ Eliminar categoría"
            : isMessage
              ? "🗑️ Eliminar mensaje"
              : "🗑️ Eliminar producto";
  const confirmLabel = "🗑️ Eliminar definitivamente";
  const description = isPromotion
    ? "¿Estás seguro de eliminar esta promoción? Esta acción no se puede deshacer."
    : isPaymentMethod
      ? "¿Estás seguro de eliminar este método de pago? Esta acción no se puede deshacer."
      : isShippingMethod
        ? "¿Estás seguro de eliminar este método de envío? Esta acción no se puede deshacer."
        : isCustomer
          ? "¿Estás seguro de eliminar este cliente? Esta acción no se puede deshacer."
          : isCategory
            ? "¿Estás seguro de eliminar esta categoría? Esta acción no se puede deshacer."
            : isMessage
              ? "¿Estás seguro de eliminar este mensaje? Esta acción no se puede deshacer."
              : "¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.";

  return (
    <div
      className="modal d-block"
      tabIndex={-1}
      role="dialog"
      style={{ background: "rgba(0,0,0,0.5)", overflowY: "auto" }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !deleting) onClose();
      }}
    >
      <div
        className="modal-dialog modal-dialog-centered"
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
              <h5 className="fw-bold mb-1" style={{ color: "#c62828" }}>
                {title}
              </h5>
              <p className="text-muted mb-0" style={{ fontSize: 14 }}>
                {description}
              </p>
            </div>
            <button
              type="button"
              className="btn-close"
              aria-label="Cerrar"
              onClick={onClose}
              disabled={deleting}
            />
          </div>

          {/* ── Body ────────────────────────────── */}
          <div className="modal-body px-4 py-3">
            {isPromotion ? (
              <PromotionDetails />
            ) : isPaymentMethod ? (
              <PaymentMethodDetails />
            ) : isShippingMethod ? (
              <ShippingMethodDetails />
            ) : isCategory ? (
              <CategoryDetails />
            ) : isCustomer ? (
              <CustomerDetails />
            ) : isMessage ? (
              <MessageDetails />
            ) : (
              <ProductDetails />
            )}
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
              disabled={deleting}
              style={{
                background: "transparent",
                border: "1px solid #e0e0e0",
                color: "#333",
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn px-4 py-2 d-inline-flex align-items-center gap-2"
              onClick={onConfirm}
              disabled={deleting}
              style={{
                background: deleting ? "#ffcdd2" : "#e53935",
                color: deleting ? "#999" : "#fff",
                border: "none",
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 14,
                opacity: deleting ? 0.7 : 1,
                cursor: deleting ? "wait" : "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (!deleting) {
                  e.currentTarget.style.background = "#c62828";
                  e.currentTarget.style.transform = "scale(1.02)";
                }
              }}
              onMouseLeave={(e) => {
                if (!deleting) {
                  e.currentTarget.style.background = "#e53935";
                  e.currentTarget.style.transform = "scale(1)";
                }
              }}
            >
              {deleting ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                  />
                  Eliminando…
                </>
              ) : (
                confirmLabel
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
