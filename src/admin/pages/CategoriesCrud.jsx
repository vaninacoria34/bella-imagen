import { useState } from "react";
import useCategories from "../hooks/useCategories";
import CategoryTable from "../components/CategoryTable";
import CategoryFormModal from "../components/CategoryFormModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import { getCategoryByName } from "../services/categoryService";
import { getAllProducts } from "../services/productService";

/**
 * CategoriesCrud
 * ─────────────────────────────────────────────────
 * Página principal del CRUD de categorías.
 *
 *  Soporta:
 *    • + Nueva Categoría → modal vacío → addCategory()
 *    • ✏️ Editar          → modal precargado → editCategory()
 *    • 🗑️ Eliminar        → modal confirmación → removeCategory()
 *    • 🔴/🟢 Activar/Desactivar → toggleEstado
 *
 *  Validación especial:
 *    • No permite eliminar una categoría que tenga productos asociados.
 */
export default function CategoriesCrud() {
  const {
    categories,
    loading,
    error,
    addCategory,
    editCategory,
    removeCategory,
  } = useCategories();
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // ── Eliminar ──────────────────────────────────────
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const isEditing = editingCategory !== null;

  const handleNuevaCategoria = () => {
    setEditingCategory(null);
    setShowModal(true);
  };

  const handleEditCategoria = (category) => {
    setEditingCategory(category);
    setShowModal(true);
  };

  /**
   * Toggle estado: activa ↔ inactiva
   */
  const handleToggleEstado = async (category) => {
    const newEstado = category.estado === "Activa" ? "Inactiva" : "Activa";
    try {
      await editCategory(category.id, {
        name: category.name,
        description: category.description,
        image: category.image,
        estado: newEstado,
        orden: category.orden,
      });
    } catch (err) {
      alert(
        err?.message ||
          "Ocurrió un error al cambiar el estado. Intentalo de nuevo."
      );
    }
  };

  /**
   * Valida que la categoría no tenga productos asociados
   * antes de permitir la eliminación.
   *
   * 🔁 Firebase: esta validación se hará con una consulta a Firestore.
   * En esta etapa se verifica contra el catálogo de productos local.
   */
  const validateNoProductsInCategory = async (categoryName) => {
    const allProducts = await getAllProducts();
    const hasProducts = allProducts.some(
      (p) => p.category.toLowerCase() === categoryName.toLowerCase()
    );
    return !hasProducts;
  };

  const handleSave = async (formData) => {
    try {
      setSaving(true);
      if (isEditing) {
        await editCategory(editingCategory.id, formData);
      } else {
        await addCategory(formData);
      }
      setShowModal(false);
      setEditingCategory(null);
    } catch (err) {
      alert(
        err?.message ||
          "Ocurrió un error al guardar la categoría. Intentalo de nuevo."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
  };

  // ── Handlers Eliminar ────────────────────────────
  const handleDeleteClick = async (category) => {
    // Validar que no tenga productos asociados
    const canDelete = await validateNoProductsInCategory(category.name);
    if (!canDelete) {
      alert(
        `No se puede eliminar la categoría "${category.name}" porque tiene productos asociados. Desactivá la categoría en lugar de eliminarla.`
      );
      return;
    }
    setDeletingCategory(category);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    if (deleting) return; // No cerrar mientras se elimina
    setShowDeleteModal(false);
    setDeletingCategory(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingCategory) return;
    try {
      setDeleting(true);
      await removeCategory(deletingCategory.id);
      setShowDeleteModal(false);
      setDeletingCategory(null);
    } catch (err) {
      alert(
        err?.message ||
          "Ocurrió un error al eliminar la categoría. Intentalo de nuevo."
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
            Categorías
          </h3>
          <p className="text-muted mb-0" style={{ fontSize: 14 }}>
            Gestioná las categorías de productos de Bella Imagen.
          </p>
        </div>

        <button
          type="button"
          className="btn d-inline-flex align-items-center gap-2 px-4 py-2"
          onClick={handleNuevaCategoria}
          title="Agregar una nueva categoría"
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
          Nueva Categoría
        </button>
      </div>

      {/* ── Tabla de categorías ──────────────────── */}
      <CategoryTable
        categories={categories}
        loading={loading}
        error={error}
        onEdit={handleEditCategoria}
        onDelete={handleDeleteClick}
        onToggleEstado={handleToggleEstado}
      />

      {/* ── Modal Crear / Editar Categoría ───────── */}
      <CategoryFormModal
        show={showModal}
        onClose={handleCloseModal}
        onSave={handleSave}
        saving={saving}
        initialData={editingCategory}
        isEditing={isEditing}
      />

      {/* ── Modal Confirmación Eliminar ─────────── */}
      <DeleteConfirmModal
        show={showDeleteModal}
        item={deletingCategory}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        deleting={deleting}
        itemType="category"
      />
    </div>
  );
}

