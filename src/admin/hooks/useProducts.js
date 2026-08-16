import { useState, useEffect } from "react";
import {
  getAllProducts,
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
 *  🔮 Cuando se implemente Firebase, las funciones del
 *     servicio se conectarán a Firestore y este hook
 *     funcionará sin cambios.
 */
export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = async () => {
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
  };

  useEffect(() => {
    refresh();
  }, []);

  /**
   * Crea un nuevo producto.
   * 🚧 Lanzará error hasta que se implemente Firestore.
   */
  const addProduct = async (productData) => {
    await createProduct(productData);
    await refresh();
  };

  /**
   * Actualiza un producto existente.
   * 🚧 Lanzará error hasta que se implemente Firestore.
   */
  const editProduct = async (id, productData) => {
    await updateProduct(id, productData);
    await refresh();
  };

  /**
   * Elimina un producto.
   * 🚧 Lanzará error hasta que se implemente Firestore.
   */
  const removeProduct = async (id) => {
    await deleteProduct(id);
    await refresh();
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

