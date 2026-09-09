/**
 * ═══════════════════════════════════════════════════════════
 *  FIREBASE REPOSITORY - REPOSITORIO GENÉRICO POR DOMINIO
 * ═══════════════════════════════════════════════════════════
 *
 *  Mapea cada dominio de la app (productos, categorías, clientes,
 *  pedidos, etc.) a una colección de Firestore.
 *
 *  IMPORTANTE:
 *  ────────────
 *  Este archivo NO se activa por sí solo. Solo se activa cuando
 *  Firebase está configurado (credenciales en `.env`).
 *
 *  Mientras tanto, devuelve `null` / arroja un mensaje informativo,
 *  y la app sigue funcionando 100% con datos en memoria.
 *
 *  Las funciones están preparadas para ser usadas por los servicios
 *  de dominio cuando quieras conectar Firebase, manteniendo la MÍSMA
 *  interfaz pública.
 */
import {
  getCollectionData,
  getDocument,
  addDocument,
  setDocument,
  updateDocument,
  deleteDocument,
  subscribeToCollection,
  useFirestore,
} from "./firebaseService.js";

/**
 * Nombre de colección para cada dominio.
 * ─────────────────────────────────────
 * Cuando crees el proyecto en Firebase, asegurate de crear estas
 * colecciones con estos nombres exactos.
 */
export const COLLECTIONS = {
  products: "productos",
  categories: "categorias",
  customers: "clientes",
  orders: "pedidos",
  promociones: "promociones",
  shipping: "metodosEnvio",
  payment: "metodosPago",
  settings: "configuracion",
  messages: "mensajes",
};

/**
 * Verifica si Firebase está activo. Si no, lanza un error claro
 * para que los servicios que intenten usarlo sin credenciales
 * sepan qué está pasando.
 */
function guardFirebase(operationName) {
  if (!useFirestore) {
    throw new Error(
      `[Firebase inactivo] La operación "${operationName}" requiere credenciales en el archivo .env. La app está funcionando con datos en memoria.`
    );
  }
}

/**
 * Repositorio genérico.
 * ─────────────────────
 * Uso: `firebaseRepository.products.getAll()`
 *      `firebaseRepository.products.getById(1)`
 *      `firebaseRepository.products.create(data)`
 *      `firebaseRepository.products.update(id, data)`
 *      `firebaseRepository.products.remove(id)`
 *
 * Si Firebase no está configurado, `getAll/getById` devuelven `null`
 * para que los servicios locales los ignoren y sigan con memoria.
 */
function makeRepository(collectionName) {
  return {
    /** Devuelve todos los documentos (o null si Firebase inactivo). */
    async getAll(opts) {
      if (!useFirestore) return null;
      return getCollectionData(collectionName, opts);
    },

    /** Devuelve un documento por id (o null si Firebase inactivo). */
    async getById(id) {
      if (!useFirestore) return null;
      return getDocument(collectionName, id);
    },

    /** Crea un documento. */
    async create(data) {
      guardFirebase(`create(${collectionName})`);
      try {
        return await addDocument(collectionName, data);
      } catch (error) {
        console.error(`Error al crear documento en '${collectionName}':`, error);
        throw error;
      }
    },

    async set(id, data) {
      guardFirebase(`set(${collectionName})`);
      return setDocument(collectionName, id, data);
    },

    /** Actualiza un documento. */
    async update(id, data) {
      guardFirebase(`update(${collectionName})`);
      try {
        return await updateDocument(collectionName, id, data);
      } catch (error) {
        console.error(`Error al actualizar documento en '${collectionName}':`, error);
        throw error;
      }
    },

    /** Elimina un documento. */
    async remove(id) {
      guardFirebase(`remove(${collectionName})`);
      return deleteDocument(collectionName, id);
    },

    /** Suscribe a cambios en tiempo real. */
    subscribe(callback, onError, opts) {
      if (!useFirestore) {
        console.log(`[Offline] Colección '${collectionName}' no disponible en modo offline.`);
        return () => {};
      }
      console.log(`🔴 [Real-time] Iniciando listener de cambios en '${collectionName}'...`);
      return subscribeToCollection(collectionName, callback, onError, opts);
    },
  };
}

/**
 * Repositorios listos para usar.
 */
export const firebaseRepository = {
  products: makeRepository(COLLECTIONS.products),
  categories: makeRepository(COLLECTIONS.categories),
  customers: makeRepository(COLLECTIONS.customers),
  orders: makeRepository(COLLECTIONS.orders),
  promociones: makeRepository(COLLECTIONS.promociones),
  shipping: makeRepository(COLLECTIONS.shipping),
  payment: makeRepository(COLLECTIONS.payment),
  settings: makeRepository(COLLECTIONS.settings),
  messages: makeRepository(COLLECTIONS.messages),
};

export default firebaseRepository;

