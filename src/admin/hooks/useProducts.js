import { useState, useEffect, useCallback } from "react";
import {
  getAllProducts,
  subscribeProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService";

/**
 * Hook personalizado que abstrae el acceso a productos.
 *
 * ════════════════════════════════════════════════════════
 *  Expone:
 *    • products  → array de productos normalizados
 *    • loading   → booleano (true mientras carga)
 *    • error     → mensaje de error si ocurre
 *    • refresh   → función para recargar datos manualmente
 *    • addProduct    → 🚧 placeholder (lanzará error)
 *    • editProduct   → 🚧 placeholder (lanzará error)
 *    • removeProduct → 🚧 placeholder (lanzará error)
 * ════════════════════════════════════════════════════════
 *
 *  Las mutaciones se reflejan en products mediante onSnapshot.
 */
export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllProducts();
      setProducts(data);
    } catch (err) {
      setError(err?.message || "Error al cargar productos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeProducts(
      (data) => {
        setProducts(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err?.message || "Error al escuchar productos.");
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  /**
  * Crea un nuevo producto en Firestore.
   */
  const addProduct = async (productData) => {
    await createProduct(productData);
  };

  /**
  * Actualiza un producto existente en Firestore.
   */
  const editProduct = async (id, productData) => {
    await updateProduct(id, productData);
  };

  /**
  * Elimina un producto de Firestore.
   */
  const removeProduct = async (id) => {
    await deleteProduct(id);
  };

  return {
    products,
    loading,
    error,
    refresh,
    addProduct,
    editProduct,
    removeProduct,
  };
}

