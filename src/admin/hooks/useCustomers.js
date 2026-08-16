import { useState, useEffect } from "react";
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  toggleCustomerStatus,
} from "../services/customerService";

/**
 * Hook personalizado que abstrae el acceso a clientes.
 *
 * ════════════════════════════════════════════════════════
 *  Expone:
 *    • customers     → array de clientes
 *    • loading       → booleano (true mientras carga)
 *    • error         → mensaje de error si ocurre
 *    • refresh       → función para recargar datos manualmente
 *    • addCustomer   → fn(data) — crea un cliente
 *    • editCustomer  → fn(id, data) — actualiza un cliente
 *    • removeCustomer → fn(id) — elimina un cliente
 * ════════════════════════════════════════════════════════
 */
export default function useCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCustomers();
      setCustomers(data);
    } catch (err) {
      setError(err?.message || "Error al cargar clientes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const addCustomer = async (customerData) => {
    await createCustomer(customerData);
    await refresh();
  };

  const editCustomer = async (id, customerData) => {
    await updateCustomer(id, customerData);
    await refresh();
  };

  const removeCustomer = async (id) => {
    await deleteCustomer(id);
    await refresh();
  };

  const toggleStatus = async (id) => {
    await toggleCustomerStatus(id);
    await refresh();
  };

  return {
    customers,
    loading,
    error,
    refresh,
    addCustomer,
    editCustomer,
    removeCustomer,
    toggleStatus,
  };
}

