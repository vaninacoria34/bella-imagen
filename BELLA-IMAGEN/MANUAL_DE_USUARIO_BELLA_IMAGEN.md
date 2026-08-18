# 🌸 Bella Imagen - Manual de Uso y Documentación del Sistema

Este documento contiene la guía completa para el cliente y el equipo de administración sobre el funcionamiento de la tienda online **Bella Imagen** y su Panel de Control.

---

## 🚀 Información General

- **Sitio Web:** [https://bella-imagen.vercel.app](https://bella-imagen.vercel.app)
- **Panel de Administración:** `https://bella-imagen.vercel.app/admin`
- **Desarrolladora & Soporte Técnico:** Vanina Coria

---

## 🛠️ Tecnologías y Arquitectura

- **Frontend:** React 19, Vite 8, React Router DOM v7, React Icons, Bootstrap 5.
- **Backend & Base de Datos:** Firebase (Firestore, Authentication, Storage) + capa de abstracción local en memoria/localStorage.
- **Hosting & Despliegue:** Vercel Hosting.

---

## 📖 Guía Paso a Paso para el Cliente y Administrador

### 1. 🛍️ Navegación del Cliente (Tienda Pública)
1. **Explorar Productos:** El cliente puede filtrar por categorías, buscar productos y ver su stock y detalles.
2. **Carrito de Compras:** Puede agregar productos, modificar cantidades o eliminarlos en tiempo real.
3. **Checkout:** Ingresa sus datos de entrega, selecciona el método de envío y de pago, aplica cupones de descuento y finaliza la compra enviando la orden directamente al WhatsApp del negocio.

---

### 2. 🔑 Acceso al Panel de Administración
- **Ruta de acceso:** `/admin` (ej: `https://bella-imagen.vercel.app/admin`).
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

## 👩‍💻 Soporte Técnico
**Vanina Coria** - Desarrollo Web Full Stack & Soporte Técnico.
