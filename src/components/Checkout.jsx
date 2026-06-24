import { useContext, useMemo, useState } from "react";

import { CartContext } from "../context/CartContext";

export default function Checkout() {
  const { cart, totalPrice } = useContext(CartContext);

  const whatsappNumber = "3425238984";

  const [formData, setFormData] = useState({
    nombre: "",
    whatsapp: "",
    email: "",
    ciudad: "",
    direccion: "",
    codigoPostal: "",
    metodoEnvio: "Andreani",
    observaciones: "",
  });

  const waMessage = useMemo(() => {
    const selectedProductsText = cart
      .map((item) => `- ${item.title} ( $${item.price} )`)
      .join("\n");

    return [
      `Hola Aldana, me gustaría confirmar mi compra 💖`,
      `\nNombre: ${formData.nombre}`,
      `Teléfono (WhatsApp): ${formData.whatsapp}`,
      `Email: ${formData.email}`,
      `Dirección: ${formData.direccion}`,
      `Ciudad: ${formData.ciudad}`,
      `Código postal: ${formData.codigoPostal}`,
      `Método de envío: ${formData.metodoEnvio}`,
      `\nProductos:\n${selectedProductsText || "-"}`,
      `\nTotal: $${totalPrice}`,
      `Observaciones: ${formData.observaciones}`,
    ].join("\n");
  }, [cart, formData, totalPrice]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const messageEncoded = encodeURIComponent(waMessage);
    const waUrl = `https://wa.me/${whatsappNumber}?text=${messageEncoded}`;

    window.open(waUrl, "_blank");
  };

  return (
    <section className="checkout-section py-5" id="checkout">
      <div className="container">
        <div className="checkout-box">
          {/* HEADER */}
          <div className="text-center mb-5">
            <span className="checkout-subtitle">Finalizar compra</span>
            <h2 className="checkout-title">Completá tus datos 💖</h2>
            <p className="checkout-text">Coordiná tu pedido con Aldana</p>
          </div>

          {/* RESUMEN */}
          <div className="mb-4">
            <h5 className="fw-bold mb-3">Resumen del pedido</h5>

            {cart.length === 0 ? (
              <p className="text-muted mb-0">Tu carrito está vacío.</p>
            ) : (
              <div className="row g-3">
                {cart.map((item) => (
                  <div key={item.id} className="col-12">
                    <div className="d-flex align-items-center gap-3 cart-item p-3">
                      <img
                        src={item.image}
                        alt={item.title}
                        style={{ width: 60, height: 60 }}
                      />
                      <div className="flex-grow-1">
                        <div className="fw-semibold">{item.title}</div>
                        <div className="text-muted">${item.price}</div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="col-12">
                  <hr />
                  <h5 className="fw-bold">Total: ${totalPrice}</h5>
                </div>
              </div>
            )}
          </div>

          {/* FORM */}
          <form className="row g-4" onSubmit={handleSubmit}>


            {/* NOMBRE */}

            <div className="col-md-6">

              <label className="form-label">
                Nombre completo
              </label>

              <input
                type="text"
                className="form-control custom-input"
                placeholder="Tu nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
              />

            </div>

            {/* WHATSAPP */}

            <div className="col-md-6">

              <label className="form-label">
                WhatsApp
              </label>

              <input
                type="text"
                className="form-control custom-input"
                placeholder="342 000 0000"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
              />

            </div>

            {/* EMAIL */}

            <div className="col-md-6">

              <label className="form-label">
                Email
              </label>

              <input
                type="email"
                className="form-control custom-input"
                placeholder="tuemail@gmail.com"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />

            </div>

            {/* CIUDAD */}

            <div className="col-md-6">

              <label className="form-label">
                Ciudad
              </label>

              <input
                type="text"
                className="form-control custom-input"
                placeholder="Santa Fe"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleChange}
              />

            </div>

            {/* DIRECCIÓN */}

            <div className="col-12">

              <label className="form-label">
                Dirección
              </label>

              <input
                type="text"
                className="form-control custom-input"
                placeholder="Calle y número"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
              />

            </div>

            {/* CP */}

            <div className="col-md-6">

              <label className="form-label">
                Código postal
              </label>

              <input
                type="text"
                className="form-control custom-input"
                placeholder="3000"
                name="codigoPostal"
                value={formData.codigoPostal}
                onChange={handleChange}
              />

            </div>

            {/* ENVÍO */}

            <div className="col-md-6">

              <label className="form-label">
                Método de envío
              </label>

              <select
                className="form-select custom-input"
                name="metodoEnvio"
                value={formData.metodoEnvio}
                onChange={handleChange}
              >

                <option value="Andreani">
                  Andreani
                </option>

                <option value="Correo Argentino">
                  Correo Argentino
                </option>

              </select>

            </div>

            {/* OBSERVACIONES */}

            <div className="col-12">

              <label className="form-label">
                Observaciones
              </label>

              <textarea
                rows="5"
                className="form-control custom-input"
                placeholder="Detalles extras del pedido..."
                name="observaciones"
                value={formData.observaciones}
                onChange={handleChange}
              ></textarea>

            </div>

            {/* INFO */}

            <div className="col-12">

              <div className="checkout-info">

                <p>
                  🚚 Envíos a todo el país
                </p>

                <p>
                  💖 Compra mínima: $15.000
                </p>

                <p>
                  🎁 Envíos gratis desde $50.000
                </p>

              </div>

            </div>

            {/* BOTÓN */}

            <div className="col-12 text-center mt-4">

              <button
                type="submit"
                className="btn btn-pink btn-lg px-5"
              >
                Confirmar pedido ✨
              </button>

            </div>

          </form>

        </div>

      </div>

    </section>
  );
}