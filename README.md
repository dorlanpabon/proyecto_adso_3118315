# Proyecto ADSO 3118315

Aplicación web para la gestión y calificación de evidencias académicas. El backend expone autenticación JWT y CRUD de usuarios; el frontend ofrece login, rutas protegidas, dashboard y gestión de usuarios por rol.

## Stack

- Backend: Node.js, Express, MySQL/MariaDB, JWT, bcrypt.
- Frontend: React, Vite, Tailwind CSS, DaisyUI.
- Base de datos local recomendada: MariaDB de XAMPP.

## Puertos locales

- Backend: `http://localhost:3118`
- Frontend: `http://localhost:3119`
- API: `http://localhost:3118/api`

## Requisitos

- Node.js LTS o estable.
- npm.
- MySQL/MariaDB.

## Configuración backend

```bash
cd backend
npm install
copy .env.example .env
npm run migrate
npm run seed:admin
npm run dev
```

Credenciales iniciales:

- Usuario: `admin`
- Contraseña: `123`
- Rol: `coordinador`

## Configuración frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Abrir:

```text
http://localhost:3119/login
```

## Scripts útiles

Backend:

```bash
npm run dev
npm run migrate
npm run seed:admin
npm start
```

Frontend:

```bash
npm run dev
npm run lint
npm run build
npm run preview
```

## Variables de entorno

Backend:

```env
PORT=3118
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=proyecto_adso_3118315
JWT_SECRET=change_this_secret
JWT_EXPIRES_IN=8h
ADMIN_USERNAME=admin
ADMIN_PASSWORD=123
ADMIN_NAME=Administrador
ADMIN_EMAIL=admin@local.test
```

Frontend:

```env
VITE_API_URL=http://localhost:3118/api
```

## Despliegue

La guía paso a paso está en [docs/deployment.md](docs/deployment.md).

