import { useState, useEffect } from "react";

const INITIAL_FORM = {
  image: "",
  name: "",
  description: "",
  estado: "Activa",
  orden: "",
};

export default function CategoryFormModal({
  show,
  onClose,
  onSave,
  saving,
  initialData,
  isEditing,
}) {
  const [form, setForm] = useState({ ...INITIAL_FORM });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (show) {
      if (isEditing && initialData) {
        setForm({
          image: initialData.image || "",
          name: initialData.name || "",
          description: initialData.description || "",
          estado: initialData.estado || "Activa",
          orden: initialData.orden ?? "",
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
    if (!form.name.trim()) newErrors.name = "El nombre de la categoría es obligatorio.";
    if (!form.image.trim()) newErrors.image = "La URL de la imagen es obligatoria.";
    if (form.orden !== "" && (isNaN(Number(form.orden)) || Number(form.orden) < 1)) {
      newErrors.orden = "El orden debe ser un número mayor o igual a 1.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      image: form.image.trim(),
      name: form.name.trim(),
      description: form.description.trim(),
      estado: form.estado,
      orden: form.orden !== "" ? Number(form.orden) : undefined,
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
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable" role="document">
        <div className="modal-content border-0" style={{ borderRadius: 18, overflow: "hidden" }}>
          {/* ── Header ──────────────────────────── */}
          <div className="modal-header border-0 px-4 pt-4 pb-0" style={{ background: "#fff" }}>
            <div>
              <h5 className="fw-bold mb-1" style={{ color: "#001219" }}>
                {isEditing ? "✏️ Editar Categoría" : "+ Nueva Categoría"}
              </h5>
              <p className="text-muted mb-0" style={{ fontSize: 14 }}>
                {isEditing ? "Modificá los datos de la categoría." : "Completá los campos para agregar una categoría."}
              </p>
            </div>
            <button type="button" className="btn-close" aria-label="Cerrar" onClick={handleClose} />
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
                    <div style={{ width: 72, height: 72, borderRadius: 12, overflow: "hidden", flexShrink: 0, background: "#f5f5f5", border: "2px solid #e9d8a6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {form.image ? (
                        <img src={form.image} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.currentTarget.style.display = "none"; }} />
                      ) : (
                        <span style={{ fontSize: 24, color: "#ccc" }}>🖼️</span>
                      )}
                    </div>
                    <div className="flex-grow-1">
                      <input type="text" className={`form-control ${errors.image ? "is-invalid" : ""}`} name="image" placeholder="https://images.unsplash.com/photo-..." value={form.image} onChange={handleChange} style={{ borderRadius: 10, padding: "10px 14px", fontSize: 14, border: "1px solid #e0e0e0" }} />
                      {errors.image && <div className="invalid-feedback">{errors.image}</div>}
                      <div className="text-muted mt-1" style={{ fontSize: 12 }}>URL de la imagen representativa de la categoría.</div>
                    </div>
                  </div>
                </div>

                {/* Nombre */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold" style={{ fontSize: 14 }}>
                    Nombre <span className="text-danger">*</span>
                  </label>
                  <input type="text" className={`form-control ${errors.name ? "is-invalid" : ""}`} name="name" placeholder="Ej: Perfumes" value={form.name} onChange={handleChange} style={{ borderRadius: 10, padding: "10px 14px", fontSize: 14, border: "1px solid #e0e0e0" }} />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>

                {/* Orden */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold" style={{ fontSize: 14 }}>
                    Orden
                  </label>
                  <input type="number" className={`form-control ${errors.orden ? "is-invalid" : ""}`} name="orden" placeholder="Ej: 1" min={1} value={form.orden} onChange={handleChange} style={{ borderRadius: 10, padding: "10px 14px", fontSize: 14, border: "1px solid #e0e0e0" }} />
                  {errors.orden && <div className="invalid-feedback">{errors.orden}</div>}
                  <div className="text-muted mt-1" style={{ fontSize: 12 }}>Número de orden para la visualización (opcional).</div>
                </div>

                {/* Estado */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold" style={{ fontSize: 14 }}>Estado</label>
                  <select className="form-select" name="estado" value={form.estado} onChange={handleChange} style={{ borderRadius: 10, padding: "10px 14px", fontSize: 14, border: "1px solid #e0e0e0", background: "#fff" }}>
                    <option value="Activa">Activa</option>
                    <option value="Inactiva">Inactiva</option>
                  </select>
                </div>

                {/* Descripción */}
                <div className="col-12">
                  <label className="form-label fw-semibold" style={{ fontSize: 14 }}>Descripción</label>
                  <textarea className="form-control" name="description" placeholder="Descripción de la categoría (opcional)..." rows={3} value={form.description} onChange={handleChange} style={{ borderRadius: 10, padding: "10px 14px", fontSize: 14, border: "1px solid #e0e0e0", resize: "vertical" }} />
                </div>
              </div>
            </div>

            {/* ── Footer ──────────────────────────── */}
            <div className="modal-footer border-0 px-4 pb-4 pt-2 gap-2" style={{ background: "#fff" }}>
              <button type="button" className="btn px-4 py-2" onClick={handleClose} disabled={saving} style={{ background: "transparent", border: "1px solid #e0e0e0", color: "#333", borderRadius: 10, fontWeight: 600, fontSize: 14 }}>
                Cancelar
              </button>
              <button type="submit" className="btn px-4 py-2 d-inline-flex align-items-center gap-2" disabled={saving} style={{
                background: saving ? "#e9d8a6" : "#ee9b00", color: saving ? "#999" : "#fff", border: "none", borderRadius: 10, fontWeight: 600, fontSize: 14, opacity: saving ? 0.7 : 1, cursor: saving ? "wait" : "pointer", transition: "all 0.2s ease",
              }}>
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" />
                    {isEditing ? "Actualizando…" : "Guardando…"}
                  </>
                ) : isEditing ? "💾 Actualizar Categoría" : "💾 Guardar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

