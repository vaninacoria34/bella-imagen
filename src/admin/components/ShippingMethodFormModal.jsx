import { useState, useEffect } from "react";

const INITIAL_FORM = {
  icono: "🚚",
  nombre: "",
  descripcion: "",
  costo: "",
  tiempoEstimado: "",
  gratisDesde: "",
  estado: "Activa",
  orden: "",
};

const ICON_OPTIONS = ["🚚", "📮", "🏪", "🛵", "🚙", "🚢", "✈️"];

export default function ShippingMethodFormModal({
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
          icono: initialData.icono || "🚚",
          nombre: initialData.nombre || "",
          descripcion: initialData.descripcion || "",
          costo: initialData.costo ?? "",
          tiempoEstimado: initialData.tiempoEstimado || "",
          gratisDesde: initialData.gratisDesde ?? "",
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
    if (!form.nombre.trim()) newErrors.nombre = "El nombre del método de envío es obligatorio.";
    if (form.costo === "" || isNaN(Number(form.costo)) || Number(form.costo) < 0) {
      newErrors.costo = "Ingresá un costo válido (mayor o igual a 0).";
    }
    if (form.gratisDesde !== "" && (isNaN(Number(form.gratisDesde)) || Number(form.gratisDesde) < 0)) {
      newErrors.gratisDesde = "Ingresá un monto válido o dejalo vacío.";
    }
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
      icono: form.icono.trim() || "🚚",
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      costo: Number(form.costo),
      tiempoEstimado: form.tiempoEstimado.trim(),
      gratisDesde: form.gratisDesde !== "" ? Number(form.gratisDesde) : 0,
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
                {isEditing ? "✏️ Editar Método de Envío" : "+ Nuevo Método de Envío"}
              </h5>
              <p className="text-muted mb-0" style={{ fontSize: 14 }}>
                {isEditing
                  ? "Modificá los datos del método de envío."
                  : "Completá los campos para agregar un método de envío."}
              </p>
            </div>
            <button type="button" className="btn-close" aria-label="Cerrar" onClick={handleClose} />
          </div>

          {/* ── Body ────────────────────────────── */}
          <form onSubmit={handleSubmit}>
            <div className="modal-body px-4 py-3">
              <div className="row g-3">
                {/* Icono */}
                <div className="col-12 col-md-3">
                  <label className="form-label fw-semibold" style={{ fontSize: 14 }}>
                    Icono
                  </label>
                  <select
                    className="form-select"
                    name="icono"
                    value={form.icono}
                    onChange={handleChange}
                    style={{ borderRadius: 10, padding: "10px 14px", fontSize: 14, border: "1px solid #e0e0e0", background: "#fff" }}
                  >
                    {ICON_OPTIONS.map((ic) => (
                      <option key={ic} value={ic}>{ic}</option>
                    ))}
                  </select>
                </div>

                {/* Nombre */}
                <div className="col-12 col-md-9">
                  <label className="form-label fw-semibold" style={{ fontSize: 14 }}>
                    Nombre <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
                    name="nombre"
                    placeholder="Ej: Andreani"
                    value={form.nombre}
                    onChange={handleChange}
                    style={{ borderRadius: 10, padding: "10px 14px", fontSize: 14, border: "1px solid #e0e0e0" }}
                  />
                  {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                </div>

                {/* Costo */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold" style={{ fontSize: 14 }}>
                    Costo ($) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className={`form-control ${errors.costo ? "is-invalid" : ""}`}
                    name="costo"
                    placeholder="Ej: 1500"
                    min={0}
                    value={form.costo}
                    onChange={handleChange}
                    style={{ borderRadius: 10, padding: "10px 14px", fontSize: 14, border: "1px solid #e0e0e0" }}
                  />
                  {errors.costo && <div className="invalid-feedback">{errors.costo}</div>}
                  <div className="text-muted mt-1" style={{ fontSize: 12 }}>
                    Usá 0 para envío gratuito.
                  </div>
                </div>

                {/* Tiempo estimado */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold" style={{ fontSize: 14 }}>
                    Tiempo estimado
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="tiempoEstimado"
                    placeholder="Ej: 3 a 7 días hábiles"
                    value={form.tiempoEstimado}
                    onChange={handleChange}
                    style={{ borderRadius: 10, padding: "10px 14px", fontSize: 14, border: "1px solid #e0e0e0" }}
                  />
                </div>

                {/* Gratis desde */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold" style={{ fontSize: 14 }}>
                    Envío gratis desde ($)
                  </label>
                  <input
                    type="number"
                    className={`form-control ${errors.gratisDesde ? "is-invalid" : ""}`}
                    name="gratisDesde"
                    placeholder="Ej: 50000"
                    min={0}
                    value={form.gratisDesde}
                    onChange={handleChange}
                    style={{ borderRadius: 10, padding: "10px 14px", fontSize: 14, border: "1px solid #e0e0e0" }}
                  />
                  {errors.gratisDesde && <div className="invalid-feedback">{errors.gratisDesde}</div>}
                  <div className="text-muted mt-1" style={{ fontSize: 12 }}>
                    Si el pedido supera este monto, el envío es gratis. Dejalo vacío para no aplicar.
                  </div>
                </div>

                {/* Estado */}
                <div className="col-12 col-md-3">
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

                {/* Orden */}
                <div className="col-12 col-md-3">
                  <label className="form-label fw-semibold" style={{ fontSize: 14 }}>Orden</label>
                  <input
                    type="number"
                    className={`form-control ${errors.orden ? "is-invalid" : ""}`}
                    name="orden"
                    placeholder="Ej: 1"
                    min={1}
                    value={form.orden}
                    onChange={handleChange}
                    style={{ borderRadius: 10, padding: "10px 14px", fontSize: 14, border: "1px solid #e0e0e0" }}
                  />
                  {errors.orden && <div className="invalid-feedback">{errors.orden}</div>}
                  <div className="text-muted mt-1" style={{ fontSize: 12 }}>
                    Posición en el checkout (opcional).
                  </div>
                </div>

                {/* Descripción */}
                <div className="col-12">
                  <label className="form-label fw-semibold" style={{ fontSize: 14 }}>Descripción</label>
                  <textarea
                    className="form-control"
                    name="descripcion"
                    placeholder="Breve descripción del método de envío (opcional)..."
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
                ) : isEditing ? "💾 Actualizar Método" : "💾 Guardar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
