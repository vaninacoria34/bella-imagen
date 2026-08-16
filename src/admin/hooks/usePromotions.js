import { useState, useEffect, useCallback } from "react";
import {
  getPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
  togglePromotionStatus,
} from "../services/promotionService";

/**
 * Hook personalizado que abstrae el acceso a promociones.
 *
 * ════════════════════════════════════════════════════════
 *  Expone:
 *    • promotions      → array de promociones
 *    • loading         → booleano (true mientras carga)
 *    • error           → mensaje de error si ocurre
 *    • refresh         → función para recargar datos manualmente
 *    • addPromotion    → fn(data) — crea una promoción
 *    • editPromotion   → fn(id, data) — actualiza una promoción
 *    • removePromotion → fn(id) — elimina una promoción
 *    • toggleStatus    → fn(id) — activa/desactiva una promoción
 * ════════════════════════════════════════════════════════
 */
export default function usePromotions() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPromotions();
      setPromotions(data);
    } catch (err) {
      setError(err?.message || "Error al cargar promociones.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addPromotion = async (promotionData) => {
    await createPromotion(promotionData);
    await refresh();
  };

  const editPromotion = async (id, promotionData) => {
    await updatePromotion(id, promotionData);
    await refresh();
  };

  const removePromotion = async (id) => {
    await deletePromotion(id);
    await refresh();
  };

  const toggleStatus = async (id) => {
    await togglePromotionStatus(id);
    await refresh();
  };

  return {
    promotions,
    loading,
    error,
    refresh,
    addPromotion,
    editPromotion,
    removePromotion,
    toggleStatus,
  };
}
