/**
 * ═══════════════════════════════════════════════════════════
 *  FIREBASE STORAGE SERVICE - SUBIDA DE IMÁGENES
 * ═══════════════════════════════════════════════════════════
 *
 *  Funciones para subir imágenes a Firebase Storage.
 *
 *  Mientras Firebase no esté configurado, `uploadImage` devuelve
 *  la URL original tal cual (para que la app siga funcionando con
 *  imágenes de ejemplo).
 *
 *  Cuando conectes Firebase, pasará a subir la imagen a Storage y
 *  devolver la URL pública de descarga.
 */
import { storage, isFirebaseEnabled } from "../../firebase";

/** Indica si Firebase Storage está disponible. */
export const isStorageEnabled = isFirebaseEnabled;

/** Carpeta base en Storage para imágenes de productos. */
const DEFAULT_FOLDER = "productos";

/**
 * Sube una imagen (File/Blob) a Firebase Storage.
 * ─────────────────────────────────────────────
 * @param {File|Blob} file - Archivo de imagen (desde un <input type="file">)
 * @param {string} [folder] - Carpeta destino (default: "productos")
 * @param {string} [fileName] - Nombre personalizado (default: timestamp + nombre)
 * @returns {Promise<string>} URL pública de descarga
 *
 * Si Firebase no está configurado, devuelve la URL original o una
 * data URL local (mantiene la app funcional).
 */
export async function uploadImage(file, folder = DEFAULT_FOLDER, fileName) {
  // 🔹 Modo sin Firebase: devolvemos la URL local para no romper nada.
  if (!isStorageEnabled || !storage) {
    // Si es un File con objectURL, lo devolvemos; si ya es URL, igual.
    if (typeof file === "string") return file;
    if (file && file.preview) return file.preview;
    return "";
  }

  const { ref, uploadBytes, getDownloadURL } = await import("@firebase/storage");

  const safeName = fileName || `${Date.now()}_${file.name || "imagen"}`;
  const storageRef = ref(storage, `${folder}/${safeName}`);

  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);

  return downloadURL;
}

/**
 * Elimina una imagen de Storage por su URL o path.
 * ────────────────────────────────────────────────
 * @param {string} urlOrPath - URL pública o path en Storage
 * @returns {Promise<boolean>}
 */
export async function deleteImage(urlOrPath) {
  if (!isStorageEnabled || !storage) return false;

  const { ref, deleteObject } = await import("@firebase/storage");

  // Si es una URL, extraemos el path (después del bucket).
  let path = urlOrPath;
  try {
    const url = new URL(urlOrPath);
    // La URL de Firebase Storage tiene formato: /v0/b/<bucket>/o/<encoded-path>
    const parts = url.pathname.split("/o/");
    if (parts.length >= 2) {
      path = decodeURIComponent(parts[1]);
    }
  } catch {
    // No es una URL válida, se asume que ya es un path.
  }

  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
  return true;
}

export default {
  isStorageEnabled,
  uploadImage,
  deleteImage,
};
