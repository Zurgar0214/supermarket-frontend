# Supermarket Frontend SPA

Este proyecto es una aplicación frontend tipo Single Page Application (SPA) para un dashboard de administración de supermercado, construida con React y Vite.

## 🏗 Diseño y Arquitectura

El proyecto sigue una arquitectura limpia orientada a componentes, sin dependencias de librerías de UI externas (Bootstrap, Tailwind, etc.), utilizando únicamente CSS Vanilla para un diseño a medida, ligero y profesional.

**Estructura de Carpetas:**

```text
src/
├── components/          # Componentes UI reutilizables (Modales, Diálogos de confirmación, etc)
├── layouts/             # Contenedores estructurales (DashboardLayout)
├── pages/               # Vistas principales de la aplicación
├── global.css           # Sistema de diseño global (variables, reset, utilidades, layout)
├── App.jsx              # Enrutador basado en estado y contenedor principal
└── main.jsx             # Punto de entrada de React
```

### 🛣 Rutas (Navegación Basada en Estado)
Para mantener las dependencias al mínimo, la aplicación utiliza un **enrutador manual basado en estado** (`useState` en `App.jsx`), en lugar de `react-router-dom`. 

Las vistas disponibles son:
- **Dashboard**: Panel principal con tarjetas de resumen del sistema.
- **Products**: Gestión completa de inventario (CRUD). Muestra la lista de productos con insignias de stock.
- **Providers**: Administración de proveedores del supermercado.
- **Sales**: Registro y consulta de transacciones de venta.
- **Users**: Panel de control para roles y acceso de usuarios.

## 🚀 Requisitos Previos

Asegúrate de tener instalado en tu sistema:
- [Node.js](https://nodejs.org/) (Versión 18 o superior recomendada)
- Un gestor de paquetes (`npm` viene con Node.js, pero puedes usar `yarn` o `pnpm`)

## 🛠 Instalación y Configuración

Sigue estos pasos para levantar el entorno de desarrollo localmente:

1. **Clona o navega al directorio del proyecto**
   Asegúrate de estar ubicado en la carpeta raíz del proyecto frontend de supermercado:
   ```bash
   cd supermarket-frontend
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Inicia el servidor de desarrollo**
   Vite provee un servidor de inicio muy rápido. Ejecuta:
   ```bash
   npm run dev
   ```

4. **Accede a la aplicación**
   Abre tu navegador web y dirígete a la URL que indica la consola, normalmente:
   [http://localhost:5173/](http://localhost:5173/)

## 🎨 Particularidades Técnicas

- **Diseño Responsive:** La plataforma y el menú lateral (`Sidebar`) están completamente optimizados para PC y dispositivos móviles.
- **Formularios con Validación Inline:** Formularios controlados por estado (`ProductModal.jsx`) validando en tiempo real sin recargas.
- **Integración API (Pendiente):** Actualmente los datos mostrados son `MOCK` (datos de prueba locales) para facilitar el diseño y maquetación inicial. Las llamadas asíncronas para leer y escribir datos al Backend estarán ubicadas en la capa correspondiente en fases posteriores de desarrollo.
