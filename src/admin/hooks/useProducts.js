import { useState, useEffect } from "react";
import {
  subscribeProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService";

// Una suscripción por montaje; onSnapshot actualiza las mutaciones.
export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    addProduct,
    editProduct,
    removeProduct,
  };
}

