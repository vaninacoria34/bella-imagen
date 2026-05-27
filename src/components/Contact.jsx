import {
  FaWhatsapp,
  FaInstagram
} from "react-icons/fa";

export default function Contact() {
  return (
    <section className="contact-section py-5">

      <div className="container">

        <div className="text-center mb-5">

          <span className="contact-subtitle">
            Contacto
          </span>

          <h2 className="contact-title">
            Hablá con Aldana 💖
          </h2>

          <p className="contact-text">
            Estamos para ayudarte con tus compras,
            consultas y pedidos personalizados.
          </p>

        </div>

        <div className="row justify-content-center g-4">

          {/* WHATSAPP */}

          <div className="col-md-5">

            <a
              href="https://wa.me/543424383327"
              target="_blank"
              className="contact-card"
            >

              <div className="contact-icon whatsapp">

                <FaWhatsapp />

              </div>

              <div>

                <h4>WhatsApp</h4>

                <p>
                  Envíanos un mensaje directo
                </p>

              </div>

            </a>

          </div>

          {/* INSTAGRAM */}

          <div className="col-md-5">

            <a
              href="https://www.instagram.com/bella.imagen.stt?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw="
              target="_blank"
              className="contact-card"
            >

              <div className="contact-icon instagram">

                <FaInstagram />

              </div>

              <div>

                <h4>Instagram</h4>

                <p>
                  Seguinos y descubrí novedades
                </p>

              </div>

            </a>

          </div>

        </div>

      </div>

    </section>
  );
}