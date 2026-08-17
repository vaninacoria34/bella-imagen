/**
 * Servicio de mensajes.
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

/** Key para persistencia en localStorage en modo offline / fallback */
const STORAGE_KEY = "bella_imagen_messages";

/** IDs autoincrementales para nuevos mensajes en fallback. */
let nextId = 6;

/** Estados válidos para un mensaje. */
export const MESSAGE_STATUSES = ["Nuevo", "Leído", "Respondido"];

/** Array inicial de semillas */
const initialSeedMessages = [
  {
    id: 1,
    nombre: "María García",
    email: "maria.garcia@email.com",
    telefono: "+54 11 5555-0101",
    asunto: "Consulta por envíos",
    mensaje:
      "Hola, quería saber si hacen envíos a otras provincias y cuánto tarda aproximadamente en llegar un pedido a Córdoba.",
    fecha: "05/08/2026",
    estado: "Nuevo",
    leido: false,
  },
  {
    id: 2,
    nombre: "Carlos López",
    email: "carlos.lopez@email.com",
    telefono: "+54 11 5555-0202",
    asunto: "Disponibilidad de producto",
    mensaje:
      "Buenas, ¿tienen disponible el perfume 'Perfume Rosé' en presentación de 100ml? Me interesa para un regalo.",
    fecha: "04/08/2026",
    estado: "Leído",
    leido: true,
  },
  {
    id: 3,
    nombre: "Ana Martínez",
    email: "ana.martinez@email.com",
    telefono: "+54 11 5555-0303",
    asunto: "Consulta por descuento",
    mensaje:
      "Hola, quería consultar si el código BIENVENIDA10 se puede combinar con otra promoción o es solo para la primera compra.",
    fecha: "03/08/2026",
    estado: "Respondido",
    leido: true,
  },
  {
    id: 4,
    nombre: "Sofía Díaz",
    email: "sofia.diaz@email.com",
    telefono: "+54 11 5555-0606",
    asunto: "Cambio de producto",
    mensaje:
      "Hola, recibí mi pedido pero quiero consultar por un cambio de talle en la cartera que compré. ¿Cómo hago?",
    fecha: "02/08/2026",
    estado: "Nuevo",
    leido: false,
  },
  {
    id: 5,
    nombre: "Valentina Romero",
    email: "valentina.romero@email.com",
    telefono: "+54 11 5555-0808",
    asunto: "Consulta por formas de pago",
    mensaje:
      "Buenas tardes, ¿qué métodos de pago aceptan? Quiero saber si puedo abonar con transferencia bancaria.",
    fecha: "01/08/2026",
    estado: "Leído",
    leido: true,
  },
];

function loadLocalMessages() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialSeedMessages));
      return [...initialSeedMessages];
    }
    return JSON.parse(raw);
  } catch {
    return [...initialSeedMessages];
  }
}

function saveLocalMessages(msgs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs));
  } catch {
    // ignore
  }
}

/**
 * Devuelve todos los mensajes, ordenados por fecha descendente.
 */
export async function getMessages() {
  if (useFirestore) {
    try {
      const fbMessages = await firebaseRepository.messages.getAll();
      if (fbMessages && fbMessages.length > 0) {
        return fbMessages.sort((a, b) => {
          const da = (a.fecha || "").split("/").reverse().join("");
          const db = (b.fecha || "").split("/").reverse().join("");
          return db.localeCompare(da);
        });
      }
    } catch (e) {
      console.warn("Firestore mensajes fallback local:", e.message);
    }
  }

  const msgs = loadLocalMessages();
  return [...msgs].sort((a, b) => {
    const da = (a.fecha || "").split("/").reverse().join("");
    const db = (b.fecha || "").split("/").reverse().join("");
    return db.localeCompare(da);
  });
}

/**
 * Retorna un mensaje por su ID.
 */
export async function getMessageById(id) {
  if (useFirestore) {
    try {
      const fbMsg = await firebaseRepository.messages.getById(id);
      if (fbMsg) return fbMsg;
    } catch (e) {
      console.warn("Error obteniendo mensaje de Firestore:", e.message);
    }
  }

  const msgs = loadLocalMessages();
  const numId = Number(id) || id;
  return msgs.find((m) => m.id === numId || m.id === id) || null;
}

/**
 * Crea un nuevo mensaje (desde el formulario de contacto de la tienda).
 */
export async function createMessage(messageData) {
  const nombre = String(messageData.nombre || "").trim();
  const mensaje = String(messageData.mensaje || "").trim();

  if (!nombre) {
    throw new Error("El nombre es obligatorio.");
  }
  if (!mensaje) {
    throw new Error("El mensaje es obligatorio.");
  }

  const now = new Date();
  const fecha = `${String(now.getDate()).padStart(2, "0")}/${String(
    now.getMonth() + 1
  ).padStart(2, "0")}/${now.getFullYear()}`;

  const newMessage = {
    id: Date.now(),
    nombre,
    email: String(messageData.email || "").trim(),
    telefono: String(messageData.telefono || "").trim(),
    asunto: String(messageData.asunto || "Consulta general").trim(),
    mensaje,
    fecha,
    estado: "Nuevo",
    leido: false,
    createdAt: now.toISOString(),
  };

  if (useFirestore) {
    try {
      const docId = await firebaseRepository.messages.create(newMessage);
      if (docId) {
        newMessage.id = docId;
      }
    } catch (e) {
      console.warn("Error guardando mensaje en Firestore:", e.message);
    }
  }

  // Guardar también en localStorage para sync local entre pestañas
  const msgs = loadLocalMessages();
  msgs.unshift(newMessage);
  saveLocalMessages(msgs);

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("bella_imagen_message_changed"));
  }

  return newMessage;
}

/**
 * Actualiza el estado de un mensaje (Nuevo / Leído / Respondido).
 */
export async function updateMessageStatus(id, newStatus) {
  if (!MESSAGE_STATUSES.includes(newStatus)) {
    throw new Error(
      `Estado "${newStatus}" no válido. Debe ser uno de: ${MESSAGE_STATUSES.join(", ")}.`
    );
  }

  if (useFirestore) {
    try {
      await firebaseRepository.messages.update(id, {
        estado: newStatus,
        leido: newStatus !== "Nuevo",
      });
    } catch (e) {
      console.warn("Error actualizando estado en Firestore:", e.message);
    }
  }

  const msgs = loadLocalMessages();
  const index = msgs.findIndex((m) => m.id === id || String(m.id) === String(id));

  if (index !== -1) {
    msgs[index] = {
      ...msgs[index],
      estado: newStatus,
      leido: newStatus !== "Nuevo" ? true : msgs[index].leido,
    };
    saveLocalMessages(msgs);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("bella_imagen_message_changed"));
    }
    return msgs[index];
  }

  return null;
}

/**
 * Elimina un mensaje.
 */
export async function deleteMessage(id) {
  if (useFirestore) {
    try {
      await firebaseRepository.messages.remove(id);
    } catch (e) {
      console.warn("Error eliminando mensaje en Firestore:", e.message);
    }
  }

  const msgs = loadLocalMessages();
  const filtered = msgs.filter((m) => m.id !== id && String(m.id) !== String(id));
  saveLocalMessages(filtered);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("bella_imagen_message_changed"));
  }
}

/**
 * Suscribe a los mensajes en tiempo real (Firestore o Eventos Locales).
 */
export function subscribeToMessages(callback) {
  if (useFirestore) {
    const unsub = firebaseRepository.messages.subscribe((fbMessages) => {
      if (fbMessages && Array.isArray(fbMessages)) {
        const sorted = [...fbMessages].sort((a, b) => {
          const da = (a.fecha || "").split("/").reverse().join("");
          const db = (b.fecha || "").split("/").reverse().join("");
          return db.localeCompare(da);
        });
        callback(sorted);
      }
    });
    if (typeof unsub === "function") return unsub;
  }

  const notify = () => {
    const msgs = loadLocalMessages();
    const sorted = [...msgs].sort((a, b) => {
      const da = (a.fecha || "").split("/").reverse().join("");
      const db = (b.fecha || "").split("/").reverse().join("");
      return db.localeCompare(da);
    });
    callback(sorted);
  };

  if (typeof window !== "undefined") {
    window.addEventListener("storage", notify);
    window.addEventListener("bella_imagen_message_changed", notify);
  }

  return () => {
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", notify);
      window.removeEventListener("bella_imagen_message_changed", notify);
    }
  };
}
