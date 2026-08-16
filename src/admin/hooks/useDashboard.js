import { useState, useEffect, useCallback } from "react";
import { getAllProducts } from "../services/productService";
import { getCategories } from "../services/categoryService";
import { getOrders } from "../services/orderService";
import { getCustomers } from "../services/customerService";

/**
 * Hook personalizado que conecta el Dashboard con los datos reales.
 *
 * ════════════════════════════════════════════════════════════
 *  Expone:
 *    • metrics      → métricas calculadas (productos, categorías,
 *                     pedidos, clientes, ventas, envíos, etc.)
 *    • recentOrders → últimos 5 pedidos
 *    • statusBreakdown → desglose de pedidos por estado
 *    • topCategories → categorías ordenadas por cantidad de productos
 *    • loading      → booleano (true mientras carga)
 *    • error        → mensaje de error si ocurre
 *    • refresh      → función para recargar datos manualmente
 * ════════════════════════════════════════════════════════════
 */
export default function useDashboard() {
  const [metrics, setMetrics] = useState({
    productos: 0,
    categorias: 0,
    categoriasActivas: 0,
    pedidos: 0,
    clientes: 0,
    ventas: 0,
    envios: 0,
    stockBajo: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [statusBreakdown, setStatusBreakdown] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // ── Consultas en paralelo ─────────────────
      const [productos, categorias, pedidos, clientes] = await Promise.all([
        getAllProducts(),
        getCategories(),
        getOrders(),
        getCustomers(),
      ]);

      // ── Métricas base ─────────────────────────
      const totalVentas = pedidos
        .filter((o) => o.estado !== "Cancelado")
        .reduce((acc, o) => acc + (Number(o.total) || 0), 0);

      const envios = pedidos.filter((o) => o.estado === "Enviado").length;

      const stockBajo = productos.filter(
        (p) => Number(p.stock) <= 5
      ).length;

      setMetrics({
        productos: productos.length,
        categorias: categorias.length,
        categoriasActivas: categorias.filter(
          (c) => c.estado === "Activa"
        ).length,
        pedidos: pedidos.length,
        clientes: clientes.length,
        ventas: totalVentas,
        envios,
        stockBajo,
      });

      // ── Pedidos recientes (últimos 5) ─────────
      setRecentOrders(
        [...pedidos]
          .sort((a, b) => (b.id || 0) - (a.id || 0))
          .slice(0, 5)
      );

      // ── Desglose por estado ───────────────────
      const estados = [
        "Pendiente",
        "Preparando",
        "Enviado",
        "Entregado",
        "Cancelado",
      ];
      setStatusBreakdown(
        estados.map((estado) => ({
          estado,
          cantidad: pedidos.filter((o) => o.estado === estado).length,
        }))
      );

      // ── Top categorías por cantidad de productos ──
      const catCount = {};
      productos.forEach((p) => {
        const cat = p.category || "General";
        catCount[cat] = (catCount[cat] || 0) + 1;
      });
      setTopCategories(
        Object.entries(catCount)
          .map(([name, cantidad]) => ({ name, cantidad }))
          .sort((a, b) => b.cantidad - a.cantidad)
          .slice(0, 5)
      );
    } catch (err) {
      setError(err?.message || "Error al cargar los datos del dashboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    metrics,
    recentOrders,
    statusBreakdown,
    topCategories,
    loading,
    error,
    refresh,
  };
}
