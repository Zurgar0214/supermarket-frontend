# Supermarket Frontend SPA

Frontend tipo SPA para administrar un supermercado con React + Vite. Esta versión ya está conectada con el backend para los módulos iniciales de:

- Usuarios
- Proveedores
- Productos

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

## Estructura principal

```text
src/
├── components/          # Modales y diálogos reutilizables
├── layouts/             # DashboardLayout
├── pages/               # Vistas principales
├── services/            # Conexión Axios con backend
├── utils/               # Formateadores y helpers
├── global.css           # Estilos globales
├── App.jsx
└── main.jsx
```
