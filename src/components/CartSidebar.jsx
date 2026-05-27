import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { FaTrash } from "react-icons/fa";

export default function CartSidebar() {
  const navigate = useNavigate();

  const { cart, removeFromCart, totalPrice } = useContext(CartContext);

  return (
    <div
      className="offcanvas offcanvas-end"
      tabIndex="-1"
      id="cartSidebar"
    >

      {/* HEADER */}

      <div className="offcanvas-header">

        <h5 className="fw-bold">
          Mi carrito 🛍
        </h5>

        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="offcanvas"
        ></button>

      </div>

      {/* BODY */}

      <div className="offcanvas-body">

        {cart.length === 0 ? (

          <p className="text-muted">
            Tu carrito está vacío
          </p>

        ) : (

          <>
            {/* PRODUCTOS */}

            {cart.map((item) => (

              <div
                key={item.id}
                className="cart-item mb-3"
              >

                <img
                  src={item.image}
                  alt={item.title}
                />

                <div className="flex-grow-1">

                  <h6 className="mb-1">
                    {item.title}
                  </h6>

                  <p className="mb-0 text-muted">
                    ${item.price}
                  </p>

                </div>

                <button
                  className="btn btn-sm btn-danger"
                  onClick={() =>
                    removeFromCart(item.id)
                  }
                >
                  <FaTrash />
                </button>

              </div>

            ))}

            {/* TOTAL */}

            <hr />

            <h5 className="fw-bold">
              Total: ${totalPrice}
            </h5>

            {/* INFO ENVÍOS */}

            <div className="shipping-box mt-4">

              <h6 className="fw-bold mb-2">
                🚚 Envíos
              </h6>

              <p className="mb-1">
                Andreani y Correo Argentino
              </p>

              <small className="text-muted">
                Compra mínima $15.000
              </small>

              <br />

              <small className="text-muted">
                Envíos gratis desde $50.000
              </small>

            </div>

            {/* OPCIONES */}

            <div className="shipping-options mt-4">

              <h6 className="fw-bold mb-3">
                Método de envío
              </h6>

              {/* ANDREANI */}

              <div className="shipping-option">

                <input
                  type="radio"
                  name="shipping"
                  id="andreani"
                />

                <label htmlFor="andreani">
                  Andreani
                </label>

              </div>

              {/* CORREO */}

              <div className="shipping-option mt-2">

                <input
                  type="radio"
                  name="shipping"
                  id="correo"
                />

                <label htmlFor="correo">
                  Correo Argentino
                </label>

              </div>

            </div>

            {/* CHECKOUT */}

            <button
              type="button"
              className="btn btn-pink w-100 mt-4"
              onClick={() => navigate("/checkout")}
              data-bs-dismiss="offcanvas"
            >
              Finalizar compra ✨
            </button>

          </>

        )}

      </div>

    </div>
  );
}