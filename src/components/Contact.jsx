import {
  FaWhatsapp,
  FaInstagram
} from "react-icons/fa";

export default function Contact() {

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
            Consultanos sobre productos,
            pedidos y envíos.
          </p>

        </div>

        <div className="row g-4 justify-content-center">

          {/* WHATSAPP */}

          <div className="col-md-5">

            <a
              href="https://wa.me/543424383327"
              target="_blank"
              rel="noreferrer"
              className="modern-contact-card"
            >

              <div className="contact-circle whatsapp-bg">

                <FaWhatsapp />

              </div>

              <h4>
                WhatsApp
              </h4>

              <p>
                Hablá directamente con Aldana
              </p>

              <span>
                Enviar mensaje →
              </span>

            </a>

          </div>

          {/* INSTAGRAM */}

          <div className="col-md-5">

            <a
              href="https://www.instagram.com/bella.imagen.stt"
              target="_blank"
              rel="noreferrer"
              className="modern-contact-card"
            >

              <div className="contact-circle insta-bg">

                <FaInstagram />

              </div>

              <h4>
                Instagram
              </h4>

              <p>
                Descubrí novedades y productos
              </p>

              <span>
                Ver perfil →
              </span>

            </a>

          </div>

        </div>

      </div>

    </section>
  );
}