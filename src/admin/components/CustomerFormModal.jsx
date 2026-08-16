import { useState, useEffect } from "react";

const INITIAL_FORM = {
  nombre: "",
  apellido: "",
  whatsapp: "",
  email: "",
  direccion: "",
  ciudad: "",
  codigoPostal: "",
  estado: "Activo",
  observaciones: "",
};

/**
 * CustomerFormModal
 * ─────────────────────────────────────────────────
 * Modal Bootstrap para crear o editar un cliente.
 *
 * Props:
 *   show         → booleano
 *   onClose      → fn()
 *   onSave       → fn(formData)
 *   saving       → booleano
 *   initialData  → objeto cliente | null
 *   isEditing    → booleano
 */
export default function CustomerFormModal({
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
          nombre: initialData.nombre || "",
          apellido: initialData.apellido || "",
          whatsapp: initialData.whatsapp || "",
          email: initialData.email || "",
          direccion: initialData.direccion || "",
          ciudad: initialData.ciudad || "",
          codigoPostal: initialData.codigoPostal || "",
          estado: initialData.estado || "Activo",
          observaciones: initialData.observaciones || "",
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

    if (!form.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio.";
    }
    if (!form.apellido.trim()) {
      newErrors.apellido = "El apellido es obligatorio.";
    }
    if (!form.email.trim()) {
      newErrors.email = "El email es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      newErrors.email = "Ingresá un email válido.";
    }
    if (!form.whatsapp.trim()) {
      newErrors.whatsapp = "El WhatsApp es obligatorio.";
    }
    if (!form.direccion.trim()) {
      newErrors.direccion = "La dirección es obligatoria.";
    }
    if (!form.ciudad.trim()) {
      newErrors.ciudad = "La ciudad es obligatoria.";
    }
    if (!form.codigoPostal.trim()) {
      newErrors.codigoPostal = "El código postal es obligatorio.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      nombre: form.nombre.trim(),
      apellido: form.apellido.trim(),
      whatsapp: form.whatsapp.trim(),
      email: form.email.trim(),
      direccion: form.direccion.trim(),
      ciudad: form.ciudad.trim(),
      codigoPostal: form.codigoPostal.trim(),
      estado: form.estado,
      observaciones: form.observaciones.trim(),
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
                {isEditing ? "✏️ Editar Cliente" : "+ Nuevo Cliente"}
              </h5>
              <p className="text-muted mb-0" style={{ fontSize: 14 }}>
                {isEditing
                  ? "Modificá los datos del cliente y guardá los cambios."
                  : "Completá los campos para registrar un nuevo cliente."}
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
                {/* Nombre */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold" style={{ fontSize: 14 }}>
                    Nombre <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="Ej: María"
                    style={{
                      borderRadius: 10,
                      padding: "10px 14px",
                      fontSize: 14,
                      border: "1px solid #e0e0e0",
                    }}
                  />
                  {errors.nombre && (
                    <div className="invalid-feedback">{errors.nombre}</div>
                  )}
                </div>

                {/* Apellido */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold" style={{ fontSize: 14 }}>
                    Apellido <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.apellido ? "is-invalid" : ""}`}
                    name="apellido"
                    value={form.apellido}
                    onChange={handleChange}
                    placeholder="Ej: García"
                    style={{
                      borderRadius: 10,
                      padding: "10px 14px",
                      fontSize: 14,
                      border: "1px solid #e0e0e0",
                    }}
                  />
                  {errors.apellido && (
                    <div className="invalid-feedback">{errors.apellido}</div>
                  )}
                </div>

                {/* Email */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold" style={{ fontSize: 14 }}>
                    Email <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Ej: maria@email.com"
                    style={{
                      borderRadius: 10,
                      padding: "10px 14px",
                      fontSize: 14,
                      border: "1px solid #e0e0e0",
                    }}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>

                {/* WhatsApp */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold" style={{ fontSize: 14 }}>
                    WhatsApp <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.whatsapp ? "is-invalid" : ""}`}
                    name="whatsapp"
                    value={form.whatsapp}
                    onChange={handleChange}
                    placeholder="Ej: +54 11 5555-0101"
                    style={{
                      borderRadius: 10,
                      padding: "10px 14px",
                      fontSize: 14,
                      border: "1px solid #e0e0e0",
                    }}
                  />
                  {errors.whatsapp && (
                    <div className="invalid-feedback">{errors.whatsapp}</div>
                  )}
                </div>

                {/* Dirección */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold" style={{ fontSize: 14 }}>
                    Dirección <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.direccion ? "is-invalid" : ""}`}
                    name="direccion"
                    value={form.direccion}
                    onChange={handleChange}
                    placeholder="Ej: Av. Corrientes 1234"
                    style={{
                      borderRadius: 10,
                      padding: "10px 14px",
                      fontSize: 14,
                      border: "1px solid #e0e0e0",
                    }}
                  />
                  {errors.direccion && (
                    <div className="invalid-feedback">{errors.direccion}</div>
                  )}
                </div>

                {/* Ciudad */}
                <div className="col-6 col-md-3">
                  <label className="form-label fw-semibold" style={{ fontSize: 14 }}>
                    Ciudad <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.ciudad ? "is-invalid" : ""}`}
                    name="ciudad"
                    value={form.ciudad}
                    onChange={handleChange}
                    placeholder="Ej: CABA"
                    style={{
                      borderRadius: 10,
                      padding: "10px 14px",
                      fontSize: 14,
                      border: "1px solid #e0e0e0",
                    }}
                  />
                  {errors.ciudad && (
                    <div className="invalid-feedback">{errors.ciudad}</div>
                  )}
                </div>

                {/* Código Postal */}
                <div className="col-6 col-md-3">
                  <label className="form-label fw-semibold" style={{ fontSize: 14 }}>
                    Código Postal <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.codigoPostal ? "is-invalid" : ""}`}
                    name="codigoPostal"
                    value={form.codigoPostal}
                    onChange={handleChange}
                    placeholder="Ej: C1043"
                    style={{
                      borderRadius: 10,
                      padding: "10px 14px",
                      fontSize: 14,
                      border: "1px solid #e0e0e0",
                    }}
                  />
                  {errors.codigoPostal && (
                    <div className="invalid-feedback">{errors.codigoPostal}</div>
                  )}
                </div>

                {/* Estado */}
                <div className="col-12 col-md-6">
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

                {/* Observaciones */}
                <div className="col-12">
                  <label className="form-label fw-semibold" style={{ fontSize: 14 }}>
                    Observaciones
                  </label>
                  <textarea
                    className="form-control"
                    name="observaciones"
                    value={form.observaciones}
                    onChange={handleChange}
                    placeholder="Notas sobre el cliente (opcional)..."
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
                    {isEditing ? "Actualizando…" : "Guardando…"}
                  </>
                ) : isEditing ? (
                  "💾 Actualizar Cliente"
                ) : (
                  "💾 Guardar Cliente"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

