import { useState } from "react";
import useOrders from "../hooks/useOrders";
import OrderTable from "../components/OrderTable";
import OrderDetailModal from "../components/OrderDetailModal";

/**
 * OrdersCrud
 * ─────────────────────────────────────────────────
 * Página principal del CRUD de pedidos.
 *
 *  Soporta:
 *    • Listado completo con buscador + filtros por estado
 *    • 👁️ Ver detalle → modal con info completa
 *    • Cambio de estado desde el modal
 */
export default function OrdersCrud() {
  const {
    orders,
    loading,
    error,
    changeStatus,
  } = useOrders();

  // ── Detalle ───────────────────────────────────────
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailOrder, setDetailOrder] = useState(null);

  const handleViewDetail = (order) => {
    setDetailOrder(order);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setDetailOrder(null);
  };

  const handleStatusChange = async (id, newStatus) => {
    await changeStatus(id, newStatus);
  };

  return (
    <div>
      {/* ── Header ─────────────────────────────── */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h3 className="fw-bold mb-1" style={{ color: "#001219" }}>
            Pedidos
          </h3>
          <p className="text-muted mb-0" style={{ fontSize: 14 }}>
            Gestioná los pedidos de Bella Imagen.
          </p>
        </div>
      </div>

      {/* ── Tabla de pedidos ──────────────────────── */}
      <OrderTable
        orders={orders}
        loading={loading}
        error={error}
        onViewDetail={handleViewDetail}
      />

      {/* ── Modal Detalle del Pedido ─────────────── */}
      <OrderDetailModal
        show={showDetailModal}
        order={detailOrder}
        onClose={handleCloseDetailModal}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}

