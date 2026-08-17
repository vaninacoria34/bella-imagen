import { useState } from "react";
import useMessages from "../hooks/useMessages";
import MessageTable from "../components/MessageTable";
import MessageDetailModal from "../components/MessageDetailModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

/**
 * MessagesCrud
 * ─────────────────────────────────────────────────
 * Página principal del módulo de mensajes.
 *
 *  Soporta:
 *    • 👁️ Ver detalle   → modal con info completa + cambio de estado
 *    • 🗑️ Eliminar      → modal confirmación → removeMessage()
 */
export default function MessagesCrud() {
  const {
    messages,
    loading,
    error,
    refresh,
    updateStatus,
    removeMessage,
  } = useMessages();

  // ── Detalle ──────────────────────────────────────
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailMessage, setDetailMessage] = useState(null);

  // ── Eliminar ─────────────────────────────────────
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingMessage, setDeletingMessage] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleViewDetail = (message) => {
    setDetailMessage(message);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setDetailMessage(null);
  };

  const handleStatusChange = async (id, newStatus) => {
    await updateStatus(id, newStatus);
  };

  // ── Handlers Eliminar ────────────────────────────
  const handleDeleteClick = (message) => {
    setDeletingMessage(message);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    if (deleting) return;
    setShowDeleteModal(false);
    setDeletingMessage(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingMessage) return;
    try {
      setDeleting(true);
      await removeMessage(deletingMessage.id);
      setShowDeleteModal(false);
      setDeletingMessage(null);
    } catch (err) {
      alert(
        err?.message ||
          "Ocurrió un error al eliminar el mensaje. Intentalo de nuevo."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      {/* ── Header ─────────────────────────────── */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h3 className="fw-bold mb-1" style={{ color: "#001219" }}>
            Mensajes
          </h3>
          <p className="text-muted mb-0" style={{ fontSize: 14 }}>
            Gestioná las consultas y mensajes recibidos de la tienda.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-sm d-inline-flex align-items-center gap-2"
          onClick={() => refresh(false)}
          disabled={loading}
          style={{
            background: "#e9d8a6",
            color: "#ee9b00",
            border: "none",
            borderRadius: 8,
            padding: "8px 16px",
            fontWeight: 600,
          }}
        >
          🔄 Actualizar
        </button>
      </div>

      {/* ── Tabla de mensajes ──────────────────── */}
      <MessageTable
        messages={messages}
        loading={loading}
        error={error}
        onViewDetail={handleViewDetail}
        onDelete={handleDeleteClick}
      />

      {/* ── Modal Detalle del Mensaje ──────────── */}
      <MessageDetailModal
        show={showDetailModal}
        message={detailMessage}
        onClose={handleCloseDetailModal}
        onStatusChange={handleStatusChange}
      />

      {/* ── Modal Confirmación Eliminar ─────────── */}
      <DeleteConfirmModal
        show={showDeleteModal}
        item={deletingMessage}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        deleting={deleting}
        itemType="message"
      />
    </div>
  );
}
