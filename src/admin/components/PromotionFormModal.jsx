import { useState, useEffect } from "react";

const INITIAL_FORM = {
  codigo: "",
  tipo: "porcentaje",
  valor: "",
  descripcion: "",
  estado: "Activa",
  fechaInicio: "",
  fechaFin: "",
};

export default function PromotionFormModal({
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
          codigo: initialData.codigo || "",
          tipo: initialData.tipo || "porcentaje",
          valor: initialData.valor ?? "",
          descripcion: initialData.descripcion || "",
          estado: initialData.estado || "Activa",
          fechaInicio: initialData.fechaInicio || "",
          fechaFin: initialData.fechaFin || "",
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
    if (!form.codigo.trim()) newErrors.codigo = "El código de promoción es obligatorio.";
    if (form.valor === "" || isNaN(Number(form.valor)) || Number(form.valor) <= 0) {
      newErrors.valor = "Ingresá un valor válido mayor a 0.";
    }
    if (form.tipo === "porcentaje" && Number(form.valor) > 100) {
      newErrors.valor = "El porcentaje no puede superar 100.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      codigo: form.codigo.trim().toUpperCase(),
      tipo: form.tipo,
      valor: Number(form.valor),
      descripcion: form.descripcion.trim(),
      estado: form.estado,
      fechaInicio: form.fechaInicio.trim(),
      fechaFin: form.fechaFin.trim(),
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
                {isEditing ? "✏️ Editar Promoción" : "+ Nueva Promoción"}
              </h5>
              <p className="text-muted mb-0" style={{ fontSize: 14 }}>
                {isEditing
                  ? "Modificá los datos de la promoción."
                  : "Completá los campos para agregar una promoción."}
              </p>
            </div>
            <button type="button" className="btn-close" aria-label="Cerrar" onClick={handleClose} />
          </div>

          {/* ── Body ────────────────────────────── */}
          <form onSubmit={handleSubmit}>
            <div className="modal-body px-4 py-3">
              <div className="row g-3">
                {/* Código */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold" style={{ fontSize: 14 }}>
                    Código <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.codigo ? "is-invalid" : ""}`}
                    name="codigo"
                    placeholder="Ej: BIENVENIDA10"
                    value={form.codigo}
                    onChange={handleChange}
                    style={{ borderRadius: 10, padding: "10px 14px", fontSize: 14, border: "1px solid #e0e0e0", textTransform: "uppercase" }}
                  />
                  {errors.codigo && <div className="invalid-feedback">{errors.codigo}</div>}
                  <div className="text-muted mt-1" style={{ fontSize: 12 }}>
                    Se guardará en mayúsculas automáticamente.
                  </div>
                </div>

                {/* Tipo de descuento */}
                <div className="col-12 col-md-3">
                  <label className="form-label fw-semibold" style={{ fontSize: 14 }}>
                    Tipo <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    name="tipo"
                    value={form.tipo}
                    onChange={handleChange}
                    style={{ borderRadius: 10, padding: "10px 14px", fontSize: 14, border: "1px solid #e0e0e0", background: "#fff" }}
                  >
                    <option value="porcentaje">% Porcentaje</option>
                    <option value="fijo">$ Fijo</option>
                  </select>
                </div>

                {/* Valor */}
                <div className="col-12 col-md-3">
                  <label className="form-label fw-semibold" style={{ fontSize: 14 }}>
                    Valor <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className={`form-control ${errors.valor ? "is-invalid" : ""}`}
                    name="valor"
                    placeholder={form.tipo === "porcentaje" ? "Ej: 10" : "Ej: 3000"}
                    min={1}
                    max={form.tipo === "porcentaje" ? 100 : undefined}
                    value={form.valor}
                    onChange={handleChange}
                    style={{ borderRadius: 10, padding: "10px 14px", fontSize: 14, border: "1px solid #e0e0e0" }}
                  />
                  {errors.valor && <div className="invalid-feedback">{errors.valor}</div>}
                  <div className="text-muted mt-1" style={{ fontSize: 12 }}>
                    {form.tipo === "porcentaje" ? "Porcentaje de descuento (máx. 100%)." : "Monto fijo en pesos."}
                  </div>
                </div>

                {/* Fecha inicio */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold" style={{ fontSize: 14 }}>
                    Fecha de inicio
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="fechaInicio"
                    placeholder="Ej: 01/01/2025"
                    value={form.fechaInicio}
                    onChange={handleChange}
                    style={{ borderRadius: 10, padding: "10px 14px", fontSize: 14, border: "1px solid #e0e0e0" }}
                  />
                  <div className="text-muted mt-1" style={{ fontSize: 12 }}>
                    Formato: DD/MM/AAAA
                  </div>
                </div>

                {/* Fecha fin */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold" style={{ fontSize: 14 }}>
                    Fecha de fin
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="fechaFin"
                    placeholder="Ej: 31/12/2026"
                    value={form.fechaFin}
                    onChange={handleChange}
                    style={{ borderRadius: 10, padding: "10px 14px", fontSize: 14, border: "1px solid #e0e0e0" }}
                  />
                  <div className="text-muted mt-1" style={{ fontSize: 12 }}>
                    Formato: DD/MM/AAAA
                  </div>
                </div>

                {/* Estado */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold" style={{ fontSize: 14 }}>Estado</label>
                  <select
                    className="form-select"
                    name="estado"
                    value={form.estado}
                    onChange={handleChange}
                    style={{ borderRadius: 10, padding: "10px 14px", fontSize: 14, border: "1px solid #e0e0e0", background: "#fff" }}
                  >
                    <option value="Activa">Activa</option>
                    <option value="Inactiva">Inactiva</option>
                  </select>
                </div>

                {/* Descripción */}
                <div className="col-12">
                  <label className="form-label fw-semibold" style={{ fontSize: 14 }}>Descripción</label>
                  <textarea
                    className="form-control"
                    name="descripcion"
                    placeholder="Breve descripción de la promoción (opcional)..."
                    rows={2}
                    value={form.descripcion}
                    onChange={handleChange}
                    style={{ borderRadius: 10, padding: "10px 14px", fontSize: 14, border: "1px solid #e0e0e0", resize: "vertical" }}
                  />
                </div>
              </div>
            </div>

            {/* ── Footer ──────────────────────────── */}
            <div className="modal-footer border-0 px-4 pb-4 pt-2 gap-2" style={{ background: "#fff" }}>
              <button
                type="button"
                className="btn px-4 py-2"
                onClick={handleClose}
                disabled={saving}
                style={{ background: "transparent", border: "1px solid #e0e0e0", color: "#333", borderRadius: 10, fontWeight: 600, fontSize: 14 }}
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
              >
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" />
                    {isEditing ? "Actualizando…" : "Guardando…"}
                  </>
                ) : isEditing ? "💾 Actualizar Promoción" : "💾 Guardar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
