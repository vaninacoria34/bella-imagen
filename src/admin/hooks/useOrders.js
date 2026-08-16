import { useState, useEffect } from "react";
import {
  getOrders,
  updateOrderStatus,
} from "../services/orderService";

/**
 * Hook personalizado que abstrae el acceso a pedidos.
 *
 * ════════════════════════════════════════════════════════
 *  Expone:
 *    • orders        → array de pedidos
 *    • loading       → booleano (true mientras carga)
 *    • error         → mensaje de error si ocurre
 *    • refresh       → función para recargar datos manualmente
 *    • changeStatus  → fn(id, newStatus) — actualiza estado del pedido
 * ════════════════════════════════════════════════════════
 *
 *  🔮 Cuando se implemente Firebase, las funciones del
 *     servicio se conectarán a Firestore y este hook
 *     funcionará sin cambios.
 */
export default function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      setError(err?.message || "Error al cargar pedidos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  /**
   * Cambia el estado de un pedido.
   */
  const changeStatus = async (id, newStatus) => {
    await updateOrderStatus(id, newStatus);
    await refresh();
  };

  return {
    orders,
    loading,
    error,
    refresh,
    changeStatus,
  };
}

