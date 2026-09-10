import { useState, useEffect } from "react";
import { getActiveCategoryNames } from "../services/categoryService";

const INITIAL_FORM = {
  image: "",
  title: "",
  description: "",
  category: "",
  price: "",
  stock: "",
  estado: "Activo",
};

/**
 * ProductFormModal
 * ─────────────────────────────────────────────────
 * Modal Bootstrap para crear o editar un producto.
 *
 * Props:
 *   show         → booleano (controla visibilidad)
 *   onClose      → fn() — cierra el modal
 *   onSave       → fn(formData) — ejecuta guardado
 *   saving       → booleano (true mientras se guarda)
 *   initialData  → objeto producto (para editar) | null (para crear)
 *   isEditing    → booleano — true = editar, false = crear
 */
export default function ProductFormModal({
  show,
  onClose,
  onSave,
  saving,
  initialData,
  isEditing,
}) {
  const [form, setForm] = useState({ ...INITIAL_FORM });
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Cargar categorías activas desde el servicio
  useEffect(() => {
    if (show) {
      setLoadingCategories(true);
      getActiveCategoryNames()
        .then(setCategories)
        .catch(() => setCategories([]))
        .finally(() => setLoadingCategories(false));
    }
  }, [show]);

  // Precargar formulario cuando se abre con datos de edición
  useEffect(() => {
    if (show) {
      if (isEditing && initialData) {
        setForm({
          image: initialData.image || "",
          title: initialData.title || "",
          description: initialData.description || "",
          category: initialData.category || "",
          price: initialData.price ?? "",
          stock: initialData.stock ?? "",
          estado: initialData.estado || "Activo",
        });
      } else {
        setForm({ ...INITIAL_FORM });
      }
      setErrors({});
    }
  }, [show, isEditing, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Limpiar error del campo al escribir
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!form.title.trim()) {
      newErrors.title = "El nombre del producto es obligatorio.";
    }
    if (!form.category) {
      newErrors.category = "Seleccioná una categoría.";
    }
    if (!form.price || Number(form.price) < 1) {
      newErrors.price = "Ingresá un precio válido (mín. $1).";
    }
    if (form.stock === "" || Number(form.stock) < 0) {
      newErrors.stock = "Ingresá un stock válido (mín. 0).";
    }
    if (!form.image.trim()) {
      newErrors.image = "La URL de la imagen es obligatoria.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    await onSave({
      image: form.image.trim(),
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      price: Number(form.price),
      stock: Number(form.stock),
      estado: form.estado,
    });
  };

  const handleClose = () => {
    setForm({ ...INITIAL_FORM });
    setErrors({});
    onClose();
  };

  if (!show) return null;

  return (
    <div
      className="modal d-block"
      tabIndex={-1}
      role="dialog"
      style={{ background: "rgba(0,0,0,0.5)", overflowY: "auto" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
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
                {isEditing ? "✏️ Editar Producto" : "+ Nuevo Producto"}
              </h5>
              <p className="text-muted mb-0" style={{ fontSize: 14 }}>
                {isEditing
                  ? "Modificá los campos del producto y guardá los cambios."
                  : "Completá los campos para agregar un producto al catálogo."}
              </p>
            </div>
            <button
              type="button"
              className="btn-close"
              aria-label="Cerrar"
              onClick={handleClose}
            />
          </div>

          {/* ── Body ────────────────────────────── */}
          <form onSubmit={handleSubmit}>
            <div className="modal-body px-4 py-3">
              <div className="row g-3">
                {/* Imagen (URL) */}
                <div className="col-12">
                  <label className="form-label fw-semibold" style={{ fontSize: 14 }}>
                    Imagen <span className="text-danger">*</span>
                  </label>
                  <div className="d-flex align-items-start gap-3">
                    <div
                      style={{
                        width: 72,
                        height: 72,
                        borderRadius: 12,
                        overflow: "hidden",
                        flexShrink: 0,
                        background: "#f5f5f5",
                        border: "2px solid #e9d8a6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {form.image ? (
                        <img
                          src={form.image}
                          alt="Preview"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: 24, color: "#ccc" }}>🖼️</span>
                      )}
                    </div>
                    <div className="flex-grow-1">
                      <input
                        type="text"
                        className={`form-control ${errors.image ? "is-invalid" : ""}`}
                        name="image"
                        value={form.image}
                        onChange={handleChange}
                        placeholder="https://images.unsplash.com/photo-..."
                        style={{
                          borderRadius: 10,
                          padding: "10px 14px",
                          fontSize: 14,
                          border: "1px solid #e0e0e0",
                        }}
                      />
                      {errors.image && (
                        <div className="invalid-feedback">{errors.image}</div>
                      )}
                      <div className="text-muted mt-1" style={{ fontSize: 12 }}>
                        URL de la imagen del producto (Unsplash, etc.)
                      </div>
                    </div>
                  </div>
                </div>

                {/* Nombre */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold" style={{ fontSize: 14 }}>
                    Nombre <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.title ? "is-invalid" : ""}`}
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Ej: Perfume Rosé"
                    style={{
                      borderRadius: 10,
                      padding: "10px 14px",
                      fontSize: 14,
                      border: "1px solid #e0e0e0",
                    }}
                  />
                  {errors.title && (
                    <div className="invalid-feedback">{errors.title}</div>
                  )}
                </div>

                {/* Categoría */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold" style={{ fontSize: 14 }}>
                    Categoría <span className="text-danger">*</span>
                  </label>
                  <select
                    className={`form-select ${errors.category ? "is-invalid" : ""}`}
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    style={{
                      borderRadius: 10,
                      padding: "10px 14px",
                      fontSize: 14,
                      border: "1px solid #e0e0e0",
                      background: "#fff",
                    }}
                  >
                    <option value="">
                      {loadingCategories
                        ? "Cargando categorías…"
                        : "Seleccionar categoría…"}
                    </option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <div className="invalid-feedback">{errors.category}</div>
                  )}
                </div>

                {/* Precio */}
                <div className="col-12 col-md-4">
                  <label className="form-label fw-semibold" style={{ fontSize: 14 }}>
                    Precio ($) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className={`form-control ${errors.price ? "is-invalid" : ""}`}
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="Ej: 25000"
                    min={1}
                    style={{
                      borderRadius: 10,
                      padding: "10px 14px",
                      fontSize: 14,
                      border: "1px solid #e0e0e0",
                    }}
                  />
                  {errors.price && (
                    <div className="invalid-feedback">{errors.price}</div>
                  )}
                </div>

                {/* Stock */}
                <div className="col-12 col-md-4">
                  <label className="form-label fw-semibold" style={{ fontSize: 14 }}>
                    Stock <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className={`form-control ${errors.stock ? "is-invalid" : ""}`}
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    placeholder="Ej: 50"
                    min={0}
                    style={{
                      borderRadius: 10,
                      padding: "10px 14px",
                      fontSize: 14,
                      border: "1px solid #e0e0e0",
                    }}
                  />
                  {errors.stock && (
                    <div className="invalid-feedback">{errors.stock}</div>
                  )}
                </div>

                {/* Estado */}
                <div className="col-12 col-md-4">
                  <label className="form-label fw-semibold" style={{ fontSize: 14 }}>
                    Estado
                  </label>
                  <select
                    className="form-select"
                    name="estado"
                    value={form.estado}
                    onChange={handleChange}
                    style={{
                      borderRadius: 10,
                      padding: "10px 14px",
                      fontSize: 14,
                      border: "1px solid #e0e0e0",
                      background: "#fff",
                    }}
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>

                {/* Descripción */}
                <div className="col-12">
                  <label className="form-label fw-semibold" style={{ fontSize: 14 }}>
                    Descripción
                  </label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Descripción del producto (opcional)..."
                    rows={3}
                    style={{
                      borderRadius: 10,
                      padding: "10px 14px",
                      fontSize: 14,
                      border: "1px solid #e0e0e0",
                      resize: "vertical",
                    }}
                  />
                </div>
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
                onClick={handleClose}
                disabled={saving}
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
                type="submit"
                className="btn px-4 py-2 d-inline-flex align-items-center gap-2"
                disabled={saving}
                style={{
                  background: saving ? "#e9d8a6" : "#ee9b00",
                  color: saving ? "#999" : "#fff",
                  border: "none",
                  borderRadius: 10,
                  fontWeight: 600,
                  fontSize: 14,
                  opacity: saving ? 0.7 : 1,
                  cursor: saving ? "wait" : "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (!saving) {
                    e.currentTarget.style.background = "#ca6702";
                    e.currentTarget.style.transform = "scale(1.02)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!saving) {
                    e.currentTarget.style.background = "#ee9b00";
                    e.currentTarget.style.transform = "scale(1)";
                  }
                }}
              >
                {saving ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                    />
                    Guardando…
                  </>
                ) : isEditing ? (
                  "💾 Actualizar Producto"
                ) : (
                  "💾 Guardar"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

