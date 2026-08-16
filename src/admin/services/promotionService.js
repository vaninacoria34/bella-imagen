/**
 * Servicio de promociones.
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
 *  ╚══════════════════════════════════════════════════════╝
 */

/** ID autoincremental para nuevas promociones. */
let nextId = 4;

/** Tipos de descuento soportados. */
export const PROMOTION_TYPES = ["porcentaje", "fijo"];

/** Array mutable con las promociones (semilla + creadas desde el panel). */
let promotions = [
  {
    id: 1,
    codigo: "BIENVENIDA10",
    tipo: "porcentaje",
    valor: 10,
    descripcion: "10% de descuento en tu primera compra.",
    estado: "Activa",
    fechaInicio: "01/01/2025",
    fechaFin: "31/12/2026",
  },
  {
    id: 2,
    codigo: "BIJA3000",
    tipo: "fijo",
    valor: 3000,
    descripcion: "$3.000 de descuento en accesorios y bijou.",
    estado: "Activa",
    fechaInicio: "01/06/2026",
    fechaFin: "31/08/2026",
  },
  {
    id: 3,
    codigo: "CARRITO20",
    tipo: "porcentaje",
    valor: 20,
    descripcion: "20% de descuento en compras superiores a $60.000.",
    estado: "Inactiva",
    fechaInicio: "01/07/2026",
    fechaFin: "31/07/2026",
  },
];

/**
 * Devuelve todas las promociones.
 * ─────────────────────────────────
 * 🔁 Firebase: reemplazar por getDocs(collection('promociones'))
 */
export async function getPromotions() {
  return [...promotions];
}

/**
 * Retorna una promoción por su ID.
 * ─────────────────────────────────
 * 🔁 Firebase: reemplazar por getDoc(doc('promociones', id))
 */
export async function getPromotionById(id) {
  const numId = Number(id);
  return promotions.find((p) => p.id === numId) || null;
}

/**
 * Retorna una promoción por su código (insensible a mayúsculas).
 * ──────────────────────────────────────────────────────────────
 *  Útil para validar el código en el checkout.
 *
 * 🔁 Firebase: reemplazar por consulta filtrada con where().
 */
export async function getPromotionByCode(code) {
  const normalized = String(code || "").trim().toUpperCase();
  if (!normalized) return null;
  return (
    promotions.find(
      (p) => p.codigo.trim().toUpperCase() === normalized
    ) || null
  );
}

/**
 * Retorna solo las promociones activas.
 * ────────────────────────────────────────
 *  Útil para el checkout de la tienda.
 *
 * 🔁 Firebase: reemplazar por consulta filtrada.
 */
export async function getActivePromotions() {
  return promotions.filter((p) => p.estado === "Activa");
}

/**
 * Crea una nueva promoción.
 * ──────────────────────────
 * 🔁 Firebase: reemplazar por addDoc(collection('promociones'), data)
 *
 *  Lanza error si ya existe una promoción con el mismo código.
 */
export async function createPromotion(promotionData) {
  const codigo = String(promotionData.codigo || "").trim().toUpperCase();

  if (!codigo) {
    throw new Error("El código de promoción es obligatorio.");
  }

  const exists = promotions.some(
    (p) => p.codigo.trim().toUpperCase() === codigo
  );
  if (exists) {
    throw new Error(`Ya existe una promoción con el código "${codigo}".`);
  }

  const newPromotion = {
    id: nextId++,
    codigo,
    tipo: promotionData.tipo || "porcentaje",
    valor: Number(promotionData.valor) || 0,
    descripcion: promotionData.descripcion?.trim() || "",
    estado: promotionData.estado || "Activa",
    fechaInicio: promotionData.fechaInicio?.trim() || "",
    fechaFin: promotionData.fechaFin?.trim() || "",
  };

  promotions.push(newPromotion);
}

/**
 * Actualiza una promoción existente.
 * ────────────────────────────────────
 * 🔁 Firebase: reemplazar por updateDoc(doc('promociones', id), data)
 *
 *  Valida que el código no esté duplicado (excepto contra sí misma).
 */
export async function updatePromotion(id, promotionData) {
  const numId = Number(id);
  const index = promotions.findIndex((p) => p.id === numId);

  if (index === -1) {
    throw new Error(`Promoción con id ${id} no encontrada.`);
  }

  const codigo = String(promotionData.codigo || "").trim().toUpperCase();
  if (!codigo) {
    throw new Error("El código de promoción es obligatorio.");
  }

  const duplicate = promotions.some(
    (p) => p.id !== numId && p.codigo.trim().toUpperCase() === codigo
  );
  if (duplicate) {
    throw new Error(`Ya existe otra promoción con el código "${codigo}".`);
  }

  promotions[index] = {
    ...promotions[index],
    codigo,
    tipo: promotionData.tipo || "porcentaje",
    valor: Number(promotionData.valor) || 0,
    descripcion: promotionData.descripcion?.trim() || "",
    estado: promotionData.estado || "Activa",
    fechaInicio: promotionData.fechaInicio?.trim() || "",
    fechaFin: promotionData.fechaFin?.trim() || "",
  };
}

/**
 * Elimina una promoción.
 * ────────────────────────
 * 🔁 Firebase: reemplazar por deleteDoc(doc('promociones', id))
 */
export async function deletePromotion(id) {
  const numId = Number(id);
  const index = promotions.findIndex((p) => p.id === numId);

  if (index === -1) {
    throw new Error(`Promoción con id ${id} no encontrada.`);
  }

  promotions.splice(index, 1);
}

/**
 * Alterna el estado de una promoción entre Activa e Inactiva.
 * ───────────────────────────────────────────────────────────
 * 🔁 Firebase: reemplazar por updateDoc(doc('promociones', id), { estado })
 */
export async function togglePromotionStatus(id) {
  const numId = Number(id);
  const index = promotions.findIndex((p) => p.id === numId);

  if (index === -1) {
    throw new Error(`Promoción con id ${id} no encontrada.`);
  }

  promotions[index] = {
    ...promotions[index],
    estado: promotions[index].estado === "Activa" ? "Inactiva" : "Activa",
  };

  return promotions[index];
}
