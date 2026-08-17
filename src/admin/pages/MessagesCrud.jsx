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

  // ── Mensaje de actualización ─────────────────────
  const [refreshing, setRefreshing] = useState(false);
  const [refreshNotice, setRefreshNotice] = useState("");

  const handleManualRefresh = async () => {
    try {
      setRefreshing(true);
      setRefreshNotice("");
      await refresh(false);
      setRefreshNotice("✅ Mensajes actualizados correctamente");
      setTimeout(() => {
        setRefreshNotice("");
      }, 3500);
    } catch {
      setRefreshNotice("⚠️ Error al actualizar mensajes");
      setTimeout(() => {
        setRefreshNotice("");
      }, 3500);
    } finally {
      setRefreshing(false);
    }
  };
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
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
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
          onClick={handleManualRefresh}
          disabled={loading || refreshing}
          style={{
            background: "#e9d8a6",
            color: "#ee9b00",
            border: "none",
            borderRadius: 8,
            padding: "8px 16px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {refreshing ? (
            <>
              <span
                className="spinner-border spinner-border-sm"
                role="status"
              />
              Actualizando…
            </>
          ) : (
            <>🔄 Actualizar</>
          )}
        </button>
      </div>

      {/* ── Alerta / Notificación de actualización ─ */}
      {refreshNotice && (
        <div
          className="alert alert-success d-flex align-items-center py-2 px-3 mb-3"
          role="alert"
          style={{
            borderRadius: 12,
            fontSize: 14,
            animation: "fadeIn 0.3s ease-in-out",
          }}
        >
          {refreshNotice}
        </div>
      )}

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
