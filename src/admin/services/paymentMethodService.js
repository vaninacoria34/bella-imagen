/**
 * Servicio de métodos de pago.
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

/** Key para persistencia en localStorage en modo fallback/offline */
const STORAGE_KEY = "bella_imagen_payment_methods";

const INITIAL_PAYMENT = [
  {
    id: 1,
    nombre: "Mercado Pago",
    icono: "💳",
    descripcion: "Pago online con tarjeta de crédito, débito o dinero en cuenta.",
    datos: "Enviaremos el link de pago por WhatsApp.",
    estado: "Activa",
    orden: 1,
  },
  {
    id: 2,
    nombre: "Transferencia bancaria",
    icono: "🏦",
    descripcion: "Transferencia directa desde tu banco.",
    datos: "Alias: bellaimagen.mp | Titular: Aldana",
    estado: "Activa",
    orden: 2,
  },
  {
    id: 3,
    nombre: "Efectivo",
    icono: "💵",
    descripcion: "Pagá en efectivo al recibir tu pedido (solo retiro/local) o en punto de encuentro.",
    datos: "Aboná al momento de la entrega.",
    estado: "Activa",
    orden: 3,
  },
];

function loadLocalPaymentMethods() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn("Error cargando métodos de pago de localStorage:", e?.message);
  }
  return INITIAL_PAYMENT;
}

function saveLocalPaymentMethods(methods) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(methods));
  } catch (e) {
    console.warn("Error guardando métodos de pago en localStorage:", e?.message);
  }
}

/** Array mutable con los métodos de pago (semilla + creados desde el panel). */
let paymentMethods = loadLocalPaymentMethods();

let nextId = paymentMethods.reduce((max, m) => {
  const num = Number(m.id);
  return !Number.isNaN(num) && num > max ? num : max;
}, 0) + 1;

/**
 * Devuelve todos los métodos de pago.
 * ─────────────────────────────────
 * 🔁 Firebase: reemplazar por getDocs(collection('metodosPago'))
 */
export async function getPaymentMethods() {
  return [...paymentMethods];
}

/**
 * Retorna un método de pago por su ID.
 * ─────────────────────────────────
 * 🔁 Firebase: reemplazar por getDoc(doc('metodosPago', id))
 */
export async function getPaymentMethodById(id) {
  const numId = Number(id);
  return paymentMethods.find((m) => m.id === numId) || null;
}

/**
 * Retorna solo los métodos de pago activos.
 * ────────────────────────────────────────────
 *  Útil para el checkout de la tienda.
 *
 * 🔁 Firebase: reemplazar por consulta filtrada.
 */
export async function getActivePaymentMethods() {
  return paymentMethods
    .filter((m) => m.estado === "Activa")
    .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));
}

/**
 * Crea un nuevo método de pago.
 * ──────────────────────────────
 * 🔁 Firebase: reemplazar por addDoc(collection('metodosPago'), data)
 *
 *  Lanza error si ya existe un método con el mismo nombre
 *  (comparación insensible a mayúsculas).
 */
export async function createPaymentMethod(methodData) {
  const nombre = methodData.nombre.trim();

  const exists = paymentMethods.some(
    (m) => m.nombre.toLowerCase() === nombre.toLowerCase()
  );
  if (exists) {
    throw new Error(`Ya existe un método de pago llamado "${nombre}".`);
  }

  const newMethod = {
    id: nextId++,
    nombre,
    icono: methodData.icono?.trim() || "💳",
    descripcion: methodData.descripcion?.trim() || "",
    datos: methodData.datos?.trim() || "",
    estado: methodData.estado || "Activa",
    orden: methodData.orden ?? paymentMethods.length + 1,
  };

  paymentMethods.push(newMethod);
  saveLocalPaymentMethods(paymentMethods);
}

/**
 * Actualiza un método de pago existente.
 * ─────────────────────────────────────────
 * 🔁 Firebase: reemplazar por updateDoc(doc('metodosPago', id), data)
 *
 *  Valida que el nombre no esté duplicado (excepto contra sí mismo).
 */
export async function updatePaymentMethod(id, methodData) {
  const numId = Number(id);
  const index = paymentMethods.findIndex((m) => m.id === numId);

  if (index === -1) {
    throw new Error(`Método de pago con id ${id} no encontrado.`);
  }

  const nombre = methodData.nombre.trim();

  const duplicate = paymentMethods.some(
    (m) => m.id !== numId && m.nombre.toLowerCase() === nombre.toLowerCase()
  );
  if (duplicate) {
    throw new Error(`Ya existe otro método de pago llamado "${nombre}".`);
  }

  paymentMethods[index] = {
    ...paymentMethods[index],
    nombre,
    icono: methodData.icono?.trim() || "💳",
    descripcion: methodData.descripcion?.trim() || "",
    datos: methodData.datos?.trim() || "",
    estado: methodData.estado || "Activa",
    orden: methodData.orden ?? paymentMethods[index].orden,
  };
  saveLocalPaymentMethods(paymentMethods);
}

/**
 * Elimina un método de pago.
 * ─────────────────────────────
 * 🔁 Firebase: reemplazar por deleteDoc(doc('metodosPago', id))
 */
export async function deletePaymentMethod(id) {
  const numId = Number(id);
  const index = paymentMethods.findIndex((m) => m.id === numId);

  if (index === -1) {
    throw new Error(`Método de pago con id ${id} no encontrado.`);
  }

  paymentMethods.splice(index, 1);
  saveLocalPaymentMethods(paymentMethods);
}

/**
 * Alterna el estado de un método de pago entre Activa e Inactiva.
 * ───────────────────────────────────────────────────────────────
 * 🔁 Firebase: reemplazar por updateDoc(doc('metodosPago', id), { estado })
 */
export async function togglePaymentMethodStatus(id) {
  const numId = Number(id);
  const index = paymentMethods.findIndex((m) => m.id === numId);

  if (index === -1) {
    throw new Error(`Método de pago con id ${id} no encontrado.`);
  }

  paymentMethods[index] = {
    ...paymentMethods[index],
    estado: paymentMethods[index].estado === "Activa" ? "Inactiva" : "Activa",
  };

  saveLocalPaymentMethods(paymentMethods);
  return paymentMethods[index];
}

