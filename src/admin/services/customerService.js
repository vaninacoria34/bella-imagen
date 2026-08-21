/**
 * Servicio de clientes.
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
const STORAGE_KEY = "bella_imagen_customers";

const INITIAL_CUSTOMERS = [
  {
    id: 1,
    nombre: "María",
    apellido: "García",
    whatsapp: "+54 11 5555-0101",
    email: "maria.garcia@email.com",
    direccion: "Av. Corrientes 1234",
    ciudad: "CABA",
    codigoPostal: "C1043",
    cantidadPedidos: 5,
    totalComprado: 187500,
    ultimaCompra: "28/07/2026",
    estado: "Activo",
    fechaRegistro: "15/01/2025",
    observaciones: "Cliente frecuente. Prefiere envío a domicilio.",
  },
  {
    id: 2,
    nombre: "Carlos",
    apellido: "López",
    whatsapp: "+54 11 5555-0202",
    email: "carlos.lopez@email.com",
    direccion: "Calle Florida 567",
    ciudad: "CABA",
    codigoPostal: "C1005",
    cantidadPedidos: 3,
    totalComprado: 82000,
    ultimaCompra: "29/07/2026",
    estado: "Activo",
    fechaRegistro: "03/03/2025",
    observaciones: "",
  },
  {
    id: 3,
    nombre: "Ana",
    apellido: "Martínez",
    whatsapp: "+54 11 5555-0303",
    email: "ana.martinez@email.com",
    direccion: "Av. Santa Fe 789",
    ciudad: "CABA",
    codigoPostal: "C1059",
    cantidadPedidos: 2,
    totalComprado: 42000,
    ultimaCompra: "30/07/2026",
    estado: "Activo",
    fechaRegistro: "20/04/2025",
    observaciones: "Solicita llamar antes de entregar.",
  },
  {
    id: 4,
    nombre: "Pedro",
    apellido: "Rodríguez",
    whatsapp: "+54 11 5555-0404",
    email: "pedro.rodriguez@email.com",
    direccion: "Av. Rivadavia 2345",
    ciudad: "CABA",
    codigoPostal: "C1034",
    cantidadPedidos: 1,
    totalComprado: 49000,
    ultimaCompra: "31/07/2026",
    estado: "Activo",
    fechaRegistro: "10/06/2025",
    observaciones: "Cliente nuevo. Primera compra.",
  },
  {
    id: 5,
    nombre: "Laura",
    apellido: "Fernández",
    whatsapp: "+54 11 5555-0505",
    email: "laura.fernandez@email.com",
    direccion: "Calle Defensa 890",
    ciudad: "CABA",
    codigoPostal: "C1065",
    cantidadPedidos: 4,
    totalComprado: 156800,
    ultimaCompra: "01/08/2026",
    estado: "Inactivo",
    fechaRegistro: "12/02/2025",
    observaciones: "Cliente solicitó baja temporal por viaje.",
  },
  {
    id: 6,
    nombre: "Sofía",
    apellido: "Díaz",
    whatsapp: "+54 11 5555-0606",
    email: "sofia.diaz@email.com",
    direccion: "Av. Belgrano 3456",
    ciudad: "CABA",
    codigoPostal: "C1209",
    cantidadPedidos: 6,
    totalComprado: 234000,
    ultimaCompra: "02/08/2026",
    estado: "Activo",
    fechaRegistro: "05/01/2025",
    observaciones: "Cliente VIP. Compra productos de marroquinería regularly.",
  },
  {
    id: 7,
    nombre: "Jorge",
    apellido: "Pérez",
    whatsapp: "+54 11 5555-0707",
    email: "jorge.perez@email.com",
    direccion: "Calle San Martín 123",
    ciudad: "CABA",
    codigoPostal: "C1004",
    cantidadPedidos: 2,
    totalComprado: 73500,
    ultimaCompra: "03/08/2026",
    estado: "Activo",
    fechaRegistro: "18/05/2025",
    observaciones: "Solicita dejar los pedidos en portería.",
  },
  {
    id: 8,
    nombre: "Valentina",
    apellido: "Romero",
    whatsapp: "+54 11 5555-0808",
    email: "valentina.romero@email.com",
    direccion: "Av. Monroe 4567",
    ciudad: "CABA",
    codigoPostal: "C1431",
    cantidadPedidos: 3,
    totalComprado: 125100,
    ultimaCompra: "04/08/2026",
    estado: "Activo",
    fechaRegistro: "22/02/2025",
    observaciones: "Compra productos de bisutería y accesorios.",
  },
  {
    id: 9,
    nombre: "Diego",
    apellido: "Álvarez",
    whatsapp: "+54 11 5555-0909",
    email: "diego.alvarez@email.com",
    direccion: "Av. Cabildo 1234",
    ciudad: "CABA",
    codigoPostal: "C1428",
    cantidadPedidos: 1,
    totalComprado: 28000,
    ultimaCompra: "10/06/2026",
    estado: "Inactivo",
    fechaRegistro: "10/06/2026",
    observaciones: "Cliente inactivo por falta de respuesta.",
  },
  {
    id: 10,
    nombre: "Camila",
    apellido: "Torres",
    whatsapp: "+54 11 5555-1010",
    email: "camila.torres@email.com",
    direccion: "Calle Lavalle 789",
    ciudad: "CABA",
    codigoPostal: "C1047",
    cantidadPedidos: 7,
    totalComprado: 315000,
    ultimaCompra: "25/07/2026",
    estado: "Activo",
    fechaRegistro: "08/01/2025",
    observaciones: "Mejor cliente del mes. Compra skincare y maquillaje.",
  },
  {
    id: 11,
    nombre: "Martín",
    apellido: "Giménez",
    whatsapp: "+54 11 5555-1111",
    email: "martin.gimenez@email.com",
    direccion: "Av. Independencia 234",
    ciudad: "CABA",
    codigoPostal: "C1099",
    cantidadPedidos: 0,
    totalComprado: 0,
    ultimaCompra: "",
    estado: "Activo",
    fechaRegistro: "01/08/2026",
    observaciones: "Cliente recién registrado. Sin compras aún.",
  },
  {
    id: 12,
    nombre: "Florencia",
    apellido: "Mendoza",
    whatsapp: "+54 11 5555-1212",
    email: "florencia.mendoza@email.com",
    direccion: "Calle Esmeralda 567",
    ciudad: "CABA",
    codigoPostal: "C1053",
    cantidadPedidos: 8,
    totalComprado: 420000,
    ultimaCompra: "27/07/2026",
    estado: "Activo",
    fechaRegistro: "02/01/2025",
    observaciones: "Cliente premium. Compra todos los meses sin falta.",
  },
];

function loadLocalCustomers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn("Error cargando clientes de localStorage:", e?.message);
  }
  return INITIAL_CUSTOMERS;
}

function saveLocalCustomers(custs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(custs));
  } catch (e) {
    console.warn("Error guardando clientes en localStorage:", e?.message);
  }
}

/** Array mutable con los clientes (semilla + creados desde el panel). */
let customers = loadLocalCustomers();

let nextId = customers.reduce((max, c) => {
  const num = Number(c.id);
  return !Number.isNaN(num) && num > max ? num : max;
}, 0) + 1;

/**
 * Devuelve todos los clientes.
 * ─────────────────────────────────
 * 🔁 Firebase: reemplazar por getDocs(collection('clientes'))
 */
export async function getCustomers() {
  return [...customers];
}

/**
 * Retorna un cliente por su ID.
 * ─────────────────────────────────
 * 🔁 Firebase: reemplazar por getDoc(doc('clientes', id))
 */
export async function getCustomerById(id) {
  const numId = Number(id);
  return customers.find((c) => c.id === numId) || null;
}

/**
 * Crea un nuevo cliente.
 * ───────────────────────────
 * 🔁 Firebase: reemplazar por addDoc(collection('clientes'), data)
 *
 *  Valida que el email no esté duplicado.
 */
export async function createCustomer(customerData) {
  const email = customerData.email.trim().toLowerCase();

  // Validar email único
  const exists = customers.some(
    (c) => c.email.toLowerCase() === email
  );
  if (exists) {
    throw new Error(`Ya existe un cliente con el email "${customerData.email}".`);
  }

  const now = new Date();
  const fechaReg = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()}`;

  const newCustomer = {
    id: nextId++,
    nombre: customerData.nombre.trim(),
    apellido: customerData.apellido.trim(),
    whatsapp: customerData.whatsapp?.trim() || "",
    email,
    direccion: customerData.direccion?.trim() || "",
    ciudad: customerData.ciudad?.trim() || "",
    codigoPostal: customerData.codigoPostal?.trim() || "",
    cantidadPedidos: 0,
    totalComprado: 0,
    ultimaCompra: "",
    estado: customerData.estado || "Activo",
    fechaRegistro: fechaReg,
    observaciones: customerData.observaciones?.trim() || "",
  };
  saveLocalCustomers(customers);

  customers.push(newCustomer);
  saveLocalCustomers(customers);
}

/**
 * Actualiza un cliente existente.
 * ────────────────────────────────────
 * 🔁 Firebase: reemplazar por updateDoc(doc('clientes', id), data)
 *
 *  Valida que el email no esté duplicado (excepto contra sí mismo).
 */
export async function updateCustomer(id, customerData) {
  const numId = Number(id);
  const index = customers.findIndex((c) => c.id === numId);

  if (index === -1) {
    throw new Error(`Cliente con id ${id} no encontrado.`);
  }

  const email = customerData.email.trim().toLowerCase();

  // Validar email único (excluyendo el cliente actual)
  const duplicate = customers.some(
    (c) => c.id !== numId && c.email.toLowerCase() === email
  );
  if (duplicate) {
    throw new Error(`Ya existe otro cliente con el email "${customerData.email}".`);
  }

  customers[index] = {
    ...customers[index],
    nombre: customerData.nombre.trim(),
    apellido: customerData.apellido.trim(),
    whatsapp: customerData.whatsapp?.trim() || "",
    email,
    direccion: customerData.direccion?.trim() || "",
    ciudad: customerData.ciudad?.trim() || "",
    codigoPostal: customerData.codigoPostal?.trim() || "",
    estado: customerData.estado || "Activo",
    observaciones: customerData.observaciones?.trim() || "",
  };
}

/**
 * Elimina un cliente.
 * ────────────────────────
 * 🔁 Firebase: reemplazar por deleteDoc(doc('clientes', id))
 */
export async function deleteCustomer(id) {
  const numId = Number(id);
  const index = customers.findIndex((c) => c.id === numId);

  if (index === -1) {
    throw new Error(`Cliente con id ${id} no encontrado.`);
  }

  customers.splice(index, 1);
  saveLocalCustomers(customers);
}

/**
 * Alterna el estado de un cliente entre Activo e Inactivo.
 * ─────────────────────────────────────────────────────────
 * 🔁 Firebase: reemplazar por updateDoc(doc('clientes', id), { estado })
 */
export async function toggleCustomerStatus(id) {
  const numId = Number(id);
  const index = customers.findIndex((c) => c.id === numId);

  if (index === -1) {
    throw new Error(`Cliente con id ${id} no encontrado.`);
  }

  customers[index] = {
    ...customers[index],
    estado: customers[index].estado === "Activo" ? "Inactivo" : "Activo",
  };

  saveLocalCustomers(customers);
  return customers[index];
}

