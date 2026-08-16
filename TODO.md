# TODO: Promociones

## Objetivo
Reemplazar el placeholder de "Promociones" por un CRUD completo en el panel admin (crear, editar, eliminar, activar/desactivar) e integrarlo con el checkout de la tienda: el cliente puede ingresar un código de descuento y se aplica al total.

## Pasos a completar

### ✅ Paso 1: Servicio promotionService.js
- [x] Array en memoria con 3 promociones semilla (BIENVENIDA10 %, BIJA3000 fijo, CARRITO20 %)
- [x] Campos: id, codigo, tipo (porcentaje/fijo), valor, descripcion, estado, fechaInicio, fechaFin
- [x] Funciones: getPromotions, getPromotionById, getPromotionByCode, getActivePromotions, createPromotion, updatePromotion, deletePromotion, togglePromotionStatus
- [x] getPromotionByCode insensible a mayúsculas

### ✅ Paso 2: Hook usePromotions.js
- [x] Expone promotions, loading, error, refresh, addPromotion, editPromotion, removePromotion, toggleStatus

### ✅ Paso 3: Componente PromotionTable.jsx
- [x] Tabla responsive con buscador, badge de estado, tipo de descuento, acciones

### ✅ Paso 4: Componente PromotionFormModal.jsx
- [x] Modal con campos: código, tipo, valor, descripción, estado, fechaInicio, fechaFin

### ✅ Paso 5: Página PromotionsCrud.jsx
- [x] Página CRUD completa en `/admin/promotions`

### ✅ Paso 6: Conectar en App.jsx
- [x] Reemplazar AdminPlaceholder por PromotionsCrud

### ✅ Paso 7: DeleteConfirmModal.jsx
- [x] Agregado PromotionDetails y render para itemType="promotion"

### ✅ Paso 8: Integrar checkout
- [x] Campo de "Código de promoción" en el checkout
- [x] Validar código con getPromotionByCode (activas)
- [x] Calcular descuento (porcentaje o fijo) sobre el subtotal
- [x] Mostrar descuento y total final en el resumen
- [x] Incluir código y descuento en el mensaje de WhatsApp
- [x] Pasar promocion y descuento a createOrder

### ✅ Paso 9: orderService.js
- [x] createOrder guarda promocion y descuento
- [x] total = subtotal - descuento + envio

### ✅ Paso 10: OrderDetailModal.jsx
- [x] Muestra el descuento (y código) en los totales del pedido

### ✅ Paso 11: Verificación
- [x] `npm run build` → 0 errores
- [x] Probar en navegador: crear/editar/desactivar promoción → se refleja en checkout

## Archivos a crear
- `src/admin/services/promotionService.js`
- `src/admin/hooks/usePromotions.js`
- `src/admin/components/PromotionTable.jsx`
- `src/admin/components/PromotionFormModal.jsx`
- `src/admin/pages/PromotionsCrud.jsx`

## Archivos a modificar
- `src/App.jsx`
- `src/components/Checkout.jsx`
- `src/admin/services/orderService.js`
- `src/admin/components/DeleteConfirmModal.jsx`
- `src/admin/components/OrderDetailModal.jsx`

---

# TODO: Opción B — Formas de pago

## Objetivo
Reemplazar el placeholder de "Formas de pago" por un CRUD completo en el panel admin (crear, editar, eliminar, activar/desactivar) e integrarlo con el checkout de la tienda (mostrar solo los métodos activos y que el cliente elija uno).

## Pasos a completar

### ✅ Paso 1: Servicio paymentMethodService.js
- [x] Array en memoria con 3 métodos semilla (Mercado Pago, Transferencia bancaria, Efectivo)
- [x] Campos: id, nombre, icono, descripcion, datos, estado, orden
- [x] Funciones: getPaymentMethods, createPaymentMethod, updatePaymentMethod, deletePaymentMethod, togglePaymentMethodStatus

### ✅ Paso 2: Hook usePaymentMethods.js
- [x] Expone paymentMethods, loading, error, refresh, addMethod, editMethod, removeMethod, toggleStatus

### ✅ Paso 3: Componente PaymentMethodTable.jsx
- [x] Tabla responsive con buscador, badge de estado, acciones (editar/eliminar/activar)
- [x] Vista móvil en cards

### ✅ Paso 4: Componente PaymentMethodFormModal.jsx
- [x] Modal con campos: nombre, icono, descripción, datos, estado, orden

### ✅ Paso 5: Página PaymentsMethodsCrud.jsx
- [x] Página CRUD completa con header, tabla y modales

### ✅ Paso 6: Conectar en App.jsx
- [x] Reemplazar PaymentsMethodsPlaceholder por PaymentsMethodsCrud

### ✅ Paso 7: Integrar checkout
- [x] Mostrar métodos de pago activos en el checkout
- [x] El cliente selecciona un método de pago
- [x] Incluir el método elegido en el mensaje de WhatsApp
- [x] Pasar el método de pago al pedido registrado

### ✅ Paso 8: Verificación
- [x] `npm run build` → 0 errores (✓ 91 modules transformed)
- [x] Probar en navegador: crear/editar/desactivar método → se refleja en checkout

## Archivos a crear
- `src/admin/services/paymentMethodService.js`
- `src/admin/hooks/usePaymentMethods.js`
- `src/admin/components/PaymentMethodTable.jsx`
- `src/admin/components/PaymentMethodFormModal.jsx`
- `src/admin/pages/PaymentsMethodsCrud.jsx`

## Archivos a modificar
- `src/App.jsx`
- `src/components/Checkout.jsx`

---

# TODO: Opción 1 — Envíos

## Objetivo
Reemplazar el placeholder de "Envíos" por un CRUD completo en el panel admin (crear, editar, eliminar, activar/desactivar) e integrarlo con el checkout de la tienda: el cliente elige un método de envío configurable y el costo se calcula según el método, respetando el "envío gratis desde X".

## Pasos a completar

### ✅ Paso 1: Servicio shippingService.js
- [x] Array en memoria con 3 métodos semilla (Andreani $1.500, Correo Argentino $1.200, Retiro en local $0)
- [x] Campos: id, nombre, icono, descripcion, costo, tiempoEstimado, gratisDesde, estado, orden
- [x] Funciones: getShippingMethods, getActiveShippingMethods, getShippingMethodById, createShippingMethod, updateShippingMethod, deleteShippingMethod, toggleShippingMethodStatus

### ✅ Paso 2: Hook useShippingMethods.js
- [x] Expone shippingMethods, loading, error, refresh, addMethod, editMethod, removeMethod, toggleStatus

### ✅ Paso 3: Componente ShippingMethodTable.jsx
- [x] Tabla responsive con buscador, badge de estado, columnas costo/tiempo, acciones

### ✅ Paso 4: Componente ShippingMethodFormModal.jsx
- [x] Modal con campos: nombre, icono, descripción, costo, tiempoEstimado, gratisDesde (opcional), estado, orden

### ✅ Paso 5: Página ShipmentsCrud.jsx
- [x] Página CRUD completa en `/admin/shipments`

### ✅ Paso 6: Conectar en App.jsx
- [x] Reemplazar ShipmentsPlaceholder por ShipmentsCrud

### ✅ Paso 7: Integrar checkout
- [x] Cargar métodos de envío activos desde shippingService
- [x] Selector de envío dinámico con costo/tiempo y "Gratis" según gratisDesde
- [x] Calcular costoEnvio y pasarlo a createOrder (con metodoEnvioId)
- [x] Incluir el método de envío en el mensaje de WhatsApp
- [x] orderService.createOrder usa costoEnvio recibido (fallback si no llega)

### ✅ Paso 8: Verificación
- [x] `npm run build` → 0 errores
- [x] Probar en navegador: crear/editar/desactivar método → se refleja en checkout

## Archivos a crear
- `src/admin/services/shippingService.js`
- `src/admin/hooks/useShippingMethods.js`
- `src/admin/components/ShippingMethodTable.jsx`
- `src/admin/components/ShippingMethodFormModal.jsx`
- `src/admin/pages/ShipmentsCrud.jsx`

## Archivos a modificar
- `src/App.jsx`
- `src/components/Checkout.jsx`
- `src/admin/services/orderService.js`
- `src/admin/components/DeleteConfirmModal.jsx`

---

# TODO: Estadísticas (Dashboard de reportes)

## Objetivo
Reemplazar el placeholder de "Estadísticas" por una página de reportes con KPIs y desgloses calculados desde los datos reales del sistema (pedidos, productos, clientes, métodos de pago y envío).

## Pasos a completar

### ✅ Paso 1: Hook useStats.js
- [x] Consultas en paralelo: pedidos, productos, clientes, métodos de pago, métodos de envío
- [x] KPIs generales: ventas totales, pedidos, ticket promedio, clientes, envíos, productos, cancelados
- [x] Desglose por estado (cantidad y ventas)
- [x] Ventas por método de pago
- [x] Ventas por método de envío
- [x] Top productos más vendidos (cantidad y ventas)
- [x] Pedidos y ventas por mes (formato DD/MM/YYYY)

### ✅ Paso 2: Página Stats.jsx
- [x] Tarjetas KPI (ventas, pedidos, ticket promedio, clientes, productos, envíos, cancelados)
- [x] Gráfico de barras "Pedidos por estado"
- [x] "Productos más vendidos" con ranking
- [x] "Ventas por método de pago" y "Ventas por método de envío"
- [x] Tabla "Pedidos y ventas por mes"
- [x] Estados de carga y error con reintentar

### ✅ Paso 3: Conectar en App.jsx
- [x] Reemplazar StatsPlaceholder por Stats (`/admin/stats`)

### ✅ Paso 4: Verificación
- [x] `npm run build` → 0 errores (✓ built in 13.96s)
- [x] Probar en navegador: `/admin/stats` muestra KPIs reales

## Archivos a crear
- `src/admin/hooks/useStats.js`
- `src/admin/pages/Stats.jsx`

## Archivos a modificar
- `src/App.jsx`

---

# TODO: Configuración

## Objetivo
Reemplazar el placeholder de "Configuración" por un panel editable que centralice los datos del negocio (WhatsApp, compra mínima, envío gratis, contacto/redes, texto "Acerca de") y que estos valores se reflejen dinámicamente en la tienda pública (Checkout, Contact, TopBar, About).

## Pasos a completar

### ✅ Paso 1: Servicio settingsService.js
- [x] Objeto en memoria con la configuración del negocio
- [x] Campos: nombreNegocio, nombreVendedora, whatsapp, whatsappLink, instagram, direccion, ciudad, emailContacto, compraMinima, envioGratisDesde, horarioAtencion, acercaDe
- [x] Campos de desarrolladora: devNombre, devRol, devWhatsapp, devMensaje
- [x] Funciones: getSettings, updateSettings (con validaciones de WhatsApp y montos)

### ✅ Paso 2: Hook useSettings.js
- [x] Expone settings, loading, error, refresh, saveSettings

### ✅ Paso 3: Página Settings.jsx
- [x] Formulario completo con secciones: Datos del negocio, Contacto/Redes, Envíos y compra mínima, Desarrolladora/Soporte técnico
- [x] Bloque "Desarrolladora / Soporte técnico" con enlace a WhatsApp de Vanina Coria

### ✅ Paso 4: Conectar en App.jsx
- [x] Reemplazar SettingsPlaceholder por Settings (`/admin/settings`)

### ✅ Paso 5: Integrar Checkout.jsx
- [x] Cargar getSettings() y usar nombreVendedora, whatsapp/whatsappLink, compraMinima, envioGratisDesde
- [x] Saludo del mensaje de WhatsApp dinámico con la vendedora
- [x] Info de compra mínima y envíos gratis dinámicos

### ✅ Paso 6: Integrar TopBar.jsx
- [x] Cargar getSettings() y mostrar compra mínima y envío gratis dinámicos

### ✅ Paso 7: Integrar Contact.jsx
- [x] Cargar getSettings() para WhatsApp e Instagram
- [x] Nueva tarjeta "Soporte técnico" con enlace a WhatsApp de la desarrolladora Vanina Coria
- [x] Clase CSS .dev-bg agregada

### ✅ Paso 8: Integrar About.jsx
- [x] Cargar getSettings() y usar el texto "Acerca de" editable

### ✅ Paso 9: Verificación
- [x] `npm run build` → 0 errores
- [x] Editar configuración en `/admin/settings` → se refleja en tienda pública

## Archivos a crear
- `src/admin/services/settingsService.js`
- `src/admin/hooks/useSettings.js`
- `src/admin/pages/Settings.jsx`

## Archivos a modificar
- `src/App.jsx`
- `src/components/Checkout.jsx`
- `src/components/TopBar.jsx`
- `src/components/Contact.jsx`
- `src/components/About.jsx`
- `src/index.css`
</content>

---

# TODO: Mensajes

## Objetivo
Reemplazar el placeholder de ""Mensajes"" por un modulo que gestione las consultas recibidas del formulario de contacto de la tienda (ver detalle, marcar leido/respondido, eliminar).

## Pasos a completar

### Paso 1: Servicio messageService.js
- [x] Array en memoria con 5 mensajes semilla
- [x] Campos: id, nombre, email, telefono, asunto, mensaje, fecha, estado (Nuevo/Leido/Respondido), leido
- [x] Funciones: getMessages, getMessageById, createMessage, updateMessageStatus, deleteMessage
- [x] getMessages ordena por fecha descendente

### Paso 2: Hook useMessages.js
- [x] Expone messages, loading, error, refresh, updateStatus, removeMessage

### Paso 3: Componente MessageTable.jsx
- [x] Tabla responsive con buscador, badge de estado, contador de nuevos

### Paso 4: Componente MessageDetailModal.jsx
- [x] Modal de detalle con selector de estado (Nuevo/Leido/Respondido)

### Paso 5: Pagina MessagesCrud.jsx
- [x] Pagina CRUD completa en /admin/messages

### Paso 6: Conectar en App.jsx
- [x] Reemplazar AdminPlaceholder por MessagesCrud

### Paso 7: DeleteConfirmModal.jsx
- [x] Agregado MessageDetails y render para itemType=""message""

### Paso 8: Integrar Contact.jsx (formulario de contacto)
- [x] Formulario con nombre, email, telefono, asunto, mensaje
- [x] Validaciones y estado de envio
- [x] Registra el mensaje via createMessage → aparece en el panel admin

### Paso 9: Verificacion
- [x] npm run build sin errores

## Archivos a crear
- src/admin/services/messageService.js
- src/admin/hooks/useMessages.js
- src/admin/components/MessageTable.jsx
- src/admin/components/MessageDetailModal.jsx
- src/admin/pages/MessagesCrud.jsx

## Archivos a modificar
- src/App.jsx
- src/components/Contact.jsx
- src/admin/components/DeleteConfirmModal.jsx

---

# TODO: Firebase (arquitectura preparada, no activa)

## Objetivo
Dejar preparada toda la arquitectura de Firebase (Auth, Firestore, Storage) para que, cuando el usuario cree el proyecto en Firebase y pegue sus credenciales en `.env`, la app pueda empezar a usarla con el mínimo de cambios. NO activar Firebase todavía: la app sigue funcionando con datos en memoria.

## Pasos a completar

### ✅ Paso 1: Instalar dependencias de Firebase
- [x] Instalar submódulos modulares: @firebase/app, @firebase/auth, @firebase/firestore, @firebase/storage
- [x] Registrados en package.json (evita el metapaquete `firebase` que falla por errores EPERM en Windows)
- [x] Build pasa sin errores (108 modules transformed)

### ✅ Paso 2: Configuración central src/firebase.js
- [x] Lee credenciales SOLO desde variables de entorno (VITE_FIREBASE_*)
- [x] Nada hardcodeado
- [x] Exporta isFirebaseConfigured, app, auth, db, storage, isFirebaseEnabled
- [x] Si no hay credenciales, todo queda en null y la app usa datos locales

### ✅ Paso 3: Variables de entorno
- [x] .env.example (plantilla segura para compartir)
- [x] .env (local, en .gitignore, donde pegar las credenciales)
- [x] .gitignore actualizado para excluir .env y .env.*

### ✅ Paso 4: Capa de abstracción genérica firebaseService.js
- [x] Funciones: getCollectionData, getDocument, addDocument, updateDocument, deleteDocument, getNextId
- [x] Retornan null si Firebase inactivo (los servicios locales los ignoran)

### ✅ Paso 5: Repositorio por dominio firebaseRepository.js
- [x] Mapea cada dominio a su colección: productos, categorias, clientes, pedidos, promociones, metodosEnvio, metodosPago, configuracion, mensajes
- [x] Métodos por repo: getAll, getById, create, update (guardaFirebase si inactivo)

### ✅ Paso 6: Autenticación firebaseAuthService.js
- [x] signUpWithEmail, signInWithEmail, signOutUser, getCurrentUser, subscribeAuthState, sendPasswordReset
- [x] Guardias que lanan error claro si Firebase inactivo
- [x] Imports dinámicos (no rompen el build sin Firebase)

### ✅ Paso 7: Storage firebaseStorageService.js
- [x] uploadImage (sube a Storage y devuelve URL; si inactivo devuelve URL local)
- [x] deleteImage

### ✅ Paso 8: Seed opcional seedFirebase.js
- [x] Script manual para poblar Firestore con datos de ejemplo cuando se active
- [x] No se importa en ningún componente (solo se corre con node)

### ✅ Paso 9: Documentación para el usuario FIREBASE_SETUP.md
- [x] Explica en simple qué quedó listo
- [x] Paso a paso para crear el proyecto en Firebase y pegar credenciales
- [x] Activar Authentication, Firestore y Storage en la consola
- [x] Lista de colecciones que se crean
- [x] Solución de problemas comunes

### ✅ Paso 10: Verificación
- [x] `npm run build` → 0 errores (dist/index.html generado, BUILD OK)
- [x] La tienda sigue funcionando con datos locales (Firebase no activo)

## Archivos a crear
- `src/firebase.js`
- `src/admin/services/firebaseService.js`
- `src/admin/services/firebaseRepository.js`
- `src/admin/services/firebaseAuthService.js`
- `src/admin/services/firebaseStorageService.js`
- `src/admin/services/seedFirebase.js`
- `.env.example`
- `FIREBASE_SETUP.md`

## Archivos a modificar
- `.gitignore` (excluir .env)
- `package.json` (dependencias @firebase/*)
- `.env` (donde el usuario pegará sus credenciales)
- `TODO.md`
