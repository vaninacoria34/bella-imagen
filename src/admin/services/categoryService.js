/**
 * Servicio de categorías.
 *
 * ════════════════════════════════════════════════════════
 *  CAPA DE ABSTRACCIÓN PARA EL ORIGEN DE DATOS
 * ════════════════════════════════════════════════════════
 *
 *  En esta etapa los datos provienen de un array en memoria.
 *
 *  ╔══════════════════════════════════════════════════════╗
 *  ║  🔮 CUANDO LLEGUE FIRESTORE:                        ║
 *  ║  Solo hay que reemplazar la implementación interna  ║
 *  ║  de cada función. La interfaz pública NO cambia.    ║
 *  ║  Ningún otro archivo del panel requiere ajustes.    ║
 *  ╚══════════════════════════════════════════════════════╝
 */

import { firebaseRepository } from "./firebaseRepository.js";
import { useFirestore } from "./firebaseService.js";

/** IDs autoincrementales para nuevas categorías. */
let nextId = 1;

/** Array mutable con las categorías (semilla + creadas desde el panel). */
let categories = [
  { id: nextId++, name: "Perfumes", description: "Fragancias y perfumes para ella y para él.", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=200&q=80", estado: "Activa", orden: 1 },
  { id: nextId++, name: "Maquillaje", description: "Todo para un look perfecto: labiales, bases, sombras y más.", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=200&q=80", estado: "Activa", orden: 2 },
  { id: nextId++, name: "Skincare", description: "Cuidado facial: cremas, sérums, protectores solares.", image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=200&q=80", estado: "Activa", orden: 3 },
  { id: nextId++, name: "Marroquinería", description: "Carteras, billeteras, cinturones y accesorios de cuero.", image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=200&q=80", estado: "Activa", orden: 4 },
  { id: nextId++, name: "Bisutería", description: "Collares, aros, pulseras y anillos con estilo.", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&q=80", estado: "Activa", orden: 5 },
  { id: nextId++, name: "Carteras", description: "Carteras elegantes para cualquier ocasión.", image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=200&q=80", estado: "Activa", orden: 6 },
  { id: nextId++, name: "Bolsos", description: "Bolsos amplios y cómodos para el día a día.", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&q=80", estado: "Activa", orden: 7 },
  { id: nextId++, name: "Accesorios", description: "Lentes, pañuelos, scrunchies y más.", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&q=80", estado: "Activa", orden: 8 },
];

/**
 * Devuelve todas las categorías.
 * ─────────────────────────────────
 * 🔁 Firebase: reemplazar por getDocs(collection('categorias'))
 */
export async function getCategories() {
  if (useFirestore) {
    try {
      const fbCategories = await firebaseRepository.categories.getAll();
      if (fbCategories && fbCategories.length > 0) {
        return fbCategories;
      }
    } catch (e) {
      console.warn("Firestore categorías fallback local:", e.message);
    }
  }
  return [...categories];
}

/**
 * Retorna una categoría por su ID.
 * ─────────────────────────────────
 * 🔁 Firebase: reemplazar por getDoc(doc('categorias', id))
 */
export async function getCategoryById(id) {
  const numId = Number(id);
  return categories.find((c) => c.id === numId) || null;
}

/**
 * Crea una nueva categoría.
 * ───────────────────────────
 * 🔁 Firebase: reemplazar por addDoc(collection('categorias'), data)
 *
 *  Lanza error si ya existe una categoría con el mismo nombre
 *  (comparación insensible a mayúsculas/accentos).
 */
export async function createCategory(categoryData) {
  const name = categoryData.name.trim();

  // Validar nombre único (insensible a mayúsculas)
  const exists = categories.some(
    (c) => c.name.toLowerCase() === name.toLowerCase()
  );
  if (exists) {
    throw new Error(`Ya existe una categoría llamada "${name}".`);
  }

  const newCategory = {
    name,
    description: categoryData.description?.trim() || "",
    image: categoryData.image?.trim() || "",
    estado: categoryData.estado || "Activa",
    orden: categoryData.orden ?? categories.length + 1,
  };

  if (useFirestore) {
    try {
      const docId = await firebaseRepository.categories.create(newCategory);
      newCategory.id = docId;
    } catch (e) {
      console.warn("Error creando categoría en Firestore:", e.message);
      newCategory.id = nextId++;
    }
  } else {
    newCategory.id = nextId++;
  }

  categories.push(newCategory);
}

/**
 * Actualiza una categoría existente.
 * ────────────────────────────────────
 * 🔁 Firebase: reemplazar por updateDoc(doc('categorias', id), data)
 *
 *  Valida que el nombre no esté duplicado (excepto contra sí misma).
 */
export async function updateCategory(id, categoryData) {
  const numId = Number(id) || id;

  if (useFirestore) {
    try {
      await firebaseRepository.categories.update(numId, categoryData);
    } catch (e) {
      console.warn("Error actualizando categoría en Firestore:", e.message);
    }
  }
  const index = categories.findIndex((c) => c.id === numId);

  if (index === -1) {
    throw new Error(`Categoría con id ${id} no encontrada.`);
  }

  const name = categoryData.name.trim();

  // Validar nombre único (excluyendo la categoría actual)
  const duplicate = categories.some(
    (c) => c.id !== numId && c.name.toLowerCase() === name.toLowerCase()
  );
  if (duplicate) {
    throw new Error(`Ya existe otra categoría llamada "${name}".`);
  }

  categories[index] = {
    ...categories[index],
    name,
    description: categoryData.description?.trim() || "",
    image: categoryData.image?.trim() || "",
    estado: categoryData.estado || "Activa",
    orden: categoryData.orden ?? categories[index].orden,
  };
}

/**
 * Elimina una categoría.
 * ────────────────────────
 * 🔁 Firebase: reemplazar por deleteDoc(doc('categorias', id))
 */
export async function deleteCategory(id) {
  const numId = Number(id) || id;

  if (useFirestore) {
    try {
      await firebaseRepository.categories.remove(numId);
    } catch (e) {
      console.warn("Error eliminando categoría en Firestore:", e.message);
    }
  }
  const index = categories.findIndex((c) => c.id === numId);

  if (index === -1) {
    throw new Error(`Categoría con id ${id} no encontrada.`);
  }

  categories.splice(index, 1);
}

/**
 * Retorna solo los nombres de categorías activas.
 * ───────────────────────────────────────────────
 *  Útil para llenar el <select> de categorías en el formulario
 *  de productos (se implementará en la próxima etapa).
 *
 * 🔁 Firebase: reemplazar por consulta filtrada.
 */
export async function getActiveCategoryNames() {
  return categories
    .filter((c) => c.estado === "Activa")
    .map((c) => c.name);
}

/**
 * Retorna una categoría por su nombre (insensible a mayúsculas).
 * ───────────────────────────────────────────────────────────────
 *  Útil para validar si una categoría existe y obtener sus datos
 *  (por ejemplo, para saber si tiene productos asociados).
 *
 * 🔁 Firebase: reemplazar por consulta filtrada con where().
 */
export async function getCategoryByName(name) {
  return categories.find(
    (c) => c.name.toLowerCase() === name.trim().toLowerCase()
  ) || null;
}
