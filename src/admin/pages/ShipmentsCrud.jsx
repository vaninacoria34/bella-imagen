import { useState } from "react";
import useShippingMethods from "../hooks/useShippingMethods";
import ShippingMethodTable from "../components/ShippingMethodTable";
import ShippingMethodFormModal from "../components/ShippingMethodFormModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

/**
 * ShipmentsCrud
 * ─────────────────────────────────────────────────
 * Página principal del CRUD de métodos de envío.
 *
 *  Soporta:
 *    • + Nuevo Método → modal vacío → addMethod()
 *    • ✏️ Editar        → modal precargado → editMethod()
 *    • 🗑️ Eliminar      → modal confirmación → removeMethod()
 *    • 🔴/🟢 Activar/Desactivar → toggleStatus()
 */
export default function ShipmentsCrud() {
  const {
    shippingMethods,
    loading,
    error,
    addMethod,
    editMethod,
    removeMethod,
    toggleStatus,
  } = useShippingMethods();

  // ── Crear / Editar ─────────────────────────────
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingMethod, setEditingMethod] = useState(null);
  const isEditing = editingMethod !== null;

  // ── Eliminar ───────────────────────────────────
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingMethod, setDeletingMethod] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleNuevo = () => {
    setEditingMethod(null);
    setShowModal(true);
  };

  const handleEdit = (method) => {
    setEditingMethod(method);
    setShowModal(true);
  };

  const handleSave = async (formData) => {
    try {
      setSaving(true);
      if (isEditing) {
        await editMethod(editingMethod.id, formData);
      } else {
        await addMethod(formData);
      }
      setShowModal(false);
      setEditingMethod(null);
    } catch (err) {
      alert(
        err?.message ||
          "Ocurrió un error al guardar el método de envío. Intentalo de nuevo."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingMethod(null);
  };

  // ── Toggle Estado ──────────────────────────────
  const handleToggleEstado = async (method) => {
    try {
      await toggleStatus(method.id);
    } catch (err) {
      alert(
        err?.message ||
          "Ocurrió un error al cambiar el estado. Intentalo de nuevo."
      );
    }
  };

  // ── Handlers Eliminar ────────────────────────────
  const handleDeleteClick = (method) => {
    setDeletingMethod(method);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    if (deleting) return;
    setShowDeleteModal(false);
    setDeletingMethod(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingMethod) return;
    try {
      setDeleting(true);
      await removeMethod(deletingMethod.id);
      setShowDeleteModal(false);
      setDeletingMethod(null);
    } catch (err) {
      alert(
        err?.message ||
          "Ocurrió un error al eliminar el método de envío. Intentalo de nuevo."
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
            Envíos
          </h3>
          <p className="text-muted mb-0" style={{ fontSize: 14 }}>
            Gestioná los métodos de envío disponibles en el checkout.
          </p>
        </div>

        <button
          type="button"
          className="btn d-inline-flex align-items-center gap-2 px-4 py-2"
          onClick={handleNuevo}
          title="Agregar un nuevo método de envío"
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
          Nuevo Método
        </button>
      </div>

      {/* ── Tabla de métodos de envío ────────────── */}
      <ShippingMethodTable
        shippingMethods={shippingMethods}
        loading={loading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onToggleEstado={handleToggleEstado}
      />

      {/* ── Modal Crear / Editar ─────────────────── */}
      <ShippingMethodFormModal
        show={showModal}
        onClose={handleCloseModal}
        onSave={handleSave}
        saving={saving}
        initialData={editingMethod}
        isEditing={isEditing}
      />

      {/* ── Modal Confirmación Eliminar ─────────── */}
      <DeleteConfirmModal
        show={showDeleteModal}
        item={deletingMethod}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        deleting={deleting}
        itemType="shippingMethod"
      />
    </div>
  );
}
