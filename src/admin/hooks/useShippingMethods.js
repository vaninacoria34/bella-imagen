import { useState, useEffect } from "react";
import {
  getShippingMethods,
  createShippingMethod,
  updateShippingMethod,
  deleteShippingMethod,
  toggleShippingMethodStatus,
} from "../services/shippingService";

/**
 * Hook personalizado que abstrae el acceso a métodos de envío.
 *
 * ════════════════════════════════════════════════════════
 *  Expone:
 *    • shippingMethods → array de métodos de envío
 *    • loading         → booleano (true mientras carga)
 *    • error           → mensaje de error si ocurre
 *    • refresh         → función para recargar datos manualmente
 *    • addMethod       → fn(data) — crea un método de envío
 *    • editMethod      → fn(id, data) — actualiza un método de envío
 *    • removeMethod    → fn(id) — elimina un método de envío
 *    • toggleStatus    → fn(id) — activa/desactiva un método de envío
 * ════════════════════════════════════════════════════════
 *
 *  🔮 Cuando se implemente Firebase, las funciones del
 *     servicio se conectarán a Firestore y este hook
 *     funcionará sin cambios.
 */
export default function useShippingMethods() {
  const [shippingMethods, setShippingMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getShippingMethods();
      setShippingMethods(data);
    } catch (err) {
      setError(err?.message || "Error al cargar métodos de envío.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const addMethod = async (methodData) => {
    await createShippingMethod(methodData);
    await refresh();
  };

  const editMethod = async (id, methodData) => {
    await updateShippingMethod(id, methodData);
    await refresh();
  };

  const removeMethod = async (id) => {
    await deleteShippingMethod(id);
    await refresh();
  };

  const toggleStatus = async (id) => {
    await toggleShippingMethodStatus(id);
    await refresh();
  };

  return {
    shippingMethods,
    loading,
    error,
    refresh,
    addMethod,
    editMethod,
    removeMethod,
    toggleStatus,
  };
}
