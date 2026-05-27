import { useContext } from "react";

import { CartContext } from "../context/CartContext";

export default function Checkout() {
  const { cart, totalPrice } = useContext(CartContext);

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
          <form className="row g-4">


            {/* NOMBRE */}

            <div className="col-md-6">

              <label className="form-label">
                Nombre completo
              </label>

              <input
                type="text"
                className="form-control custom-input"
                placeholder="Tu nombre"
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
              />

            </div>

            {/* ENVÍO */}

            <div className="col-md-6">

              <label className="form-label">
                Método de envío
              </label>

              <select className="form-select custom-input">

                <option>
                  Andreani
                </option>

                <option>
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