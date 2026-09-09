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

  const refresh = useCallback(() => {
    // En lugar de hacer una consulta única, reactivar la suscripción en tiempo real
    setLoading(true);
    setError(null);
    const unsubscribe = subscribeProducts(
      (data) => {
        setProducts(data);
        setLoading(false);
        setError(null);
        console.log("✅ Productos refrescados desde Firestore:", data.length, "items");
      },
      (err) => {
        setError(err?.message || "Error al recargar productos.");
        setLoading(false);
        console.error("❌ Error en refresh de productos:", err);
      }
    );
    // Automaticamente se desuscribe si se llama refresh nuevamente
    return unsubscribe;
  }, []);

  useEffect(() => {
    console.log("🔄 Iniciando suscripción en tiempo real a productos (Firestore)...");
    setLoading(true);
    
    const unsubscribe = subscribeProducts(
      (data) => {
        console.log("✅ Actualización en tiempo real recibida:", data.length, "productos");
        setProducts(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("❌ Error en suscripción a productos:", err?.message || err);
        setError(err?.message || "Error al escuchar productos.");
        setLoading(false);
      }
    );

    // Retorna la función para desuscribirse cuando el componente se desmonte
    return () => {
      console.log("🛑 Desuscribiendo de productos (componente desmontado)");
      unsubscribe();
    };
  }, []);

  /**
   * Crea un nuevo producto en Firestore.
   * Retorna la promesa completamente resuelta.
   */
  const addProduct = async (productData) => {
    try {
      return await createProduct(productData);
    } catch (error) {
      console.error("Error en addProduct:", error);
      throw error;
    }
  };

  /**
   * Actualiza un producto existente en Firestore.
   * Retorna la promesa completamente resuelta.
   */
  const editProduct = async (id, productData) => {
    try {
      return await updateProduct(id, productData);
    } catch (error) {
      console.error("Error en editProduct:", error);
      throw error;
    }
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

