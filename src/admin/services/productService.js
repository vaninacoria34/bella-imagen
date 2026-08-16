/**
 * Servicio de productos.
 *
 * ════════════════════════════════════════════════════════
 *  CAPA DE ABSTRACCIÓN PARA EL ORIGEN DE DATOS
 * ════════════════════════════════════════════════════════
 *
 *  En esta etapa los datos provienen del archivo local
 *  src/data/products.js (el mismo que usa la tienda pública).
 *
 *  ╔══════════════════════════════════════════════════════╗
 *  ║  🔮 CUANDO LLEGUE FIRESTORE:                        ║
 *  ║  Solo hay que reemplazar la implementación interna  ║
 *  ║  de cada función. La interfaz pública NO cambia.    ║
 *  ║  Ningún otro archivo del panel requiere ajustes.    ║
 *  ╚══════════════════════════════════════════════════════╝
 */

import rawProducts from "../../data/products";
import { firebaseRepository } from "./firebaseRepository.js";
import { useFirestore } from "./firebaseService.js";

/**
 * ═══════════════════════════════════════════════════════════════
 *  ALMACENAMIENTO EN MEMORIA (productos creados desde el panel)
 * ═══════════════════════════════════════════════════════════════
 *
 *  Cuando llegue Firebase:
 *    1. Eliminar este array local
 *    2. createProduct() usará addDoc(collection('productos'), data)
 *    3. getAllProducts() usará getDocs(collection('productos'))
 *
 *  Ningún otro archivo del panel requiere cambios.
 */

/**
 * Normaliza un producto del catálogo base (que no trae stock/estado)
 * al formato que usa el panel de administración.
 */
function normalizeProduct(product) {
  return {
    id: product.id,
    title: product.title,
    category: product.category,
    price: product.price,
    image: product.image,
    description: product.description || "",
    availability: product.availability || "Disponible",
    stock: product.stock ?? 10,
    estado: "Activo",
  };
}

/** Array mutable donde se acumulan los productos creados/actualizados desde el panel. */
const createdProducts = [];

/** Último ID (empieza después del catálogo base). */
let nextId = rawProducts.length + 1;

/**
 * Devuelve el catálogo completo: base (solo lectura, con overlays) + creados desde el panel.
 * ───────────────────────────────────────────────────────────────────────────────────────
 * 🔁 Firebase: reemplazar por getAllDocs('productos')
 *
 *  Los overlays (productos base editados) tienen prioridad sobre los originales:
 *  se filtran los IDs base que ya están en createdProducts.
 */
export async function getAllProducts() {
  if (useFirestore) {
    try {
      const fbProducts = await firebaseRepository.products.getAll();
      if (fbProducts && fbProducts.length > 0) {
        return fbProducts.map(normalizeProduct);
      }
    } catch (e) {
      console.warn("Firestore inactivo o sin datos, usando catálogo local:", e.message);
    }
  }

  const deletedIds = new Set(
    createdProducts.filter((p) => p._isDeleted).map((p) => p.id)
  );
  const overlaysIds = new Set(
    createdProducts.filter((p) => p._isOverlay).map((p) => p.id)
  );
  const base = rawProducts
    .filter((p) => !overlaysIds.has(p.id) && !deletedIds.has(p.id))
    .map(normalizeProduct);
  return [...base, ...createdProducts.filter((p) => !p._isDeleted)];
}

/**
 * Retorna un producto por su ID.
 * ──────────────────────────────────
 * 🔁 Firebase: reemplazar por getDoc(doc('productos', id))
 */
export async function getProductById(id) {
  const numId = Number(id);

  // Buscar en catálogo base
  const raw = rawProducts.find((p) => p.id === numId);
  if (raw) return normalizeProduct(raw);

  // Buscar en creados desde el panel
  const created = createdProducts.find((p) => p.id === numId);
  return created || null;
}

/**
 * Crea un nuevo producto en memoria.
 * ────────────────────────────────────
 * 🔁 Firebase: reemplazar por addDoc(collection('productos'), data)
 *
 *  Interfaz PÚBLICA (no cambia cuando llegue Firebase):
 *    createProduct({ title, category, price, image, description, stock, estado })
 *      → Promise<void>
 */
export async function createProduct(productData) {
  const newProduct = {
    title: productData.title,
    category: productData.category,
    price: productData.price,
    image: productData.image,
    description: productData.description || "",
    availability: "Disponible",
    stock: productData.stock ?? 0,
    estado: productData.estado || "Activo",
  };

  if (useFirestore) {
    try {
      const docId = await firebaseRepository.products.create(newProduct);
      newProduct.id = docId;
    } catch (e) {
      console.warn("Error guardando producto en Firestore:", e.message);
      newProduct.id = nextId++;
    }
  } else {
    newProduct.id = nextId++;
  }

  createdProducts.push(newProduct);
}

/**
 * Actualiza un producto existente.
 * ──────────────────────────────────
 * 🔁 Firebase: reemplazar por updateDoc(doc('productos', id), data)
 *
 *  Busca primero en el catálogo local (createdProducts) y luego en el base.
 *  Si está en el catálogo base, crea una sobreescritura temporal sin mutar
 *  el array original (rawProducts).
 */
export async function updateProduct(id, productData) {
  const numId = Number(id) || id;

  if (useFirestore) {
    try {
      await firebaseRepository.products.update(numId, productData);
    } catch (e) {
      console.warn("Error actualizando producto en Firestore:", e.message);
    }
  }

  // Buscar en productos creados desde el panel
  const createdIndex = createdProducts.findIndex((p) => p.id === numId);
  if (createdIndex !== -1) {
    createdProducts[createdIndex] = {
      ...createdProducts[createdIndex],
      title: productData.title,
      category: productData.category,
      price: productData.price,
      image: productData.image,
      description: productData.description || "",
      stock: productData.stock ?? 0,
      estado: productData.estado || "Activo",
    };
    return;
  }

  // Buscar en catálogo base — creamos un "overlay" en createdProducts
  // sin modificar rawProducts
  const raw = rawProducts.find((p) => p.id === numId);
  if (!raw) {
    throw new Error(`Producto con id ${id} no encontrado.`);
  }

  const updatedProduct = {
    id: numId,
    title: productData.title,
    category: productData.category,
    price: productData.price,
    image: productData.image,
    description: productData.description || "",
    availability: raw.availability || "Disponible",
    stock: productData.stock ?? 0,
    estado: productData.estado || "Activo",
  };

  // Reemplazar o agregar en createdProducts como "overlay"
  const overlayIndex = createdProducts.findIndex(
    (p) => p.id === numId && p._isOverlay
  );
  const overlay = { ...updatedProduct, _isOverlay: true };

  if (overlayIndex !== -1) {
    createdProducts[overlayIndex] = overlay;
  } else {
    createdProducts.push(overlay);
  }
}

/**
 * Elimina un producto.
 * ──────────────────────
 * 🔁 Firebase: reemplazar por deleteDoc(doc('productos', id))
 *
 *  Busca primero en createdProducts (creados desde el panel).
 *  Si está en el catálogo base, agrega un overlay con flag _isDeleted
 *  para filtrarlo en getAllProducts(). No muta rawProducts.
 */
export async function deleteProduct(id) {
  const numId = Number(id) || id;

  if (useFirestore) {
    try {
      await firebaseRepository.products.remove(numId);
    } catch (e) {
      console.warn("Error eliminando producto en Firestore:", e.message);
    }
  }

  // Buscar en productos creados desde el panel
  const createdIndex = createdProducts.findIndex(
    (p) => p.id === numId && !p._isOverlay
  );
  if (createdIndex !== -1) {
    createdProducts.splice(createdIndex, 1);
    return;
  }

  // Buscar overlay (producto base editado) — lo eliminamos si existe
  const overlayIndex = createdProducts.findIndex(
    (p) => p.id === numId && p._isOverlay
  );
  if (overlayIndex !== -1) {
    createdProducts.splice(overlayIndex, 1);
    // También hay que evitar que el producto base se muestre
  }

  // Verificar que el producto existe en el catálogo base
  const raw = rawProducts.find((p) => p.id === numId);
  if (!raw) {
    throw new Error(`Producto con id ${id} no encontrado.`);
  }

  // Agregar un marcador de eliminado en createdProducts
  // para que getAllProducts() lo filtre
  createdProducts.push({
    id: numId,
    _isDeleted: true,
  });
}

