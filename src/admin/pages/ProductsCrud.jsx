import { useState } from "react";
import useProducts from "../hooks/useProducts";
import ProductTable from "../components/ProductTable";
import ProductFormModal from "../components/ProductFormModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

/**
 * ProductsCrud
 * ─────────────────────────────────────────────────
 * Página principal del CRUD de productos.
 *
 *  Muestra el listado completo de productos desde el
 *  catálogo compartido (src/data/products.js).
 *
 *  Soporta:
 *    • + Nuevo Producto → modal vacío → addProduct()
 *    • ✏️ Editar         → modal precargado → editProduct()
 *    • 🗑️ Eliminar       → modal confirmación → removeProduct()
 */
export default function ProductsCrud() {
  const {
    products,
    loading,
    error,
    addProduct,
    editProduct,
    removeProduct,
  } = useProducts();
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // ── Eliminar ──────────────────────────────────────
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const isEditing = editingProduct !== null;

  const handleNuevoProducto = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleEditProducto = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleSave = async (formData) => {
    setSaving(true);
    try {
      if (isEditing) {
        await editProduct(editingProduct.id, formData);
      } else {
        await addProduct(formData);
      }
      // Solo cierra el modal si el guardado fue exitoso
      setShowModal(false);
      setEditingProduct(null);
    } catch (err) {
      console.error("Error al guardar producto:", err);
      alert(
        err?.message ||
          "Ocurrió un error al guardar el producto. Intentalo de nuevo."
      );
      // No cierra el modal para que el usuario pueda corregir
    } finally {
      // IMPORTANTE: Garantiza que saving siempre vuelva a false
      setSaving(false);
    }
  };

  const handleCloseModal = () => {
    // Si está guardando, no permitir cerrar
    if (saving) return;
    
    setShowModal(false);
    setEditingProduct(null);
    // Garantizar que el estado se limpia
    setSaving(false);
  };

  // ── Handlers Eliminar ────────────────────────────
  const handleDeleteClick = (product) => {
    setDeletingProduct(product);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    if (deleting) return; // No cerrar mientras se elimina
    setShowDeleteModal(false);
    setDeletingProduct(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    try {
      setDeleting(true);
      await removeProduct(deletingProduct.id);
      setShowDeleteModal(false);
      setDeletingProduct(null);
    } catch (err) {
      alert(
        err?.message ||
          "Ocurrió un error al eliminar el producto. Intentalo de nuevo."
      );
      // No cerramos el modal ni perdemos el producto
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
            Productos
          </h3>
          <p className="text-muted mb-0" style={{ fontSize: 14 }}>
            Gestioná el catálogo de productos de Bella Imagen.
          </p>
        </div>

        <button
          type="button"
          className="btn d-inline-flex align-items-center gap-2 px-4 py-2"
          onClick={handleNuevoProducto}
          title="Agregar un nuevo producto al catálogo"
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
          Nuevo Producto
        </button>
      </div>

      {/* ── Tabla de productos ──────────────────── */}
      <ProductTable
        products={products}
        loading={loading}
        error={error}
        onEdit={handleEditProducto}
        onDelete={handleDeleteClick}
      />

      {/* ── Modal Crear / Editar Producto ───────── */}
      <ProductFormModal
        show={showModal}
        onClose={handleCloseModal}
        onSave={handleSave}
        saving={saving}
        initialData={editingProduct}
        isEditing={isEditing}
      />

      {/* ── Modal Confirmación Eliminar ─────────── */}
      <DeleteConfirmModal
        show={showDeleteModal}
        product={deletingProduct}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        deleting={deleting}
      />
    </div>
  );
}

