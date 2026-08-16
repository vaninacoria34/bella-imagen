import { useEffect, useState } from "react";
import useSettings from "../hooks/useSettings";
import { FaWhatsapp } from "react-icons/fa";

/**
 * Settings
 * ─────────────────────────────────────────────────
 * Página de configuración del negocio.
 *
 *  Permite editar:
 *    • Datos del negocio (nombre, vendedora, dirección, etc.)
 *    • Contacto y redes (WhatsApp, Instagram, email)
 *    • Envíos y compra mínima
 *    • Textos (acerca de)
 *    • Datos de la desarrolladora / soporte técnico
 */
export default function Settings() {
  const { settings, loading, error, refresh, saveSettings } = useSettings();

  const [formData, setFormData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData) return;
    try {
      setSaving(true);
      await saveSettings(formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert(err?.message || "Ocurrió un error al guardar la configuración.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <span className="spinner-border text-danger" role="status" />
        <div className="text-muted mt-2">Cargando configuración…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-5">
        <p className="text-danger">{error}</p>
        <button className="btn btn-outline-danger" onClick={refresh}>
          Reintentar
        </button>
      </div>
    );
  }

  if (!formData) return null;

  const waLinkDev = `https://wa.me/${formData.devWhatsapp}`;

  return (
    <div>
      {/* ── Header ─────────────────────────────── */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h3 className="fw-bold mb-1" style={{ color: "#001219" }}>
            ⚙ Configuración
          </h3>
          <p className="text-muted mb-0" style={{ fontSize: 14 }}>
            Configurá los datos generales de Bella Imagen.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          {/* ── Datos del negocio ───────────────── */}
          <div className="col-12">
            <div className="card border-0 shadow-sm" style={{ borderRadius: 14 }}>
              <div className="card-body">
                <h6 className="fw-bold mb-3">🏪 Datos del negocio</h6>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Nombre del negocio</label>
                    <input
                      type="text"
                      className="form-control"
                      name="nombreNegocio"
                      value={formData.nombreNegocio}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Nombre de la vendedora</label>
                    <input
                      type="text"
                      className="form-control"
                      name="nombreVendedora"
                      value={formData.nombreVendedora}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Dirección</label>
                    <input
                      type="text"
                      className="form-control"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleChange}
                      placeholder="Calle y número"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Ciudad</label>
                    <input
                      type="text"
                      className="form-control"
                      name="ciudad"
                      value={formData.ciudad}
                      onChange={handleChange}
                      placeholder="Santa Fe"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Horario de atención</label>
                    <input
                      type="text"
                      className="form-control"
                      name="horarioAtencion"
                      value={formData.horarioAtencion}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Texto "Acerca de"</label>
                    <textarea
                      rows="2"
                      className="form-control"
                      name="acercaDe"
                      value={formData.acercaDe}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Contacto y redes ────────────────── */}
          <div className="col-12">
            <div className="card border-0 shadow-sm" style={{ borderRadius: 14 }}>
              <div className="card-body">
                <h6 className="fw-bold mb-3">📞 Contacto y redes</h6>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">WhatsApp (número)</label>
                    <input
                      type="text"
                      className="form-control"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      placeholder="3425238984"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">WhatsApp (enlace / número)</label>
                    <input
                      type="text"
                      className="form-control"
                      name="whatsappLink"
                      value={formData.whatsappLink}
                      onChange={handleChange}
                      placeholder="3425238984"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Instagram (usuario sin @)</label>
                    <input
                      type="text"
                      className="form-control"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleChange}
                      placeholder="bella.imagen.stt"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email de contacto</label>
                    <input
                      type="email"
                      className="form-control"
                      name="emailContacto"
                      value={formData.emailContacto}
                      onChange={handleChange}
                      placeholder="contacto@bella.com"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Envíos y compra mínima ──────────── */}
          <div className="col-12">
            <div className="card border-0 shadow-sm" style={{ borderRadius: 14 }}>
              <div className="card-body">
                <h6 className="fw-bold mb-3">🚚 Envíos y compra mínima</h6>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Compra mínima ($)</label>
                    <input
                      type="number"
                      className="form-control"
                      name="compraMinima"
                      value={formData.compraMinima}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Envíos gratis desde ($)</label>
                    <input
                      type="number"
                      className="form-control"
                      name="envioGratisDesde"
                      value={formData.envioGratisDesde}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Desarrolladora / Soporte técnico ── */}
          <div className="col-12">
            <div className="card border-0 shadow-sm" style={{ borderRadius: 14, borderLeft: "4px solid #ee9b00" }}>
              <div className="card-body">
                <h6 className="fw-bold mb-3">👩‍💻 Desarrolladora / Soporte técnico</h6>
                <p className="text-muted mb-3" style={{ fontSize: 13 }}>
                  Para cualquier consulta sobre el funcionamiento del sitio, comunicate con la desarrolladora.
                </p>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Nombre</label>
                    <input
                      type="text"
                      className="form-control"
                      name="devNombre"
                      value={formData.devNombre}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Rol</label>
                    <input
                      type="text"
                      className="form-control"
                      name="devRol"
                      value={formData.devRol}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">WhatsApp de la desarrolladora</label>
                    <input
                      type="text"
                      className="form-control"
                      name="devWhatsapp"
                      value={formData.devWhatsapp}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6 d-flex align-items-end">
                    <a
                      href={waLinkDev}
                      target="_blank"
                      rel="noreferrer"
                      className="btn w-100"
                      style={{ background: "#25D366", color: "#fff", borderRadius: 10, fontWeight: 600 }}
                    >
                      <FaWhatsapp style={{ marginRight: 6 }} />
                      Contactar por WhatsApp
                    </a>
                  </div>
                  <div className="col-12">
                    <label className="form-label">Mensaje de soporte</label>
                    <textarea
                      rows="2"
                      className="form-control"
                      name="devMensaje"
                      value={formData.devMensaje}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Acciones ────────────────────────── */}
          <div className="col-12 d-flex align-items-center gap-3">
            <button
              type="submit"
              className="btn px-5 py-2"
              disabled={saving}
              style={{
                background: "#ee9b00",
                color: "#fff",
                border: "none",
                borderRadius: 12,
                fontWeight: 600,
              }}
            >
              {saving ? "Guardando…" : "Guardar cambios"}
            </button>
            {saved && (
              <span className="text-success fw-semibold">✓ Configuración guardada</span>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
