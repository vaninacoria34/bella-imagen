import { useState, useEffect } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/categoryService";

/**
 * Hook personalizado que abstrae el acceso a categorías.
 *
 * ════════════════════════════════════════════════════════
 *  Expone:
 *    • categories   → array de categorías
 *    • loading      → booleano (true mientras carga)
 *    • error        → mensaje de error si ocurre
 *    • refresh      → función para recargar datos manualmente
 *    • addCategory  → fn(data) — crea una categoría
 *    • editCategory → fn(id, data) — actualiza una categoría
 *    • removeCategory → fn(id) — elimina una categoría
 * ════════════════════════════════════════════════════════
 *
 *  🔮 Cuando se implemente Firebase, las funciones del
 *     servicio se conectarán a Firestore y este hook
 *     funcionará sin cambios.
 */
export default function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      setError(err?.message || "Error al cargar categorías.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  /**
   * Crea una nueva categoría.
   */
  const addCategory = async (categoryData) => {
    await createCategory(categoryData);
    await refresh();
  };

  /**
   * Actualiza una categoría existente.
   */
  const editCategory = async (id, categoryData) => {
    await updateCategory(id, categoryData);
    await refresh();
  };

  /**
   * Elimina una categoría.
   */
  const removeCategory = async (id) => {
    await deleteCategory(id);
    await refresh();
  };

  return {
    categories,
    loading,
    error,
    refresh,
    addCategory,
    editCategory,
    removeCategory,
  };
}
