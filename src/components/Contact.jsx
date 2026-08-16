import { useEffect, useState } from "react";
import {
  FaWhatsapp,
  FaInstagram,
  FaCode,
  FaPaperPlane
} from "react-icons/fa";
import { getSettings } from "../admin/services/settingsService";
import { createMessage } from "../admin/services/messageService";

export default function Contact() {
  const [settings, setSettings] = useState(null);

  // ── Formulario de contacto ─────────────────────
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    asunto: "",
    mensaje: "",
  });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getSettings()
      .then((data) => {
        if (!cancelled) setSettings(data);
      })
      .catch(() => {
        if (!cancelled) setSettings(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const whatsappLink =
    settings?.whatsappLink || settings?.whatsapp || "3425238984";
  const instagram = settings?.instagram || "bella.imagen.stt";
  const nombreVendedora = settings?.nombreVendedora || "Aldana";
  const devWhatsapp = settings?.devWhatsapp || "3425238984";
  const devNombre = settings?.devNombre || "Vanina Coria";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = (data) => {
    const nextErrors = {};
    if (!data.nombre.trim()) {
      nextErrors.nombre = "Ingrese su nombre.";
    }
    if (!data.mensaje.trim()) {
      nextErrors.mensaje = "Escriba su consulta.";
    }
    return nextErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      setSending(true);
      await createMessage(form);
      setSent(true);
      setForm({
        nombre: "",
        email: "",
        telefono: "",
        asunto: "",
        mensaje: "",
      });
    } catch (err) {
      alert(err?.message || "No se pudo enviar el mensaje. Intentalo de nuevo.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      className="contact-modern py-5"
      id="contact"
    >
      <div className="container">
        <div className="text-center mb-5">
          <span className="contact-mini">
            CONTACTO
          </span>
          <h2 className="contact-heading">
            Estamos para ayudarte 💖
          </h2>
          <p className="contact-description">
            Consultanos sobre productos, pedidos y envíos.
          </p>
        </div>

        <div className="row g-4 justify-content-center">
          {/* WHATSAPP */}
          <div className="col-md-5">
            <a
              href={`https://wa.me/${whatsappLink}`}
              target="_blank"
              rel="noreferrer"
              className="modern-contact-card"
            >
              <div className="contact-circle whatsapp-bg">
                <FaWhatsapp />
              </div>
              <h4>WhatsApp</h4>
              <p>Hablá directamente con {nombreVendedora}</p>
              <span>Enviar mensaje →</span>
            </a>
          </div>

          {/* INSTAGRAM */}
          <div className="col-md-5">
            <a
              href={`https://www.instagram.com/${instagram}`}
              target="_blank"
              rel="noreferrer"
              className="modern-contact-card"
            >
              <div className="contact-circle insta-bg">
                <FaInstagram />
              </div>
              <h4>Instagram</h4>
              <p>Descubrí novedades y productos</p>
              <span>Ver perfil →</span>
            </a>
          </div>

          {/* DESARROLLADORA / SOPORTE TÉCNICO */}
          <div className="col-md-10">
            <a
              href={`https://wa.me/${devWhatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="modern-contact-card"
              style={{ borderStyle: "dashed" }}
            >
              <div className="contact-circle dev-bg">
                <FaCode />
              </div>
              <h4>Soporte técnico</h4>
              <p>
                ¿Tenés una consulta sobre el funcionamiento del sitio?
                Comunicate con {devNombre} (desarrolladora).
              </p>
              <span>Contactar por WhatsApp →</span>
            </a>
          </div>

          {/* FORMULARIO DE CONTACTO */}
          <div className="col-md-10">
            <div className="modern-contact-card" style={{ display: "block" }}>
              <div className="contact-circle" style={{
                background: "#e9d8a6",
                color: "#ee9b00",
                margin: "0 auto 16px"
              }}>
                <FaPaperPlane />
              </div>
              <h4>Envianos un mensaje</h4>
              <p>
                Completá el formulario y te vamos a responder a la brevedad.
              </p>

              {sent ? (
                <div className="alert alert-success text-center" role="alert">
                  ✅ ¡Mensaje enviado! Te vamos a responder pronto.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="text-start mt-3">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Nombre *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Tu nombre"
                        name="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                      />
                      {errors.nombre && (
                        <div className="text-danger mt-1" style={{ fontSize: 13 }}>
                          {errors.nombre}
                        </div>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="tu@email.com"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Teléfono / WhatsApp</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="342 000 0000"
                        name="telefono"
                        value={form.telefono}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Asunto</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Producto, envío, etc."
                        name="asunto"
                        value={form.asunto}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label">Mensaje *</label>
                      <textarea
                        rows="4"
                        className="form-control"
                        placeholder="Escribí tu consulta..."
                        name="mensaje"
                        value={form.mensaje}
                        onChange={handleChange}
                      />
                      {errors.mensaje && (
                        <div className="text-danger mt-1" style={{ fontSize: 13 }}>
                          {errors.mensaje}
                        </div>
                      )}
                    </div>

                    <div className="col-12 text-center mt-3">
                      <button
                        type="submit"
                        className="btn btn-pink px-4"
                        disabled={sending}
                        style={{ minWidth: 200 }}
                      >
                        {sending ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm"
                              role="status"
                              style={{ marginRight: 6 }}
                            />
                            Enviando…
                          </>
                        ) : (
                          "Enviar mensaje ✨"
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
