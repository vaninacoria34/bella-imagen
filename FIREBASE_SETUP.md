# 🔥 Firebase de Bella Imagen — Guía de activación y uso

Esta guía te explica **en simple** el estado actual de la conexión con Firebase
y qué te falta para que quede 100% operativo.

> ⏭️ **Buenas noticias:** tus credenciales de Firebase **ya están cargadas**
> en el archivo `.env`. La app ya puede conectarse a tu proyecto de Firebase
> (`bella-imagen-4b421`). Solo falta activar los 3 servicios en la consola.

---

## ✅ ¿Qué está listo?

Toda la "instalación eléctrica" ya está conectada. Estos son los archivos preparados:

| Archivo | ¿Qué hace? |
|---------|------------|
| `.env` | 🔑 **Tus credenciales reales ya están acá** (oculto de git). |
| `src/firebase.js` | 🧠 El **centro de control**. Lee el `.env` e inicializa Firebase. |
| `src/admin/services/firebaseService.js` | 🔌 Funciones genéricas para leer/guardar/borrar datos (Firestore). |
| `src/admin/services/firebaseRepository.js` | 📦 Repositorio con las colecciones: productos, clientes, pedidos, etc. |
| `src/admin/services/firebaseAuthService.js` | 👤 Autenticación: registro, login, cerrar sesión (email + contraseña). |
| `src/admin/services/firebaseStorageService.js` | 🖼️ Subida de imágenes a Storage. |
| `src/admin/services/seedFirebase.js` | 🌱 Script para cargar los datos de ejemplo en la nube (opcional). |

---

## 🎯 Lo único que falta: activar los servicios en Firebase Console

Entrá a 👉 **https://console.firebase.google.com/project/bella-imagen-4b421**
(iniciá sesión con tu cuenta de Google) y activá estos 3 servicios:

### 1️⃣ Authentication (para que los clientes puedan registrarse y loguearse)
1. En el menú lateral → **Authentication** → **Comenzar**.
2. Andá a la pestaña **Sign-in method**.
3. En **Email/Contraseña** → toca el lápiz ✏️ → activá **"Habilitar"** → **Guardar**.

### 2️⃣ Cloud Firestore (para guardar productos, clientes y pedidos)
1. En el menú lateral → **Firestore Database** → **Crear base de datos**.
2. Elegí **Modo de producción** (o *pruebas* si estás empezando).
3. Elegí la zona → **us-central** → **Crear**.

### 3️⃣ Storage (para subir imágenes de productos)
1. En el menú lateral → **Storage** → **Comenzar**.
2. Aceptá y listo.

---

## ▶️ Después de activarlos

1. **Reiniciá la app** para que tome la configuración:

```bash
npm run dev
```

2. **Probá así:** abrí la consola del navegador (F12 → *Console*).
   - Si ves errores de conexión o necesitás el login real, revisá la sección de "problemas" ↓.

---

## 🔍 Cómo verificar que funcionó

- **Firestore:** creá un producto en el panel `/admin` y revisá si aparece en
  Firebase Console → **Firestore Database** → colección `productos`.
- **Storage:** subí una imagen en un producto y revisá que aparezca en
  **Storage** → `productos/`.
- **Authentication:** si llegás a registrar un usuario, aparece en
  **Authentication** → *Users*.

---

## 🌱 (Opcional) Cargar datos de ejemplo en la nube

Si querés que Firestore empiece con algunos productos/categorías de ejemplo:

```bash
cd bella-imagen
node src/admin/services/seedFirebase.js
```

> ⚠️ Requiere haber activado **Firestore** primero.

---

## ❓ Posibles problemas y soluciones

| Problema | Solución |
|----------|----------|
| `PERMISSION_DENIED` al leer/escribir datos | Si creaste Firestore en modo *producción*, las reglas bloquean el acceso. Andá a **Firestore → Reglas** y pon la regla de prueba: `allow read, write: if true;` (solo para desarrollo). |
| Error de CORS en Storage | Es normal la primera vez. Andá a **Storage → Reglas** y, para desarrollo, permití lectura/escritura: `allow read, write: if true;`. |
| El login del panel sigue siendo el simulado | La parte de Auth de Firebase está **preparada** (código en `firebaseAuthService.js`) pero aún no reemplaza al login simulado del panel. Se puede integrar cuando quieras. |
| Firebase no se inicializa | Verificá que el `.env` esté completo y que hayas **reiniciado** el dev server (Vite lee el `.env` al arrancar). |

---

## 📁 Colecciones que se crearán en Firestore

```
productos        → catálogo de productos
categorias       → categorías
clientes         → clientes registrados
pedidos          → pedidos de los clientes
promociones      → códigos de descuento
metodosEnvio     → métodos de envío
metodosPago      → métodos de pago
configuracion    → datos del negocio
mensajes         → mensajes de contacto
```

> Las bases de Firestore y Storage suelen crear la colección al primer uso.
> Los datos de ejemplo (en memoria) **no** migran solos a la nube: usá el
> script `seedFirebase.js` o cargalos desde el panel admin.

---

## 🛡️ Seguridad de tus credenciales

Tu archivo `.env` está en `.gitignore`, así que **no se sube a GitHub**.

> ⚠️ La `apiKey` de Firebase no es un secreto en sí (es pública en apps web),
> pero mantener las reglas de Firestore/Storage correctas es lo que protege
> tus datos reales. Para producción, configurá reglas seguras (no `if true`).

---

## 🧠 Resumen del estado actual

```
Credenciales en .env  → ❌  (listo, ya están cargadas)
Authentication activo → ❓ (fijate en la consola)
Firestore activo      → ❓ (fijate en la consola)
Storage activo        → ❓ (fijate en la consola)
```

Cuando actives los 3 servicios en Firebase Console, tu tienda tendrá datos
reales en la nube de Google. 💖

