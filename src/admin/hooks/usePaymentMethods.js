import { useState, useEffect } from "react";
import {
  getPaymentMethods,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
  togglePaymentMethodStatus,
} from "../services/paymentMethodService";

/**
 * Hook personalizado que abstrae el acceso a métodos de pago.
 *
 * ════════════════════════════════════════════════════════
 *  Expone:
 *    • paymentMethods → array de métodos de pago
 *    • loading        → booleano (true mientras carga)
 *    • error          → mensaje de error si ocurre
 *    • refresh        → función para recargar datos manualmente
 *    • addMethod      → fn(data) — crea un método de pago
 *    • editMethod     → fn(id, data) — actualiza un método de pago
 *    • removeMethod   → fn(id) — elimina un método de pago
 *    • toggleStatus   → fn(id) — activa/desactiva un método de pago
 * ════════════════════════════════════════════════════════
 *
 *  🔮 Cuando se implemente Firebase, las funciones del
 *     servicio se conectarán a Firestore y este hook
 *     funcionará sin cambios.
 */
export default function usePaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPaymentMethods();
      setPaymentMethods(data);
    } catch (err) {
      setError(err?.message || "Error al cargar métodos de pago.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const addMethod = async (methodData) => {
    await createPaymentMethod(methodData);
    await refresh();
  };

  const editMethod = async (id, methodData) => {
    await updatePaymentMethod(id, methodData);
    await refresh();
  };

  const removeMethod = async (id) => {
    await deletePaymentMethod(id);
    await refresh();
  };

  const toggleStatus = async (id) => {
    await togglePaymentMethodStatus(id);
    await refresh();
  };

  return {
    paymentMethods,
    loading,
    error,
    refresh,
    addMethod,
    editMethod,
    removeMethod,
    toggleStatus,
  };
}

