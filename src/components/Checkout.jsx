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
    metodoEnvio: "",
    observaciones: "",
  });

  const waMessage = useMemo(() => {
    const selectedProductsText = cart
      .map(
        (item) => `- ${item.title} x ${item.quantity} ( $${item.price} )`
      )
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

  const [errors, setErrors] = useState({});

  const validate = (data) => {
    const nextErrors = {};

    const nombre = (data.nombre || "").trim();
    if (!nombre) {
      nextErrors.nombre = "Ingrese su nombre.";
    }

    const whatsappRaw = (data.whatsapp || "").trim();
    const whatsappDigits = whatsappRaw.replace(/\D/g, "");
    if (!whatsappRaw) {
      nextErrors.whatsapp = "Ingrese un número de WhatsApp válido.";
    } else if (!/^\d+$/.test(whatsappDigits)) {
      nextErrors.whatsapp = "Ingrese un número de WhatsApp válido.";
    } else if (whatsappDigits.length < 10 || whatsappDigits.length > 15) {
      nextErrors.whatsapp = "El número de WhatsApp debe tener entre 10 y 15 dígitos.";
    }

    const direccion = (data.direccion || "").trim();
    if (!direccion) {
      nextErrors.direccion = "Ingrese su dirección.";
    }

    const ciudad = (data.ciudad || "").trim();
    if (!ciudad) {
      nextErrors.ciudad = "Ingrese su ciudad.";
    }

    const codigoPostal = (data.codigoPostal || "").trim();
    if (!codigoPostal) {
      nextErrors.codigoPostal = "Ingrese su código postal.";
    } else if (!/^\d+$/.test(codigoPostal)) {
      nextErrors.codigoPostal = "El código postal solo debe contener números.";
    }

    const metodoEnvio = (data.metodoEnvio || "").trim();
    if (!metodoEnvio) {
      nextErrors.metodoEnvio = "Seleccione un método de envío.";
    }

    return nextErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nextErrors = validate(formData);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    alert("¡Pedido confirmado! Vamos a continuar con tu compra.");

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
                        <div className="text-muted">${item.price} x {item.quantity}</div>
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

              {errors.nombre && (
                <div className="text-danger mt-1">{errors.nombre}</div>
              )}

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

              {errors.whatsapp && (
                <div className="text-danger mt-1">{errors.whatsapp}</div>
              )}

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

              {errors.ciudad && (
                <div className="text-danger mt-1">{errors.ciudad}</div>
              )}

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

              {errors.direccion && (
                <div className="text-danger mt-1">{errors.direccion}</div>
              )}

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

              {errors.codigoPostal && (
                <div className="text-danger mt-1">{errors.codigoPostal}</div>
              )}

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

                <option value="">
                  Seleccionar método de envío...
                </option>

                <option value="Andreani">
                  Andreani
                </option>

                <option value="Correo Argentino">
                  Correo Argentino
                </option>

              </select>

              {errors.metodoEnvio && (
                <div className="text-danger mt-1">{errors.metodoEnvio}</div>
              )}

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