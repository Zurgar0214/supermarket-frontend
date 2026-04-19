# Supermarket Frontend SPA

## Integrantes

- Juan Diego Ramírez Muñoz
- Sandra Milena Ramos
- Juan Diego Varón Valencia

## Descripción

Frontend tipo **Single Page Application (SPA)** para administrar un supermercado, desarrollado con **React** y empaquetado con **Vite**.

## Arquitectura

La aplicación sigue una arquitectura cliente-servidor donde el frontend consume la API REST del backend mediante **Axios**. La navegación entre vistas se gestiona con **React Router DOM**, permitiendo cambiar de módulo sin recargar la página. La interfaz responsiva está construida con **Bootstrap 5** a través de **react-bootstrap**.

El proyecto se organiza en capas:

- **Services**: Centraliza todas las llamadas HTTP al backend (Axios).
- **Pages**: Vistas principales con lógica de estado y operaciones CRUD.
- **Components**: Elementos reutilizables como modales y diálogos de confirmación.
- **Layouts**: Estructura general del dashboard (sidebar, header, contenido).

### Módulos

- Productos
- Proveedores
- Usuarios
- Ventas

## Requisitos

- Node.js 18 o superior
- Backend ejecutándose normalmente en `http://localhost:3000`

## Instalación

```bash
npm install
npm run dev
```

Luego abre la URL que muestre Vite, normalmente:

```text
http://localhost:5173
```

## Conexión con el backend

Por defecto, el frontend consume rutas relativas `/api`. En desarrollo, `vite.config.js` tiene un proxy que envía esas peticiones hacia:

```text
http://localhost:3000
```

Por ejemplo:

```text
/api/products  ->  http://localhost:3000/api/products
/api/providers ->  http://localhost:3000/api/providers
/api/users     ->  http://localhost:3000/api/users
```

Si necesitas conectarte directamente a otra URL, crea un archivo `.env` tomando como base `.env.example`:

```env
VITE_API_URL=http://localhost:3000/api
```

## Módulos conectados

### Productos

Propiedades usadas según el backend:

- `id`
- `name`
- `description`
- `price`
- `stock`
- `providerId`
- `provider.name` cuando el backend lo incluye en la respuesta

### Proveedores

Propiedades usadas según el backend:

- `id`
- `name`
- `phone`
- `email`
- `city`

### Usuarios

Propiedades usadas según el backend:

- `id`
- `name`
- `email`
- `role`
- `isActive`

La contraseña se envía al crear usuario. Al editar, se deja opcional para no cambiarla accidentalmente.

## Tecnologías utilizadas

- **React** 19
- **Vite** 8
- **Axios** — consumo de API REST
- **React Router DOM** — navegación SPA
- **Bootstrap 5 / react-bootstrap** — diseño responsivo

## Estructura principal

```text
src/
├── components/          # Modales y diálogos reutilizables (react-bootstrap Modal)
├── layouts/             # DashboardLayout con sidebar responsive (Offcanvas)
├── pages/               # Vistas principales (Dashboard, Products, Providers, Users, Sales)
├── services/            # Conexión Axios con backend
├── utils/               # Formateadores y helpers
├── global.css           # Overrides mínimos sobre Bootstrap
├── App.jsx              # Definición de rutas (React Router DOM)
└── main.jsx             # Punto de entrada (BrowserRouter + Bootstrap CSS)
```
