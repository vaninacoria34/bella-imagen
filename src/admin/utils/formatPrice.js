/**
 * Formatea un número como precio en pesos argentinos.
 *
 * @param {number} price - Precio numérico (ej: 25000)
 * @returns {string} Precio formateado (ej: "$ 25.000")
 */
export default function formatPrice(price) {
  if (price == null || isNaN(price)) return "$ 0";

  return (
    "$ " +
    Number(price)
      .toLocaleString("es-AR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
      .replace(/,/g, ".")
  );
}

