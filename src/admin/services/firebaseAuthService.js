/**
 * ═══════════════════════════════════════════════════════════
 *  FIREBASE AUTH SERVICE - AUTENTICACIÓN PREPARADA
 * ═══════════════════════════════════════════════════════════
 *
 *  Lógica completa de autenticación con Firebase Authentication
 *  (email + contraseña), lista para activarse cuando haya
 *  credenciales en `.env`.
 *
 *  Mientras Firebase no esté configurado:
 *    • isFirebaseAuthEnabled → false
 *    • Las funciones de auth NO se ejecutan y devuelven un error claro.
 *
 *  La app sigue usando el login simulado actual (sessionStorage)
 *  hasta que conectes Firebase.
 */
import { getAuth, onAuthStateChanged } from "@firebase/auth";
import { auth, isFirebaseEnabled } from "../../firebase";

/** Indica si la autenticación de Firebase está disponible. */
export const isFirebaseAuthEnabled = isFirebaseEnabled;

/**
 * Guardia: verifica que Firebase/auth esté configurado.
 */
function guardAuth(op) {
  if (!isFirebaseAuthEnabled || !auth) {
    throw new Error(
      `[Auth inactivo] "${op}" requiere credenciales en .env. Se sigue usando el login simulado.`
    );
  }
}

/**
 * Registra un nuevo usuario con email y contraseña.
 * @param {string} email
 * @param {string} password
 */
export async function signUpWithEmail(email, password) {
  guardAuth("signUpWithEmail");

  const { createUserWithEmailAndPassword } = await import("@firebase/auth");
  const userCredential = await createUserWithEmailAndPassword(
    getAuth(),
    email,
    password
  );
  return userCredential.user;
}

/**
 * Inicia sesión con email y contraseña.
 * @param {string} email
 * @param {string} password
 */
export async function signInWithEmail(email, password) {
  guardAuth("signInWithEmail");

  const { signInWithEmailAndPassword } = await import("@firebase/auth");
  const userCredential = await signInWithEmailAndPassword(
    getAuth(),
    email,
    password
  );
  return userCredential.user;
}

/**
 * Cierra la sesión del usuario actual.
 */
export async function signOutUser() {
  guardAuth("signOutUser");

  const { signOut } = await import("@firebase/auth");
  await signOut(getAuth());
  return true;
}

/**
 * Devuelve el usuario actual (null si no hay sesión).
 */
export function getCurrentUser() {
  if (!isFirebaseAuthEnabled || !auth) return null;
  return auth.currentUser;
}

/**
 * Escucha el estado de autenticación.
 * @param {(user|null) => void} callback
 * @returns {() => void} función para dejar de escuchar
 */
export function subscribeAuthState(callback) {
  if (!isFirebaseAuthEnabled || !auth) {
    // Modo simulado: no hacemos nada.
    return () => {};
  }

  const unsubscribe = onAuthStateChanged(auth, (user) => {
    callback(user);
  });

  return unsubscribe;
}

/**
 * Envía email de recuperación de contraseña.
 * @param {string} email
 */
export async function sendPasswordReset(email) {
  guardAuth("sendPasswordReset");

  const { sendPasswordResetEmail } = await import("@firebase/auth");
  await sendPasswordResetEmail(getAuth(), email);
  return true;
}

export default {
  isFirebaseAuthEnabled,
  signUpWithEmail,
  signInWithEmail,
  signOutUser,
  getCurrentUser,
  subscribeAuthState,
  sendPasswordReset,
};

