/**
 * Servicio de configuración del negocio.
 *
 * ════════════════════════════════════════════════════════
 *  CAPA DE ABSTRACCIÓN PARA EL ORIGEN DE DATOS
 * ════════════════════════════════════════════════════════
 *
 *  En esta etapa los datos provienen de un objeto en memoria.
 *
 *  ╔══════════════════════════════════════════════════════╗
 *  ║  🔮 CUANDO LLEGUE FIRESTORE:                        ║
 *  ║  Solo hay que reemplazar la implementación interna  ║
 *  ║  de cada función. La interfaz pública NO cambia.    ║
 *  ║  Ningún otro archivo del panel requiere ajustes.    ║
 *  ╚══════════════════════════════════════════════════════╝
 */

/** Strings acotados para evitar valores vacíos. */
// eslint-disable-next-line no-unused-vars
function cleanString(value) {
  return (value || "").trim();
}

/** Key para persistencia en localStorage en modo fallback/offline */
const STORAGE_KEY = "bella_imagen_settings";

const DEFAULT_SETTINGS = {
  nombreNegocio: "Bella Imagen",
  nombreVendedora: "Aldana",
  whatsapp: "3425238984",
  whatsappLink: "3425238984",
  instagram: "bella.imagen.stt",
  direccion: "",
  ciudad: "",
  emailContacto: "",
  compraMinima: 15000,
  envioGratisDesde: 50000,
  horarioAtencion: "Lunes a Sábados de 9 a 20 hs",
  acercaDe:
    "Maquillaje, perfumes y accesorios diseñados para resaltar tu esencia.",
  // ── Desarrolladora / Soporte técnico ──
  devNombre: "Vanina Coria",
  devRol: "Desarrolladora del sitio",
  devWhatsapp: "3425238984",
  devMensaje:
    "Para consultas técnicas o sobre el funcionamiento del sitio, comunicate con la desarrolladora Vanina Coria al WhatsApp 3425238984.",
};

function loadLocalSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
    }
  } catch (e) {
    console.warn("Error cargando configuración de localStorage:", e?.message);
  }
  return DEFAULT_SETTINGS;
}

function saveLocalSettings(st) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(st));
  } catch (e) {
    console.warn("Error guardando configuración en localStorage:", e?.message);
  }
}

/** Objeto mutable con la configuración del negocio. */
let settings = loadLocalSettings();

/**
 * Devuelve la configuración actual.
 * ─────────────────────────────────
 * 🔁 Firebase: reemplazar por getDoc(doc('config', 'negocio'))
 */
export async function getSettings() {
  return { ...settings };
}

/**
 * Limpia un número de WhatsApp (quita +, espacios y guiones).
 * @param {string} value
 * @returns {string}
 */
function normalizeWhatsapp(value) {
  return (value || "").replace(/[^\d]/g, "");
}

/**
 * Actualiza la configuración del negocio.
 * ─────────────────────────────────────────
 * 🔁 Firebase: reemplazar por updateDoc(doc('config', 'negocio'), data)
 *
 *  Valida que los números sean telefónicos y montos positivos.
 */
export async function updateSettings(data) {
  const next = { ...data };

  // Normalizar y validar WhatsApp
  const wa = normalizeWhatsapp(next.whatsapp);
  if (!/^\d{8,15}$/.test(wa)) {
    throw new Error("El número de WhatsApp debe tener entre 8 y 15 dígitos.");
  }
  next.whatsapp = wa;

  // WhatsApp link (si viene vacío, se usa el mismo número)
  const waLink = normalizeWhatsapp(next.whatsappLink);
  next.whatsappLink = waLink || wa;

  // Montos
  const compraMinima = Number(next.compraMinima);
  const envioGratisDesde = Number(next.envioGratisDesde);
  if (Number.isNaN(compraMinima) || compraMinima < 0) {
    throw new Error("La compra mínima debe ser un monto válido.");
  }
  if (Number.isNaN(envioGratisDesde) || envioGratisDesde < 0) {
    throw new Error("El envío gratis desde debe ser un monto válido.");
  }
  next.compraMinima = compraMinima;
  next.envioGratisDesde = envioGratisDesde;

  // Dev WhatsApp (opcional, solo normaliza si viene)
  if (next.devWhatsapp) {
    const devWa = normalizeWhatsapp(next.devWhatsapp);
    if (devWa) next.devWhatsapp = devWa;
  }

  settings = { ...settings, ...next };
  saveLocalSettings(settings);
  return { ...settings };
}
