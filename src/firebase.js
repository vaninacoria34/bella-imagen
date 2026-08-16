/**
 * ═══════════════════════════════════════════════════════════
 *  FIREBASE - CONFIGURACIÓN CENTRAL
 * ═══════════════════════════════════════════════════════════
 *
 *  Este archivo inicializa Firebase SI las credenciales están
 *  cargadas en el archivo `.env` (variables VITE_FIREBASE_*).
 *
 *  Si NO hay credenciales, la app sigue funcionando 100% con
 *  datos en memoria (los servicios ya tienen esa capa).
 *
 *  ┌────────────────────────────────────────────────────────┐
 *  │  CÓMO ACTIVAR FIREBASE:                                │
 *  │  1. Copiá `.env.example` como `.env` (ya existe).      │
 *  │  2. Pegá tus credenciales de Firebase Console.         │
 *  │  3. Reiniciá el dev server.                            │
 *  └────────────────────────────────────────────────────────┘
 */
import { initializeApp, getApps, getApp } from "@firebase/app";
import { getAuth } from "@firebase/auth";
import { getFirestore } from "@firebase/firestore";
import { getStorage } from "@firebase/storage";

const getEnv = () => {
  try {
    if (typeof import.meta !== "undefined" && import.meta && import.meta.env) {
      return import.meta.env;
    }
  } catch (e) {
    // import.meta.env not available in standard Node ESM
  }
  if (typeof process !== "undefined" && process && process.env) {
    return process.env;
  }
  return {};
};

const env = getEnv();

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || "",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: env.VITE_FIREBASE_APP_ID || "",
};

/**
 * Indica si el usuario pegó las credenciales en `.env`.
 * Si es false, la app usa datos en memoria.
 */
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.authDomain &&
    firebaseConfig.appId
);

/**
 * Inicializa la app de Firebase (evita duplicados).
 */
export const app = isFirebaseConfigured
  ? getApps().length === 0
    ? initializeApp(firebaseConfig)
    : getApp()
  : null;

/**
 * Instancias de servicios (solo si está configurado).
 */
export const auth = isFirebaseConfigured ? getAuth(app) : null;
export const db = isFirebaseConfigured ? getFirestore(app) : null;
export const storage = isFirebaseConfigured ? getStorage(app) : null;

/** Alias de conveniencia para los servicios. */
export const isFirebaseEnabled = isFirebaseConfigured;

export default app;
