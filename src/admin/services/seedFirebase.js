/**
 * ═══════════════════════════════════════════════════════════
 *  SEED FIREBASE - MIGRACIÓN DE DATOS SEMILLA A FIRESTORE
 * ═══════════════════════════════════════════════════════════
 *
 *  Script para poblar Firestore con los datos de ejemplo que hoy
 *  están en memoria, cuando quieras activar Firebase.
 *
 *  ⚠️  ADVERTENCIA:
 *  ───────────────
 *  • Este archivo NO se ejecuta automáticamente. Es decir, no se
 *    importa en ningún componente. Es una "herramienta" manual.
 *  • Solo funciona cuando Firebase está configurado (.env completo).
 *  • Cuando lo ejecutes, creará las colecciones en Firestore.
 *
 *  CÓMO USARLO (cuando tengas Firebase configurado):
 *  ──────────────────────────────────────────────────
 *  1. Configurá tus credenciales en .env
 *  2. Abrí una terminal y ejecutá:
 *       node src/admin/services/seedFirebase.js
 *  3. Se crearán las colecciones con los datos de ejemplo.
 *     Podés borrarlas después y cargar tus productos reales
 *     desde el panel de administración.
 */
import fs from "fs";
import path from "path";

// Carga .env para ejecuciones por CLI (Node)
if (typeof process !== "undefined" && process.env) {
  try {
    const envPath = path.resolve(process.cwd(), ".env");
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8");
      content.split("\n").forEach((line) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#")) {
          const [key, ...val] = trimmed.split("=");
          if (key && val.length) {
            process.env[key.trim()] = val.join("=").trim();
          }
        }
      });
    }
  } catch (e) {}
}

const { isFirebaseEnabled } = await import("../../firebase.js");
const { firebaseRepository } = await import("./firebaseRepository.js");

// Datos de ejemplo por colección (misma estructura que los servicios actuales).
const SEED = {
  productos: [
    { id: 1, title: "Perfume Rosé", category: "Perfumes", price: 25000, image: "", description: "Un perfume elegante y sofisticado.", availability: "Disponible", stock: 10, estado: "Activo" },
    { id: 2, title: "Kit Makeup Pink", category: "Maquillaje", price: 18000, image: "", description: "Kit de maquillaje tonos pink.", availability: "Disponible", stock: 10, estado: "Activo" },
    { id: 3, title: "Crema Hidratante Facial", category: "Skincare", price: 15000, image: "", description: "Crema hidratante con ácido hialurónico.", availability: "Disponible", stock: 10, estado: "Activo" },
  ],
  categorias: [
    { id: 1, name: "Perfumes", description: "Fragancias y perfumes.", image: "", estado: "Activa", orden: 1 },
    { id: 2, name: "Maquillaje", description: "Todo para un look perfecto.", image: "", estado: "Activa", orden: 2 },
    { id: 3, name: "Skincare", description: "Cuidado facial.", image: "", estado: "Activa", orden: 3 },
  ],
  clientes: [
    { id: 1, nombre: "María", apellido: "García", whatsapp: "+54 11 5555-0101", email: "maria.garcia@email.com", estado: "Activo" },
    { id: 2, nombre: "Carlos", apellido: "López", whatsapp: "+54 11 5555-0202", email: "carlos.lopez@email.com", estado: "Activo" },
  ],
  metodosPago: [
    { id: 1, nombre: "Mercado Pago", icono: "💳", descripcion: "Pago online.", datos: "Link de pago por WhatsApp.", estado: "Activa", orden: 1 },
    { id: 2, nombre: "Transferencia bancaria", icono: "🏦", descripcion: "Transferencia directa.", datos: "Alias: bellaimagen.mp", estado: "Activa", orden: 2 },
    { id: 3, nombre: "Efectivo", icono: "💵", descripcion: "Pago en efectivo.", datos: "Al recibir.", estado: "Activa", orden: 3 },
  ],
  metodosEnvio: [
    { id: 1, nombre: "Andreani", icono: "🚚", descripcion: "Envío a domicilio.", costo: 1500, tiempoEstimado: "3 a 7 días", gratisDesde: 50000, estado: "Activa", orden: 1 },
    { id: 2, nombre: "Correo Argentino", icono: "📮", descripcion: "Envío a domicilio.", costo: 1200, tiempoEstimado: "5 a 10 días", gratisDesde: 50000, estado: "Activa", orden: 2 },
    { id: 3, nombre: "Retiro en local", icono: "🏪", descripcion: "Retirás en el local.", costo: 0, tiempoEstimado: "En el día", gratisDesde: 0, estado: "Activa", orden: 3 },
  ],
  promociones: [
    { id: 1, codigo: "BIENVENIDA10", tipo: "porcentaje", valor: 10, descripcion: "10% en tu primera compra.", estado: "Activa" },
    { id: 2, codigo: "BIJA3000", tipo: "fijo", valor: 3000, descripcion: "$3.000 en accesorios.", estado: "Activa" },
  ],
  configuracion: [
    { id: 1, nombreNegocio: "Bella Imagen", nombreVendedora: "Aldana", whatsapp: "3425238984", instagram: "@bellaimagen", compraMinima: 15000, envioGratisDesde: 50000 },
  ],
};

/**
 * Ejecuta la migración.
 */
async function runSeed() {
  if (!isFirebaseEnabled) {
    console.log(
      "❌ Firebase no está configurado.\n" +
        "   1. Completá las credenciales en el archivo .env\n" +
        "   2. Volvé a ejecutar este script.",
      "\n   Tips: copiá .env.example a .env y pegá tus credenciales de Firebase Console."
    );
    return;
  }

  console.log("🚀 Conectando a Firebase...");
  console.log("➡️  Poblando Firestore con datos de ejemplo...");

  const map = [
    { coll: "productos", repo: firebaseRepository.products },
    { coll: "categorias", repo: firebaseRepository.categories },
    { coll: "clientes", repo: firebaseRepository.customers },
    { coll: "metodosPago", repo: firebaseRepository.payment },
    { coll: "metodosEnvio", repo: firebaseRepository.shipping },
    { coll: "promociones", repo: firebaseRepository.promociones },
    { coll: "configuracion", repo: firebaseRepository.settings },
  ];

  for (const { coll, repo, data } of map) {
    const items = SEED[coll] || data || [];
    if (!items.length) {
      console.log(`ℹ️  ${coll}: sin datos para migrar.`);
      continue;
    }
    for (const item of items) {
      try {
        // Usamos el id como doc id numérico para preservar referencias.
        await repo.create(item);
        console.log(`  ✅ ${coll}: "${item.name || item.title || item.codigo || item.nombre || item.id}"`);
      } catch (err) {
        console.log(`  ⚠️  ${coll}: ${err?.message || "error"}`);
      }
    }
  }

  console.log("\n✅ Migración completada. Ya podés usar Firebase en la app.");
  console.log("👀 Recordá: los pedidos se cargan a medida que los clientes hagan compras desde el checkout.");
}

// Solo se ejecuta si se corre directamente: `node src/admin/services/seedFirebase.js`
const isDirectRun = typeof process !== "undefined" &&
  process.argv &&
  process.argv[1] &&
  process.argv[1].includes("seedFirebase");

if (isDirectRun) {
  runSeed();
}

export default runSeed;

