/**
 * Servicio de pedidos.
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

/** IDs autoincrementales para nuevas órdenes. */
let nextId = 9;

/** Contador para número de pedido visible (PED-XXXX). */
let pedCounter = 8;

/**
 * Genera información de un producto del catálogo basado en su nombre.
 */
function getProductInfo(productName) {
  const catalog = {
    "Perfume Rosé": { id: 1, categoria: "Perfumes", imagen: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=100&q=80" },
    "Labial Matte": { id: 6, categoria: "Maquillaje", imagen: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=100&q=80" },
    "Crema Hidratante Facial": { id: 10, categoria: "Skincare", imagen: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=100&q=80" },
    "Sérum Vitamina C": { id: 11, categoria: "Skincare", imagen: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=100&q=80" },
    "Collar Dorado Básico": { id: 19, categoria: "Bisutería", imagen: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=100&q=80" },
    "Aros Plateados Argolla": { id: 20, categoria: "Bisutería", imagen: "https://images.unsplash.com/photo-1535632066927-ab7c8ab60908?w=100&q=80" },
    "Pulsera Charm Corazón": { id: 21, categoria: "Bisutería", imagen: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=100&q=80" },
    "Billetera Cuero Clásica": { id: 15, categoria: "Marroquinería", imagen: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=100&q=80" },
    "Cinturón Cuero Premium": { id: 16, categoria: "Marroquinería", imagen: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&q=80" },
    "Kit Makeup Pink": { id: 5, categoria: "Maquillaje", imagen: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=100&q=80" },
    "Base Líquida Velvet": { id: 7, categoria: "Maquillaje", imagen: "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=100&q=80" },
    "Rubor Tostado": { id: 9, categoria: "Maquillaje", imagen: "https://images.unsplash.com/photo-1599733589046-10c7f0c6c6e6?w=100&q=80" },
    "Cartera Elegante Negra": { id: 23, categoria: "Carteras", imagen: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=100&q=80" },
    "Protector Solar SPF 50": { id: 12, categoria: "Skincare", imagen: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=100&q=80" },
    "Tónico Refrescante": { id: 14, categoria: "Skincare", imagen: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=100&q=80" },
    "Bolso Tote Diario": { id: 24, categoria: "Bolsos", imagen: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=100&q=80" },
    "Pañuelo Seda Estampado": { id: 26, categoria: "Accesorios", imagen: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=100&q=80" },
    "Set de Scrunchies": { id: 27, categoria: "Accesorios", imagen: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=100&q=80" },
  };
  return catalog[productName] || { id: 0, categoria: "General", imagen: "" };
}

/**
 * Convierte productos simples al formato enriquecido.
 */
function enrichProducts(productos) {
  return productos.map((p) => {
    const info = getProductInfo(p.nombre);
    return {
      id: info.id,
      nombre: p.nombre,
      categoria: info.categoria,
      imagen: info.imagen,
      cantidad: p.cantidad,
      precio: p.precio,
    };
  });
}

/** Array mutable con los pedidos (semilla + creados desde el panel). */
let orders = [
  {
    id: 1,
    pedNum: `PED-${String(++pedCounter).padStart(4, "0")}`,
    fecha: "28/07/2026",
    hora: "14:35",
    cliente: "María García",
    whatsapp: "+54 11 5555-0101",
    email: "maria.garcia@email.com",
    direccion: "Av. Corrientes 1234",
    ciudad: "CABA",
    codigoPostal: "C1043",
    metodoEnvio: "Envío a domicilio",
    productos: enrichProducts([
      { nombre: "Perfume Rosé", cantidad: 1, precio: 25000 },
      { nombre: "Labial Matte", cantidad: 2, precio: 8500 },
    ]),
    subtotal: 42000,
    envio: 1500,
    total: 43500,
    estado: "Entregado",
    observaciones: "Cliente solicitó envoltorio para regalo.",
    ultimaActualizacion: "28/07/2026 14:35",
  },
  {
    id: 2,
    pedNum: `PED-${String(++pedCounter).padStart(4, "0")}`,
    fecha: "29/07/2026",
    hora: "09:12",
    cliente: "Carlos López",
    whatsapp: "+54 11 5555-0202",
    email: "carlos.lopez@email.com",
    direccion: "Calle Florida 567",
    ciudad: "CABA",
    codigoPostal: "C1005",
    metodoEnvio: "Retiro en local",
    productos: enrichProducts([
      { nombre: "Crema Hidratante Facial", cantidad: 1, precio: 15000 },
      { nombre: "Sérum Vitamina C", cantidad: 1, precio: 21000 },
    ]),
    subtotal: 36000,
    envio: 0,
    total: 36000,
    estado: "Enviado",
    observaciones: "",
    ultimaActualizacion: "29/07/2026 09:12",
  },
  {
    id: 3,
    pedNum: `PED-${String(++pedCounter).padStart(4, "0")}`,
    fecha: "30/07/2026",
    hora: "16:45",
    cliente: "Ana Martínez",
    whatsapp: "+54 11 5555-0303",
    email: "ana.martinez@email.com",
    direccion: "Av. Santa Fe 789",
    ciudad: "CABA",
    codigoPostal: "C1059",
    metodoEnvio: "Envío a domicilio",
    productos: enrichProducts([
      { nombre: "Collar Dorado Básico", cantidad: 1, precio: 6500 },
      { nombre: "Aros Plateados Argolla", cantidad: 1, precio: 5200 },
      { nombre: "Pulsera Charm Corazón", cantidad: 1, precio: 7800 },
    ]),
    subtotal: 19500,
    envio: 1500,
    total: 21000,
    estado: "Preparando",
    observaciones: "Llamar antes de entregar.",
    ultimaActualizacion: "30/07/2026 16:45",
  },
  {
    id: 4,
    pedNum: `PED-${String(++pedCounter).padStart(4, "0")}`,
    fecha: "31/07/2026",
    hora: "11:30",
    cliente: "Pedro Rodríguez",
    whatsapp: "+54 11 5555-0404",
    email: "pedro.rodriguez@email.com",
    direccion: "Av. Rivadavia 2345",
    ciudad: "CABA",
    codigoPostal: "C1034",
    metodoEnvio: "Envío a domicilio",
    productos: enrichProducts([
      { nombre: "Billetera Cuero Clásica", cantidad: 1, precio: 28000 },
      { nombre: "Cinturón Cuero Premium", cantidad: 1, precio: 19500 },
    ]),
    subtotal: 47500,
    envio: 1500,
    total: 49000,
    estado: "Pendiente",
    observaciones: "",
    ultimaActualizacion: "31/07/2026 11:30",
  },
  {
    id: 5,
    pedNum: `PED-${String(++pedCounter).padStart(4, "0")}`,
    fecha: "01/08/2026",
    hora: "08:05",
    cliente: "Laura Fernández",
    whatsapp: "+54 11 5555-0505",
    email: "laura.fernandez@email.com",
    direccion: "Calle Defensa 890",
    ciudad: "CABA",
    codigoPostal: "C1065",
    metodoEnvio: "Retiro en local",
    productos: enrichProducts([
      { nombre: "Kit Makeup Pink", cantidad: 1, precio: 18000 },
      { nombre: "Base Líquida Velvet", cantidad: 1, precio: 12500 },
      { nombre: "Rubor Tostado", cantidad: 1, precio: 9800 },
    ]),
    subtotal: 40300,
    envio: 0,
    total: 40300,
    estado: "Cancelado",
    observaciones: "Cliente solicitó cancelación por cambio de método de pago.",
    ultimaActualizacion: "01/08/2026 08:05",
  },
  {
    id: 6,
    pedNum: `PED-${String(++pedCounter).padStart(4, "0")}`,
    fecha: "02/08/2026",
    hora: "19:20",
    cliente: "Sofía Díaz",
    whatsapp: "+54 11 5555-0606",
    email: "sofia.diaz@email.com",
    direccion: "Av. Belgrano 3456",
    ciudad: "CABA",
    codigoPostal: "C1209",
    metodoEnvio: "Envío a domicilio",
    productos: enrichProducts([
      { nombre: "Cartera Elegante Negra", cantidad: 1, precio: 35000 },
    ]),
    subtotal: 35000,
    envio: 1500,
    total: 36500,
    estado: "Pendiente",
    observaciones: "",
    ultimaActualizacion: "02/08/2026 19:20",
  },
  {
    id: 7,
    pedNum: `PED-${String(++pedCounter).padStart(4, "0")}`,
    fecha: "03/08/2026",
    hora: "10:55",
    cliente: "Jorge Pérez",
    whatsapp: "+54 11 5555-0707",
    email: "jorge.perez@email.com",
    direccion: "Calle San Martín 123",
    ciudad: "CABA",
    codigoPostal: "C1004",
    metodoEnvio: "Envío a domicilio",
    productos: enrichProducts([
      { nombre: "Protector Solar SPF 50", cantidad: 2, precio: 13500 },
      { nombre: "Tónico Refrescante", cantidad: 1, precio: 8200 },
    ]),
    subtotal: 35200,
    envio: 1500,
    total: 36700,
    estado: "Preparando",
    observaciones: "Dejar en portería.",
    ultimaActualizacion: "03/08/2026 10:55",
  },
  {
    id: 8,
    pedNum: `PED-${String(++pedCounter).padStart(4, "0")}`,
    fecha: "04/08/2026",
    hora: "15:40",
    cliente: "Valentina Romero",
    whatsapp: "+54 11 5555-0808",
    email: "valentina.romero@email.com",
    direccion: "Av. Monroe 4567",
    ciudad: "CABA",
    codigoPostal: "C1431",
    metodoEnvio: "Retiro en local",
    productos: enrichProducts([
      { nombre: "Bolso Tote Diario", cantidad: 1, precio: 29000 },
      { nombre: "Pañuelo Seda Estampado", cantidad: 1, precio: 8500 },
      { nombre: "Set de Scrunchies", cantidad: 1, precio: 4200 },
    ]),
    subtotal: 41700,
    envio: 0,
    total: 41700,
    estado: "Entregado",
    observaciones: "",
    ultimaActualizacion: "04/08/2026 15:40",
  },
];

/**
 * Estados válidos para un pedido.
 */
export const ORDER_STATUSES = [
  "Pendiente",
  "Preparando",
  "Enviado",
  "Entregado",
  "Cancelado",
];

/**
 * Devuelve todos los pedidos.
 * ─────────────────────────────────
 * 🔁 Firebase: reemplazar por getDocs(collection('pedidos'))
 */
export async function getOrders() {
  if (useFirestore) {
    try {
      const fbOrders = await firebaseRepository.orders.getAll();
      if (fbOrders && fbOrders.length > 0) {
        return fbOrders;
      }
    } catch (e) {
      console.warn("Firestore pedidos fallback local:", e.message);
    }
  }
  return [...orders];
}

/**
 * Retorna un pedido por su ID.
 * ─────────────────────────────────
 * 🔁 Firebase: reemplazar por getDoc(doc('pedidos', id))
 */
export async function getOrderById(id) {
  const numId = Number(id);
  return orders.find((o) => o.id === numId) || null;
}

/**
 * Actualiza el estado de un pedido.
 * ────────────────────────────────────
 * 🔁 Firebase: reemplazar por updateDoc(doc('pedidos', id), { estado })
 *
 *  Valida que el estado sea uno de los permitidos.
 */
export async function updateOrderStatus(id, newStatus) {
  const numId = Number(id) || id;

  if (useFirestore) {
    try {
      await firebaseRepository.orders.update(numId, {
        estado: newStatus,
        ultimaActualizacion: new Date().toISOString(),
      });
    } catch (e) {
      console.warn("Error actualizando pedido en Firestore:", e.message);
    }
  }
  const index = orders.findIndex((o) => o.id === numId);

  if (index === -1) {
    throw new Error(`Pedido con id ${id} no encontrado.`);
  }

  if (!ORDER_STATUSES.includes(newStatus)) {
    throw new Error(
      `Estado "${newStatus}" no válido. Debe ser uno de: ${ORDER_STATUSES.join(", ")}.`
    );
  }

  const now = new Date();
  const fechaHora = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

orders[index] = {
    ...orders[index],
    estado: newStatus,
    ultimaActualizacion: fechaHora,
  };
}

/**
 * Crea un nuevo pedido desde la tienda (checkout).
 * ───────────────────────────────────────────────────
 * 🔁 Firebase: reemplazar por addDoc(collection('pedidos'), data)
 *
*  Interfaz PÚBLICA (no cambia cuando llegue Firebase):
 *    createOrder({
 *      cliente, whatsapp, email, direccion, ciudad, codigoPostal,
 *      metodoEnvio, metodoEnvioId, metodoPago, costoEnvio,
 *      promocion, descuento, observaciones,
 *      productos: [{ id, nombre, cantidad, precio }]
 *    })
 *      → Promise<objeto pedido creado>
 *
 *  Reglas de envío:
 *    • El costo de envío se toma del método configurado en el panel
 *      (shippingService). El checkout lo calcula y lo envía en `costoEnvio`.
 *    • Si `costoEnvio` no llega (fallback), se usa la regla anterior:
 *      Retiro en local → $0, resto → $1.500.
 *
 *  Promociones:
 *    • `promocion` → código aplicado (opcional).
 *    • `descuento` → monto en pesos a restar del subtotal (opcional).
 */
export async function createOrder(orderData) {
  if (!orderData || !Array.isArray(orderData.productos) || orderData.productos.length === 0) {
    throw new Error("No se puede crear un pedido sin productos.");
  }

  const productos = enrichProducts(
    orderData.productos.map((p) => ({
      nombre: p.nombre,
      cantidad: p.cantidad,
      precio: p.precio,
    }))
  );

  const subtotal = productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  const descuento = Number(orderData.descuento) || 0;
  const envio =
    orderData.costoEnvio != null
      ? Number(orderData.costoEnvio)
      : orderData.metodoEnvio === "Retiro en local"
        ? 0
        : 1500;

  const now = new Date();
  const fecha = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()}`;
  const hora = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  const newOrder = {
    id: nextId++,
    pedNum: `PED-${String(++pedCounter).padStart(4, "0")}`,
    fecha,
    hora,
    cliente: orderData.cliente || "",
    whatsapp: orderData.whatsapp || "",
    email: orderData.email || "",
    direccion: orderData.direccion || "",
    ciudad: orderData.ciudad || "",
codigoPostal: orderData.codigoPostal || "",
    metodoEnvio: orderData.metodoEnvio || "",
    metodoEnvioId: orderData.metodoEnvioId || null,
    metodoPago: orderData.metodoPago || "",
    promocion: orderData.promocion || "",
    descuento,
    productos,
    subtotal,
    envio,
    total: subtotal - descuento + envio,
    estado: "Pendiente",
    observaciones: orderData.observaciones || "",
    ultimaActualizacion: `${fecha} ${hora}`,
  };

  if (useFirestore) {
    try {
      const docId = await firebaseRepository.orders.create(newOrder);
      if (docId) newOrder.id = docId;
    } catch (e) {
      console.warn("Error guardando pedido en Firestore:", e.message);
    }
  }

  // Se agrega al inicio para que aparezca primero en el panel
  orders.unshift(newOrder);

  return newOrder;
}

