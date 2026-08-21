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

const DEFAULT_PRODUCT_IMAGE =
  "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80";

const STORAGE_KEY = "bella_imagen_created_products";

/**
 * Normaliza un producto del catálogo base (que no trae stock/estado)
 * al formato que usa el panel de administración.
 */
function normalizeProduct(product) {
  return {
    id: product.id,
    title: product.title || "Producto sin nombre",
    category: product.category || "General",
    price: product.price || 0,
    image: product.image || DEFAULT_PRODUCT_IMAGE,
    description: product.description || "",
    availability: product.availability || "Disponible",
    stock: product.stock ?? 10,
    estado: product.estado || "Activo",
  };
}

function loadLocalCreatedProducts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Error cargando productos de localStorage:", e?.message);
  }
  return [];
}

function saveLocalCreatedProducts(products) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (e) {
    console.warn("Error guardando productos en localStorage:", e?.message);
  }
}

/** Array mutable donde se acumulan los productos creados/actualizados/eliminados desde el panel. */
let createdProducts = loadLocalCreatedProducts();

/** Función para calcular el próximo ID disponible */
function calculateNextId() {
  const maxCreatedId = createdProducts.reduce((max, p) => {
    const num = Number(p.id);
    return !Number.isNaN(num) && num > max ? num : max;
  }, rawProducts.length);
  return maxCreatedId + 1;
}

let nextId = calculateNextId();

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
    createdProducts.filter((p) => p._isDeleted).map((p) => String(p.id))
  );
  const overlaysIds = new Set(
    createdProducts.filter((p) => p._isOverlay).map((p) => String(p.id))
  );
  const base = rawProducts
    .filter((p) => !overlaysIds.has(String(p.id)) && !deletedIds.has(String(p.id)))
    .map(normalizeProduct);
  return [...base, ...createdProducts.filter((p) => !p._isDeleted)];
}

/**
 * Retorna un producto por su ID.
 * ──────────────────────────────────
 * 🔁 Firebase: reemplazar por getDoc(doc('productos', id))
 */
export async function getProductById(id) {
  const targetId = String(id);

  if (useFirestore) {
    try {
      const fbProduct = await firebaseRepository.products.getById(id);
      if (fbProduct) return normalizeProduct(fbProduct);
    } catch (e) {
      console.warn("Firestore inactivo o sin datos, buscando localmente:", e.message);
    }
  }

  const all = await getAllProducts();
  return all.find((p) => String(p.id) === targetId) || null;
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
  saveLocalCreatedProducts(createdProducts);
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
  const targetId = String(id);

  if (useFirestore) {
    try {
      await firebaseRepository.products.update(id, productData);
    } catch (e) {
      console.warn("Error actualizando producto en Firestore:", e.message);
    }
  }

  // Buscar en productos creados desde el panel
  const createdIndex = createdProducts.findIndex(
    (p) => String(p.id) === targetId && !p._isOverlay
  );
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
    saveLocalCreatedProducts(createdProducts);
    return;
  }

  // Buscar en catálogo base — creamos un "overlay" en createdProducts
  // sin modificar rawProducts
  const raw = rawProducts.find((p) => String(p.id) === targetId);
  const numId = Number(id) || id;

  const updatedProduct = {
    id: numId,
    title: productData.title,
    category: productData.category,
    price: productData.price,
    image: productData.image,
    description: productData.description || "",
    availability: raw?.availability || "Disponible",
    stock: productData.stock ?? 0,
    estado: productData.estado || "Activo",
  };

  // Reemplazar o agregar en createdProducts como "overlay"
  const overlayIndex = createdProducts.findIndex(
    (p) => String(p.id) === targetId && p._isOverlay
  );
  const overlay = { ...updatedProduct, _isOverlay: true };

  if (overlayIndex !== -1) {
    createdProducts[overlayIndex] = overlay;
  } else {
    createdProducts.push(overlay);
  }
  saveLocalCreatedProducts(createdProducts);
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
  const targetId = String(id);

  if (useFirestore) {
    try {
      await firebaseRepository.products.remove(id);
    } catch (e) {
      console.warn("Error eliminando producto en Firestore:", e.message);
    }
  }

  // Buscar en productos creados desde el panel que NO son overlay
  const createdIndex = createdProducts.findIndex(
    (p) => String(p.id) === targetId && !p._isOverlay
  );
  if (createdIndex !== -1) {
    createdProducts.splice(createdIndex, 1);
    saveLocalCreatedProducts(createdProducts);
    return;
  }

  // Buscar overlay (producto base editado) — lo eliminamos si existe
  const overlayIndex = createdProducts.findIndex(
    (p) => String(p.id) === targetId && p._isOverlay
  );
  if (overlayIndex !== -1) {
    createdProducts.splice(overlayIndex, 1);
  }

  // Agregar un marcador de eliminado en createdProducts para filtrarlo en getAllProducts()
  const existingDeletedIndex = createdProducts.findIndex(
    (p) => String(p.id) === targetId && p._isDeleted
  );
  if (existingDeletedIndex === -1) {
    createdProducts.push({
      id: Number(id) || id,
      _isDeleted: true,
    });
  }
  saveLocalCreatedProducts(createdProducts);
}

