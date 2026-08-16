import { useState } from "react";
import useCustomers from "../hooks/useCustomers";
import CustomerTable from "../components/CustomerTable";
import CustomerFormModal from "../components/CustomerFormModal";
import CustomerDetailModal from "../components/CustomerDetailModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

/**
 * CustomersCrud
 * ─────────────────────────────────────────────────
 * Página principal del CRUD de clientes.
 *
 *  Soporta:
 *    • + Nuevo Cliente → modal vacío → addCustomer()
 *    • ✏️ Editar        → modal precargado → editCustomer()
 *    • 🗑️ Eliminar      → modal confirmación → removeCustomer()
 *    • 👤 Detalle       → modal detalle del cliente
 */
export default function CustomersCrud() {
  const {
    customers,
    loading,
    error,
    addCustomer,
    editCustomer,
    removeCustomer,
    toggleStatus,
  } = useCustomers();

  // ── Crear / Editar ─────────────────────────────
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const isEditing = editingCustomer !== null;

  // ── Detalle ────────────────────────────────────
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailCustomer, setDetailCustomer] = useState(null);

  // ── Eliminar ───────────────────────────────────
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingCustomer, setDeletingCustomer] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleNuevo = () => {
    setEditingCustomer(null);
    setShowModal(true);
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setShowModal(true);
  };

  const handleDetail = (customer) => {
    setDetailCustomer(customer);
    setShowDetailModal(true);
  };

  const handleSave = async (formData) => {
    try {
      setSaving(true);
      if (isEditing) {
        await editCustomer(editingCustomer.id, formData);
      } else {
        await addCustomer(formData);
      }
      setShowModal(false);
      setEditingCustomer(null);
    } catch (err) {
      alert(
        err?.message ||
          "Ocurrió un error al guardar el cliente. Intentalo de nuevo."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCustomer(null);
  };

  // ── Toggle Estado ──────────────────────────────
  const handleToggleEstado = async (customer) => {
    try {
      await toggleStatus(customer.id);
    } catch (err) {
      alert(
        err?.message ||
          "Ocurrió un error al cambiar el estado del cliente. Intentalo de nuevo."
      );
    }
  };

  // ── Handlers Eliminar ────────────────────────────
  const handleDeleteClick = (customer) => {
    setDeletingCustomer(customer);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    if (deleting) return;
    setShowDeleteModal(false);
    setDeletingCustomer(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingCustomer) return;
    try {
      setDeleting(true);
      await removeCustomer(deletingCustomer.id);
      setShowDeleteModal(false);
      setDeletingCustomer(null);
    } catch (err) {
      alert(
        err?.message ||
          "Ocurrió un error al eliminar el cliente. Intentalo de nuevo."
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
            Clientes
          </h3>
          <p className="text-muted mb-0" style={{ fontSize: 14 }}>
            Gestioná los clientes registrados de Bella Imagen.
          </p>
        </div>

        <button
          type="button"
          className="btn d-inline-flex align-items-center gap-2 px-4 py-2"
          onClick={handleNuevo}
          title="Agregar un nuevo cliente"
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
          Nuevo Cliente
        </button>
      </div>

      {/* ── Tabla de clientes ──────────────────── */}
      <CustomerTable
        customers={customers}
        loading={loading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onDetail={handleDetail}
        onToggleEstado={handleToggleEstado}
      />

      {/* ── Modal Crear / Editar Cliente ───────── */}
      <CustomerFormModal
        show={showModal}
        onClose={handleCloseModal}
        onSave={handleSave}
        saving={saving}
        initialData={editingCustomer}
        isEditing={isEditing}
      />

      {/* ── Modal Detalle Cliente ──────────────── */}
      <CustomerDetailModal
        show={showDetailModal}
        customer={detailCustomer}
        onClose={() => {
          setShowDetailModal(false);
          setDetailCustomer(null);
        }}
      />

      {/* ── Modal Confirmación Eliminar ─────────── */}
      <DeleteConfirmModal
        show={showDeleteModal}
        product={deletingCustomer}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        deleting={deleting}
      />
    </div>
  );
}

