/**
 * ═══════════════════════════════════════════════════════════
 *  FIREBASE SERVICE - CAPA DE ABSTRACCIÓN GENÉRICA
 * ═══════════════════════════════════════════════════════════
 *
 *  Provee funciones genéricas para interactuar con Firestore
 *  cuando Firebase está configurado. Si no lo está, los servicios
 *  individuales usan su fallback en memoria.
 *
 *  NUNCA importar `firebase` directamente en los servicios de
 *  dominio. Usar SIEMPRE estas funciones.
 */
import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  onSnapshot,
} from "@firebase/firestore";
import { db, isFirebaseEnabled } from "../../firebase.js";

/** Indica si Firebase está activo (para condicionar en los servicios). */
export const useFirestore = isFirebaseEnabled;

/**
 * Obtiene todos los documentos de una colección (opcionalmente filtrados/ordenados).
 * @param {string} collectionName
 * @param {object} [opts] - { orderByField, orderDir, whereField, whereOp, whereValue }
 */
export async function getCollectionData(collectionName, opts = {}) {
  if (!useFirestore) return null;

  try {
    const colRef = collection(db, collectionName);

    let q = colRef;
    if (opts.whereField && opts.whereValue !== undefined) {
      q = query(
        colRef,
        where(opts.whereField, opts.whereOp || "==", opts.whereValue)
      );
    }
    if (opts.orderByField) {
      q = query(q, orderBy(opts.orderByField, opts.orderDir || "asc"));
    }

    const snapshot = await getDocs(q);
    if (snapshot.empty) return [];
    return snapshot.docs.map((docSnap) => ({
      id: Number(docSnap.id) || docSnap.id,
      ...docSnap.data(),
    }));
  } catch (error) {
    console.warn(
      `[Firebase] Error o permisos al acceder a '${collectionName}':`,
      error.message
    );
    return null;
  }
}

/**
 * Obtiene un documento por ID.
 */
export async function getDocument(collectionName, id) {
  if (!useFirestore) return null;
  try {
    const docRef = doc(db, collectionName, String(id));
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return { id: Number(snap.id) || snap.id, ...snap.data() };
  } catch (error) {
    console.warn(
      `[Firebase] Error al obtener documento de '${collectionName}':`,
      error.message
    );
    return null;
  }
}

/**
 * Crea un documento. Devuelve el id asignado.
 */
export async function addDocument(collectionName, data) {
  if (!useFirestore) return null;
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    return Number(docRef.id) || docRef.id;
  } catch (error) {
    console.warn(
      `[Firebase] Error al agregar documento a '${collectionName}':`,
      error.message
    );
    throw error;
  }
}

export async function setDocument(collectionName, id, data) {
  if (!useFirestore) return null;
  try {
    await setDoc(doc(db, collectionName, String(id)), data);
    return true;
  } catch (error) {
    console.warn(
      `[Firebase] Error al guardar documento en '${collectionName}':`,
      error.message
    );
    throw error;
  }
}

/**
 * Actualiza un documento por ID.
 */
export async function updateDocument(collectionName, id, data) {
  if (!useFirestore) return null;
  try {
    await updateDoc(doc(db, collectionName, String(id)), data);
    return true;
  } catch (error) {
    console.warn(
      `[Firebase] Error al actualizar documento en '${collectionName}':`,
      error.message
    );
    throw error;
  }
}

/**
 * Elimina un documento por ID.
 */
export async function deleteDocument(collectionName, id) {
  if (!useFirestore) return null;
  try {
    await deleteDoc(doc(db, collectionName, String(id)));
    return true;
  } catch (error) {
    console.warn(
      `[Firebase] Error al eliminar documento de '${collectionName}':`,
      error.message
    );
    throw error;
  }
}

/**
 * Suscribe a los cambios en tiempo real de una colección en Firestore.
 * Devuelve la función unsubscribe.
 */
export function subscribeToCollection(
  collectionName,
  callback,
  onError,
  opts = {}
) {
  if (!useFirestore) return () => {};

  try {
    const colRef = collection(db, collectionName);
    let q = colRef;
    if (opts.whereField && opts.whereValue !== undefined) {
      q = query(
        colRef,
        where(opts.whereField, opts.whereOp || "==", opts.whereValue)
      );
    }
    if (opts.orderByField) {
      q = query(q, orderBy(opts.orderByField, opts.orderDir || "asc"));
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((docSnap) => ({
          id: Number(docSnap.id) || docSnap.id,
          ...docSnap.data(),
        }));
        callback(data);
      },
      (error) => {
        console.warn(`[Firebase] Error en suscripción a '${collectionName}':`, error.message);
        onError?.(error);
      }
    );
    return unsubscribe;
  } catch (error) {
    console.warn(`[Firebase] Error iniciando suscripción a '${collectionName}':`, error.message);
    return () => {};
  }
}

/**
 * Obtiene el siguiente ID numérico (para preservar ids secuenciales).
 * En Firestore los ids son strings; si querés secuenciales usá un contador.
 */
export async function getNextId(collectionName) {
  if (!useFirestore) return null;
  try {
    const colRef = collection(db, collectionName);
    const snapshot = await getDocs(colRef);
    const maxId = snapshot.docs.reduce((max, docSnap) => {
      const num = Number(docSnap.id);
      return !Number.isNaN(num) && num > max ? num : max;
    }, 0);
    return maxId + 1;
  } catch (error) {
    console.warn(`[Firebase] Error obteniendo nextId:`, error.message);
    return null;
  }
}
