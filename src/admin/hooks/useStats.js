import { useState, useEffect, useCallback } from "react";
import { getOrders } from "../services/orderService";
import { getAllProducts } from "../services/productService";
import { getCustomers } from "../services/customerService";
import { getPaymentMethods } from "../services/paymentMethodService";
import { getShippingMethods } from "../services/shippingService";

/**
 * Hook personalizado que calcula las estadísticas del panel.
 *
 * ════════════════════════════════════════════════════════
 *  Expone:
 *    • summary       → KPIs generales (ventas, pedidos, ticket
 *                      promedio, clientes, envíos, productos)
 *    • byStatus      → ventas y cantidad por estado de pedido
 *    • byPayment     → ventas por método de pago
 *    • byShipping    → ventas por método de envío
 *    • topProducts   → productos más vendidos por cantidad
 *    • byMonth       → pedidos y ventas por mes
 *    • loading       → booleano (true mientras carga)
 *    • error         → mensaje de error si ocurre
 *    • refresh       → función para recargar datos manualmente
 * ════════════════════════════════════════════════════════
 */
export default function useStats() {
  const [summary, setSummary] = useState({
    ventas: 0,
    pedidos: 0,
    ticketPromedio: 0,
    clientes: 0,
    envios: 0,
    productos: 0,
    cancelados: 0,
  });
  const [byStatus, setByStatus] = useState([]);
  const [byPayment, setByPayment] = useState([]);
  const [byShipping, setByShipping] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [byMonth, setByMonth] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // ── Consultas en paralelo ─────────────────
      const [pedidos, productos, clientes, metodosPago, metodosEnvio] =
        await Promise.all([
          getOrders(),
          getAllProducts(),
          getCustomers(),
          getPaymentMethods(),
          getShippingMethods(),
        ]);

      // ── KPIs generales ────────────────────────
      const activos = pedidos.filter((o) => o.estado !== "Cancelado");
      const totalVentas = activos.reduce(
        (acc, o) => acc + (Number(o.total) || 0),
        0
      );
      const ticketPromedio =
        activos.length > 0 ? Math.round(totalVentas / activos.length) : 0;

      setSummary({
        ventas: totalVentas,
        pedidos: pedidos.length,
        ticketPromedio,
        clientes: clientes.length,
        envios: pedidos.filter((o) => o.estado === "Enviado").length,
        productos: productos.length,
        cancelados: pedidos.filter((o) => o.estado === "Cancelado").length,
      });

      // ── Ventas y cantidad por estado ──────────
      const estados = [
        "Pendiente",
        "Preparando",
        "Enviado",
        "Entregado",
        "Cancelado",
      ];
      setByStatus(
        estados.map((estado) => {
          const items = pedidos.filter((o) => o.estado === estado);
          return {
            estado,
            cantidad: items.length,
            ventas: items.reduce(
              (acc, o) => acc + (Number(o.total) || 0),
              0
            ),
          };
        })
      );

      // ── Ventas por método de pago ─────────────
      const nombresPago = metodosPago.map((m) => m.nombre);
      const pagoCount = {};
      pedidos.forEach((o) => {
        const key = o.metodoPago || "Sin especificar";
        pagoCount[key] = (pagoCount[key] || 0) + (Number(o.total) || 0);
      });
      // Orden: primero los métodos configurados, después los otros
      const pagoKeys = [
        ...nombresPago.filter((n) => pagoCount[n] != null),
        ...Object.keys(pagoCount).filter((k) => !nombresPago.includes(k)),
      ];
      setByPayment(
        pagoKeys.map((key) => ({
          metodo: key,
          ventas: pagoCount[key],
        }))
      );

      // ── Ventas por método de envío ────────────
      const nombresEnvio = metodosEnvio.map((m) => m.nombre);
      const envioCount = {};
      pedidos.forEach((o) => {
        const key = o.metodoEnvio || "Sin especificar";
        envioCount[key] = (envioCount[key] || 0) + (Number(o.total) || 0);
      });
      const envioKeys = [
        ...nombresEnvio.filter((n) => envioCount[n] != null),
        ...Object.keys(envioCount).filter((k) => !nombresEnvio.includes(k)),
      ];
      setByShipping(
        envioKeys.map((key) => ({
          metodo: key,
          ventas: envioCount[key],
        }))
      );

      // ── Top productos más vendidos ────────────
      const prodCount = {};
      pedidos.forEach((o) => {
        (o.productos || []).forEach((p) => {
          const key = p.nombre || "Producto";
          prodCount[key] = prodCount[key] || { cantidad: 0, ventas: 0 };
          prodCount[key].cantidad += Number(p.cantidad) || 0;
          prodCount[key].ventas +=
            (Number(p.cantidad) || 0) * (Number(p.precio) || 0);
        });
      });
      setTopProducts(
        Object.entries(prodCount)
          .map(([nombre, data]) => ({ nombre, ...data }))
          .sort((a, b) => b.cantidad - a.cantidad)
          .slice(0, 8)
      );

      // ── Pedidos y ventas por mes ──────────────
      const monthCount = {};
      pedidos.forEach((o) => {
        // fecha en formato DD/MM/YYYY
        const [dd, mm, yyyy] = String(o.fecha || "").split("/");
        if (!dd || !mm || !yyyy) return;
        const monthKey = `${yyyy}-${mm}`;
        monthCount[monthKey] = monthCount[monthKey] || {
          label: `${mm}/${yyyy}`,
          pedidos: 0,
          ventas: 0,
        };
        monthCount[monthKey].pedidos += 1;
        if (o.estado !== "Cancelado") {
          monthCount[monthKey].ventas += Number(o.total) || 0;
        }
      });
      const monthKeys = Object.keys(monthCount).sort();
      setByMonth(monthKeys.map((key) => monthCount[key]));
    } catch (err) {
      setError(err?.message || "Error al cargar las estadísticas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    summary,
    byStatus,
    byPayment,
    byShipping,
    topProducts,
    byMonth,
    loading,
    error,
    refresh,
  };
}

