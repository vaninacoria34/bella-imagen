/**
 * Servicio de métodos de envío.
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

/** IDs autoincrementales para nuevos métodos de envío. */
let nextId = 4;

/** Array mutable con los métodos de envío (semilla + creados desde el panel). */
let shippingMethods = [
  {
    id: 1,
    nombre: "Andreani",
    icono: "🚚",
    descripcion: "Envío a domicilio a todo el país a través de Andreani.",
    costo: 1500,
    tiempoEstimado: "3 a 7 días hábiles",
    gratisDesde: 50000,
    estado: "Activa",
    orden: 1,
  },
  {
    id: 2,
    nombre: "Correo Argentino",
    icono: "📮",
    descripcion: "Envío a domicilio a todo el país a través de Correo Argentino.",
    costo: 1200,
    tiempoEstimado: "5 a 10 días hábiles",
    gratisDesde: 50000,
    estado: "Activa",
    orden: 2,
  },
  {
    id: 3,
    nombre: "Retiro en local",
    icono: "🏪",
    descripcion: "Retirás tu pedido en el local sin costo de envío.",
    costo: 0,
    tiempoEstimado: "Disponible en el día",
    gratisDesde: 0,
    estado: "Activa",
    orden: 3,
  },
];

/**
 * Devuelve todos los métodos de envío.
 * ─────────────────────────────────
 * 🔁 Firebase: reemplazar por getDocs(collection('metodosEnvio'))
 */
export async function getShippingMethods() {
  return [...shippingMethods];
}

/**
 * Retorna un método de envío por su ID.
 * ─────────────────────────────────
 * 🔁 Firebase: reemplazar por getDoc(doc('metodosEnvio', id))
 */
export async function getShippingMethodById(id) {
  const numId = Number(id);
  return shippingMethods.find((m) => m.id === numId) || null;
}

/**
 * Retorna solo los métodos de envío activos.
 * ────────────────────────────────────────────
 *  Útil para el checkout de la tienda.
 *
 * 🔁 Firebase: reemplazar por consulta filtrada.
 */
export async function getActiveShippingMethods() {
  return shippingMethods
    .filter((m) => m.estado === "Activa")
    .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));
}

/**
 * Crea un nuevo método de envío.
 * ──────────────────────────────
 * 🔁 Firebase: reemplazar por addDoc(collection('metodosEnvio'), data)
 *
 *  Lanza error si ya existe un método con el mismo nombre
 *  (comparación insensible a mayúsculas).
 */
export async function createShippingMethod(methodData) {
  const nombre = methodData.nombre.trim();

  const exists = shippingMethods.some(
    (m) => m.nombre.toLowerCase() === nombre.toLowerCase()
  );
  if (exists) {
    throw new Error(`Ya existe un método de envío llamado "${nombre}".`);
  }

  const newMethod = {
    id: nextId++,
    nombre,
    icono: methodData.icono?.trim() || "🚚",
    descripcion: methodData.descripcion?.trim() || "",
    costo: Number(methodData.costo) || 0,
    tiempoEstimado: methodData.tiempoEstimado?.trim() || "",
    gratisDesde: methodData.gratisDesde !== "" && methodData.gratisDesde != null
      ? Number(methodData.gratisDesde)
      : 0,
    estado: methodData.estado || "Activa",
    orden: methodData.orden ?? shippingMethods.length + 1,
  };

  shippingMethods.push(newMethod);
}

/**
 * Actualiza un método de envío existente.
 * ─────────────────────────────────────────
 * 🔁 Firebase: reemplazar por updateDoc(doc('metodosEnvio', id), data)
 *
 *  Valida que el nombre no esté duplicado (excepto contra sí mismo).
 */
export async function updateShippingMethod(id, methodData) {
  const numId = Number(id);
  const index = shippingMethods.findIndex((m) => m.id === numId);

  if (index === -1) {
    throw new Error(`Método de envío con id ${id} no encontrado.`);
  }

  const nombre = methodData.nombre.trim();

  const duplicate = shippingMethods.some(
    (m) => m.id !== numId && m.nombre.toLowerCase() === nombre.toLowerCase()
  );
  if (duplicate) {
    throw new Error(`Ya existe otro método de envío llamado "${nombre}".`);
  }

  shippingMethods[index] = {
    ...shippingMethods[index],
    nombre,
    icono: methodData.icono?.trim() || "🚚",
    descripcion: methodData.descripcion?.trim() || "",
    costo: Number(methodData.costo) || 0,
    tiempoEstimado: methodData.tiempoEstimado?.trim() || "",
    gratisDesde: methodData.gratisDesde !== "" && methodData.gratisDesde != null
      ? Number(methodData.gratisDesde)
      : shippingMethods[index].gratisDesde ?? 0,
    estado: methodData.estado || "Activa",
    orden: methodData.orden ?? shippingMethods[index].orden,
  };
}

/**
 * Elimina un método de envío.
 * ─────────────────────────────
 * 🔁 Firebase: reemplazar por deleteDoc(doc('metodosEnvio', id))
 */
export async function deleteShippingMethod(id) {
  const numId = Number(id);
  const index = shippingMethods.findIndex((m) => m.id === numId);

  if (index === -1) {
    throw new Error(`Método de envío con id ${id} no encontrado.`);
  }

  shippingMethods.splice(index, 1);
}

/**
 * Alterna el estado de un método de envío entre Activa e Inactiva.
 * ───────────────────────────────────────────────────────────────
 * 🔁 Firebase: reemplazar por updateDoc(doc('metodosEnvio', id), { estado })
 */
export async function toggleShippingMethodStatus(id) {
  const numId = Number(id);
  const index = shippingMethods.findIndex((m) => m.id === numId);

  if (index === -1) {
    throw new Error(`Método de envío con id ${id} no encontrado.`);
  }

  shippingMethods[index] = {
    ...shippingMethods[index],
    estado: shippingMethods[index].estado === "Activa" ? "Inactiva" : "Activa",
  };

  return shippingMethods[index];
}
