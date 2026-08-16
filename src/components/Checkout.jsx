import { useContext, useEffect, useMemo, useState } from "react";

import { CartContext } from "../context/CartContext";
import { createOrder } from "../admin/services/orderService";
import { getActivePaymentMethods } from "../admin/services/paymentMethodService";
import { getActiveShippingMethods } from "../admin/services/shippingService";
import { getPromotionByCode } from "../admin/services/promotionService";
import { getSettings } from "../admin/services/settingsService";

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useContext(CartContext);

  const [settings, setSettings] = useState(null);

  const [paymentMethods, setPaymentMethods] = useState([]);
  const [shippingMethods, setShippingMethods] = useState([]);

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

  useEffect(() => {
    let cancelled = false;
    getActivePaymentMethods()
      .then((methods) => {
        if (!cancelled) setPaymentMethods(methods);
      })
      .catch(() => {
        if (!cancelled) setPaymentMethods([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    getActiveShippingMethods()
      .then((methods) => {
        if (!cancelled) setShippingMethods(methods);
      })
      .catch(() => {
        if (!cancelled) setShippingMethods([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // ── Promoción ───────────────────────────────────
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromotion, setAppliedPromotion] = useState(null);
  const [promoError, setPromoError] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);

  const descuento = useMemo(() => {
    if (!appliedPromotion) return 0;
    if (appliedPromotion.tipo === "porcentaje") {
      return Math.round((totalPrice * appliedPromotion.valor) / 100);
    }
    return Math.min(appliedPromotion.valor, totalPrice);
  }, [appliedPromotion, totalPrice]);

  const totalFinal = Math.max(0, totalPrice - descuento);

  const handleApplyPromotion = async () => {
    const code = (promoCode || "").trim().toUpperCase();
    if (!code) {
      setPromoError("Ingresá un código de promoción.");
      return;
    }
    setPromoLoading(true);
    setPromoError("");
    try {
      const promo = await getPromotionByCode(code);
      if (!promo) {
        setPromoError("El código de promoción no existe.");
        setAppliedPromotion(null);
        return;
      }
      if (promo.estado !== "Activa") {
        setPromoError("El código de promoción está inactivo.");
        setAppliedPromotion(null);
        return;
      }
      setAppliedPromotion(promo);
    } catch (err) {
      setPromoError(err?.message || "No se pudo aplicar el código.");
      setAppliedPromotion(null);
    } finally {
      setPromoLoading(false);
    }
  };

  const handleRemovePromotion = () => {
    setAppliedPromotion(null);
    setPromoError("");
    setPromoCode("");
  };

  const [formData, setFormData] = useState({
    nombre: "",
    whatsapp: "",
    email: "",
    ciudad: "",
    direccion: "",
    codigoPostal: "",
    metodoEnvio: "",
    metodoPago: "",
    observaciones: "",
  });

const whatsappNumber =
    settings?.whatsappLink || settings?.whatsapp || "3425238984";
  const nombreVendedora = settings?.nombreVendedora || "Aldana";

  const waMessage = useMemo(() => {
    const selectedProductsText = cart
      .map(
        (item) => `- ${item.title} x ${item.quantity} ( $${item.price} )`
      )
      .join("\n");

    const promoLine =
      appliedPromotion && descuento > 0
        ? `\nCódigo promocional: ${appliedPromotion.codigo} (-$${descuento})`
        : "";

    return [
`Hola ${nombreVendedora}, me gustaría confirmar mi compra 💖`,
      `\nNombre: ${formData.nombre}`,
      `Teléfono (WhatsApp): ${formData.whatsapp}`,
      `Email: ${formData.email}`,
      `Dirección: ${formData.direccion}`,
      `Ciudad: ${formData.ciudad}`,
      `Código postal: ${formData.codigoPostal}`,
      `Método de envío: ${formData.metodoEnvio}`,
      `Método de pago: ${formData.metodoPago}`,
      `\nProductos:\n${selectedProductsText || "-"}`,
      `\nSubtotal: $${totalPrice}${promoLine}`,
      `\nTotal: $${totalFinal}`,
      `Observaciones: ${formData.observaciones}`,
    ].join("\n");
  }, [cart, formData, totalPrice, totalFinal, appliedPromotion, descuento]);

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

    const metodoPago = (data.metodoPago || "").trim();
    if (!metodoPago) {
      nextErrors.metodoPago = "Seleccione un método de pago.";
    }

    return nextErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = validate(formData);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    // ── Calcular costo de envío según método seleccionado ──
    const selectedShipping = shippingMethods.find(
      (m) => m.nombre === formData.metodoEnvio
    );
    const costoEnvio =
      selectedShipping && selectedShipping.gratisDesde > 0 && totalPrice >= selectedShipping.gratisDesde
        ? 0
        : selectedShipping?.costo ?? 0;

    // ── Registrar el pedido en el panel admin ──────────────
    let pedidoRegistrado = false;
    if (cart.length > 0) {
      try {
        await createOrder({
          cliente: formData.nombre,
          whatsapp: formData.whatsapp,
          email: formData.email,
          direccion: formData.direccion,
          ciudad: formData.ciudad,
          codigoPostal: formData.codigoPostal,
          metodoEnvio: formData.metodoEnvio,
          metodoEnvioId: selectedShipping?.id,
          metodoPago: formData.metodoPago,
          costoEnvio,
          promocion: appliedPromotion?.codigo || "",
          descuento,
          observaciones: formData.observaciones,
          productos: cart.map((item) => ({
            id: item.id,
            nombre: item.title,
            cantidad: item.quantity,
            precio: item.price,
          })),
        });
        pedidoRegistrado = true;
        clearCart();
      } catch (err) {
        // No bloqueamos la venta: igual se abre WhatsApp
        console.error("No se pudo registrar el pedido:", err);
      }
    }

    if (pedidoRegistrado) {
      alert("¡Pedido confirmado y registrado! Te contactamos por WhatsApp para coordinar el envío 💖");
    } else {
      alert("¡Pedido confirmado! Vamos a continuar con tu compra.");
    }

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
<p className="checkout-text">Coordiná tu pedido con {nombreVendedora}</p>
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
                  {descuento > 0 && (
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-muted">Subtotal</span>
                      <span className="fw-semibold">${totalPrice}</span>
                    </div>
                  )}
                  {descuento > 0 && (
                    <div className="d-flex justify-content-between mb-1" style={{ color: "#2e7d32" }}>
                      <span>Descuento ({appliedPromotion?.codigo})</span>
                      <span className="fw-semibold">-${descuento}</span>
                    </div>
                  )}
                  <h5 className="fw-bold">Total: ${totalFinal}</h5>
                </div>
              </div>
            )}
          </div>

          {/* FORM */}
          <form className="row g-4" onSubmit={handleSubmit}>

            {/* NOMBRE */}
            <div className="col-md-6">
              <label className="form-label">Nombre completo</label>
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
              <label className="form-label">WhatsApp</label>
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
              <label className="form-label">Email</label>
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
              <label className="form-label">Ciudad</label>
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
              <label className="form-label">Dirección</label>
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
              <label className="form-label">Código postal</label>
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
              <label className="form-label">Método de envío</label>
              <select
                className="form-select custom-input"
                name="metodoEnvio"
                value={formData.metodoEnvio}
                onChange={handleChange}
              >
                <option value="">Seleccionar método de envío...</option>
                {shippingMethods.map((method) => {
                  const gratis = method.gratisDesde > 0 && totalPrice >= method.gratisDesde;
                  const costoLabel = gratis || method.costo === 0
                    ? "Gratis"
                    : `$${method.costo.toLocaleString("es-AR")}`;
                  return (
                    <option key={method.id} value={method.nombre}>
                      {method.icono} {method.nombre} — {costoLabel}
                    </option>
                  );
                })}
              </select>
              {errors.metodoEnvio && (
                <div className="text-danger mt-1">{errors.metodoEnvio}</div>
              )}
            </div>

            {/* PAGO */}
            <div className="col-md-6">
              <label className="form-label">Método de pago</label>
              <select
                className="form-select custom-input"
                name="metodoPago"
                value={formData.metodoPago}
                onChange={handleChange}
              >
                <option value="">Seleccionar método de pago...</option>
                {paymentMethods.map((method) => (
                  <option key={method.id} value={method.nombre}>
                    {method.icono} {method.nombre}
                  </option>
                ))}
              </select>
              {errors.metodoPago && (
                <div className="text-danger mt-1">{errors.metodoPago}</div>
              )}
            </div>

            {/* PROMOCIÓN */}
            <div className="col-12">
              <label className="form-label">Código de promoción</label>
              {appliedPromotion ? (
                <div className="d-flex align-items-center gap-2">
                  <span
                    className="badge rounded-pill px-3 py-2"
                    style={{ background: "#e8f5e9", color: "#2e7d32", fontSize: 13 }}
                  >
                    🎟 {appliedPromotion.codigo} aplicado (-${descuento})
                  </span>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={handleRemovePromotion}
                  >
                    Quitar
                  </button>
                </div>
              ) : (
                <div className="d-flex gap-2">
                  <input
                    type="text"
                    className="form-control custom-input"
                    placeholder="Ej: BIENVENIDA10"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-pink px-4"
                    onClick={handleApplyPromotion}
                    disabled={promoLoading}
                  >
                    {promoLoading ? "Aplicando..." : "Aplicar"}
                  </button>
                </div>
              )}
              {promoError && (
                <div className="text-danger mt-1">{promoError}</div>
              )}
            </div>

            {/* OBSERVACIONES */}
            <div className="col-12">
              <label className="form-label">Observaciones</label>
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
                <p>🚚 Envíos a todo el país</p>
<p>💖 Compra mínima: ${(settings?.compraMinima ?? 15000).toLocaleString("es-AR")}</p>
                <p>🎁 Envíos gratis desde ${(settings?.envioGratisDesde ?? 50000).toLocaleString("es-AR")}</p>
              </div>
            </div>

            {/* BOTÓN */}
            <div className="col-12 text-center mt-4">
              <button type="submit" className="btn btn-pink btn-lg px-5">
                Confirmar pedido ✨
              </button>
            </div>

          </form>
        </div>
      </div>
    </section>
  );
}
