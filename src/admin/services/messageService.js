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

/** IDs autoincrementales para nuevos mensajes. */
let nextId = 6;

/** Estados válidos para un mensaje. */
export const MESSAGE_STATUSES = ["Nuevo", "Leído", "Respondido"];

/** Array mutable con los mensajes (semilla + creados desde el contacto). */
let messages = [
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

/**
 * Devuelve todos los mensajes, ordenados por fecha descendente.
 * ─────────────────────────────────
 * 🔁 Firebase: reemplazar por getDocs(collection('mensajes'))
 */
export async function getMessages() {
  return [...messages].sort((a, b) => {
    const da = a.fecha.split("/").reverse().join("");
    const db = b.fecha.split("/").reverse().join("");
    return db.localeCompare(da);
  });
}

/**
 * Retorna un mensaje por su ID.
 * ─────────────────────────────────
 * 🔁 Firebase: reemplazar por getDoc(doc('mensajes', id))
 */
export async function getMessageById(id) {
  const numId = Number(id);
  return messages.find((m) => m.id === numId) || null;
}

/**
 * Crea un nuevo mensaje (desde el formulario de contacto de la tienda).
 * ─────────────────────────────────────────────────────────────────────
 * 🔁 Firebase: reemplazar por addDoc(collection('mensajes'), data)
 *
 *  Valida que nombre y mensaje sean obligatorios.
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
    id: nextId++,
    nombre,
    email: String(messageData.email || "").trim(),
    telefono: String(messageData.telefono || "").trim(),
    asunto: String(messageData.asunto || "Consulta general").trim(),
    mensaje,
    fecha,
    estado: "Nuevo",
    leido: false,
  };

  messages.push(newMessage);
  return newMessage;
}

/**
 * Actualiza el estado de un mensaje (Nuevo / Leído / Respondido).
 * ───────────────────────────────────────────────────────────────
 * 🔁 Firebase: reemplazar por updateDoc(doc('mensajes', id), { estado, leido })
 *
 *  Si el estado cambia a un valor distinto de "Nuevo", se marca como leído.
 */
export async function updateMessageStatus(id, newStatus) {
  const numId = Number(id);
  const index = messages.findIndex((m) => m.id === numId);

  if (index === -1) {
    throw new Error(`Mensaje con id ${id} no encontrado.`);
  }

  if (!MESSAGE_STATUSES.includes(newStatus)) {
    throw new Error(
      `Estado "${newStatus}" no válido. Debe ser uno de: ${MESSAGE_STATUSES.join(", ")}.`
    );
  }

  messages[index] = {
    ...messages[index],
    estado: newStatus,
    leido: newStatus !== "Nuevo" ? true : messages[index].leido,
  };

  return messages[index];
}

/**
 * Elimina un mensaje.
 * ────────────────────
 * 🔁 Firebase: reemplazar por deleteDoc(doc('mensajes', id))
 */
export async function deleteMessage(id) {
  const numId = Number(id);
  const index = messages.findIndex((m) => m.id === numId);

  if (index === -1) {
    throw new Error(`Mensaje con id ${id} no encontrado.`);
  }

  messages.splice(index, 1);
}
