# 🌸 Bella Imagen - Tienda Online & Panel de Administración

Aplicación web moderna E-commerce y Panel de Control para **Bella Imagen**, desarrollada con React 19, Vite, Bootstrap, Firebase y desplegada en Vercel.

---

## 🚀 Demo en Vivo
👉 [Bella Imagen en Vercel](https://bella-imagen.vercel.app)

---

## 🛠️ Tecnologías Utilizadas

- **Frontend:** React 19, Vite 8, React Router DOM v7, React Icons, Bootstrap 5.
- **Backend / Persistencia:** Firebase (Firestore, Authentication, Storage) + capa de abstracción local en memoria/localStorage.
- **Despliegue:** Vercel Hosting.
- **Estilos:** CSS3 personalizado responsive + Bootstrap 5.

---

## ⚙️ Características Principales

### 🛒 Tienda Pública (`/`)
- Catálogo de productos interactivo con filtros por categoría y buscador.
- Detalle de producto con imágenes, descripción, disponibilidad y control de stock.
- Carrito de compras dinámico con persistencia en `localStorage`.
- Checkout inteligente con:
  - Selección dinámica de métodos de envío y costo automático (con opción de Envío Gratis).
  - Aplicación de cupones y códigos de descuento en tiempo real.
  - Formas de pago configurables (Mercado Pago, Transferencia, Efectivo).
  - Envío automático de la orden formateada a **WhatsApp**.
- Formulario de contacto integrado directamente con el panel de administración.

### 🔐 Panel de Administración (`/admin`)
- Autenticación segura para administradores.
- **Dashboard & Estadísticas:** KPIs de ventas totales, pedidos, ticket promedio, gráficos por estado y ranking de productos más vendidos.
- **CRUD de Productos:** Crear, editar, cambiar precios/stock, activar/desactivar y eliminar productos en tiempo real.
- **CRUD de Categorías:** Organización flexible del catálogo.
- **CRUD de Promociones:** Creación de cupones con descuento por porcentaje o monto fijo.
- **Gestión de Envíos y Pagos:** Configuración de métodos de envío, costos, envío gratis y métodos de pago recibidos.
- **Gestión de Pedidos:** Listado de ventas, detalle del pedido y actualización de estados en tiempo real (Pendiente, Enviado, Entregado, Cancelado).
- **Mensajes:** Recepción y gestión de consultas enviadas desde la web.
- **Configuración:** Edición centralizada de WhatsApp, montos mínimos, redes sociales y textos de la web.

---

## 💻 Instalación y Desarrollo Local

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/vaninacoria34/bella-imagen.git
   cd BELLA-IMAGEN/bella-imagen
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

4. Compilar para producción:
   ```bash
   npm run build
   ```

---

## 📖 Manual de Uso - Guía Paso a Paso para el Cliente

### 1. 🛍️ Navegación del Cliente (Tienda Pública)
1. **Explorar Productos:** El cliente puede filtrar por categorías, buscar productos y ver su stock y detalles.
2. **Carrito de Compras:** Puede agregar productos, modificar cantidades o eliminarlos en tiempo real.
3. **Checkout:** Ingresa sus datos de entrega, selecciona el método de envío y de pago, aplica cupones de descuento y finaliza la compra enviando la orden directamente al WhatsApp del negocio.

---

### 2. 🔑 Acceso al Panel de Administración
- **Ruta de acceso:** `/admin` (ej: `https://tu-tienda.vercel.app/admin`).
- Ingresar credenciales de administrador para acceder a todas las herramientas de gestión.

---

### 3. 📦 Gestión de Productos (`/admin/products`)
- **Agregar Producto:** Clic en **"+ Nuevo Producto"**, completar título, categoría, precio, stock, imagen y descripción.
- **Editar:** Clic en el ícono ✏️ para modificar cualquier dato (precios, stock, etc.).
- **Eliminar:** Clic en el ícono 🗑️. El producto se eliminará inmediatamente en tiempo real.

---

### 4. 🏷️ Gestión de Categorías (`/admin/categories`)
- Crear, modificar o eliminar categorías para clasificar los productos del catálogo.

---

### 5. 📢 Gestión de Promociones y Cupones (`/admin/promotions`)
- Crear códigos de descuento (ej: `VERANO20`, `BIENVENIDA10`).
- Definir si el descuento es **por porcentaje (%)** o **monto fijo ($)**.
- Activar o desactivar cupones en cualquier momento.

---

### 6. 🚚 Envíos y 💳 Métodos de Pago (`/admin/shipments` y `/admin/payments`)
- Configurar opciones de entrega (ej: Retiro en Local, Correo, Cadetería) y establecer el monto mínimo para **Envío Gratis**.
- Activar/desactivar formas de pago recibidas (Mercado Pago, CBU/Alias para Transferencias, Efectivo).

---

### 7. 🛒 Gestión de Pedidos (`/admin/orders`)
- Ver el historial completo de ventas con detalles de cliente, productos, cupón aplicado y total.
- Cambiar el estado del pedido: *Pendiente* 🟡, *Enviado* 🔵, *Entregado* 🟢 o *Cancelado* 🔴.

---

### 8. 💬 Mensajes de Contacto (`/admin/messages`)
- Revisar y gestionar los mensajes enviados por clientes desde el formulario de contacto web.

---

### 9. ⚙️ Configuración del Negocio (`/admin/settings`)
- Editar número de WhatsApp, nombre de la vendedora, compra mínima, redes sociales y textos informativos.

---

### 10. 📊 Estadísticas y Reportes (`/admin/stats`)
- Consultar métricas del negocio: total de ventas, cantidad de pedidos, ticket promedio y lista de productos más vendidos.

---

## 👩‍💻 Desarrollado por
**Vanina Coria** - Desarrollo Web Full Stack & Soporte Técnico.
