import { useState } from "react";
import usePromotions from "../hooks/usePromotions";
import PromotionTable from "../components/PromotionTable";
import PromotionFormModal from "../components/PromotionFormModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

/**
 * PromotionsCrud
 * ─────────────────────────────────────────────────
 * Página principal del CRUD de promociones.
 *
 *  Soporta:
 *    • + Nueva Promoción → modal vacío → addPromotion()
 *    • ✏️ Editar          → modal precargado → editPromotion()
 *    • 🗑️ Eliminar        → modal confirmación → removePromotion()
 *    • 🔴/🟢 Activar/Desactivar → toggleStatus
 */
export default function PromotionsCrud() {
  const {
    promotions,
    loading,
    error,
    addPromotion,
    editPromotion,
    removePromotion,
    toggleStatus,
  } = usePromotions();
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);

  // ── Eliminar ──────────────────────────────────────
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingPromotion, setDeletingPromotion] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const isEditing = editingPromotion !== null;

  const handleNuevaPromocion = () => {
    setEditingPromotion(null);
    setShowModal(true);
  };

  const handleEditPromocion = (promotion) => {
    setEditingPromotion(promotion);
    setShowModal(true);
  };

  /**
   * Toggle estado: activa ↔ inactiva
   */
  const handleToggleEstado = async (promotion) => {
    try {
      await toggleStatus(promotion.id);
    } catch (err) {
      alert(
        err?.message ||
          "Ocurrió un error al cambiar el estado. Intentalo de nuevo."
      );
    }
  };

  const handleSave = async (formData) => {
    try {
      setSaving(true);
      if (isEditing) {
        await editPromotion(editingPromotion.id, formData);
      } else {
        await addPromotion(formData);
      }
      setShowModal(false);
      setEditingPromotion(null);
    } catch (err) {
      alert(
        err?.message ||
          "Ocurrió un error al guardar la promoción. Intentalo de nuevo."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPromotion(null);
  };

  // ── Handlers Eliminar ────────────────────────────
  const handleDeleteClick = (promotion) => {
    setDeletingPromotion(promotion);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    if (deleting) return; // No cerrar mientras se elimina
    setShowDeleteModal(false);
    setDeletingPromotion(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingPromotion) return;
    try {
      setDeleting(true);
      await removePromotion(deletingPromotion.id);
      setShowDeleteModal(false);
      setDeletingPromotion(null);
    } catch (err) {
      alert(
        err?.message ||
          "Ocurrió un error al eliminar la promoción. Intentalo de nuevo."
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
            Promociones
          </h3>
          <p className="text-muted mb-0" style={{ fontSize: 14 }}>
            Gestioná las promociones y códigos de descuento de Bella Imagen.
          </p>
        </div>

        <button
          type="button"
          className="btn d-inline-flex align-items-center gap-2 px-4 py-2"
          onClick={handleNuevaPromocion}
          title="Agregar una nueva promoción"
          style={{
            background: "#ee9b00",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            fontWeight: 600,
            fontSize: 14,
            transition: "all 0.2s ease",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#ca6702";
            e.currentTarget.style.transform = "scale(1.02)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#ee9b00";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <span style={{ fontSize: 18, lineHeight: 1 }}>+</span>
          Nueva Promoción
        </button>
      </div>

      {/* ── Tabla de promociones ────────────────── */}
      <PromotionTable
        promotions={promotions}
        loading={loading}
        error={error}
        onEdit={handleEditPromocion}
        onDelete={handleDeleteClick}
        onToggleEstado={handleToggleEstado}
      />

      {/* ── Modal Crear / Editar Promoción ───────── */}
      <PromotionFormModal
        show={showModal}
        onClose={handleCloseModal}
        onSave={handleSave}
        saving={saving}
        initialData={editingPromotion}
        isEditing={isEditing}
      />

      {/* ── Modal Confirmación Eliminar ─────────── */}
      <DeleteConfirmModal
        show={showDeleteModal}
        item={deletingPromotion}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        deleting={deleting}
        itemType="promotion"
      />
    </div>
  );
}
