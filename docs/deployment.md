# Despliegue gratuito

## Opción recomendada

Para desplegar rápido y gratis:

1. Base de datos: Aiven MySQL Free Tier.
2. Backend: Render Web Service Free.
3. Frontend: Vercel Hobby.

Esta combinación mantiene el proyecto actual sin migrar de MySQL a otro motor. Render puede dormir el backend por inactividad; para un MVP o evidencia académica es aceptable.

## 1. Crear la base de datos en Aiven

1. Crear cuenta en Aiven.
2. Crear servicio `MySQL`.
3. Elegir el plan gratuito.
4. Copiar estos datos de conexión:
   - Host
   - Port
   - User
   - Password
   - Database
5. Guardarlos para las variables del backend.

## 2. Desplegar backend en Render

1. Entrar a Render.
2. Crear `New Web Service`.
3. Conectar el repositorio de GitHub.
4. Configurar:
   - Root Directory: `backend`
   - Runtime: `Node`
   - Build Command: `npm install && npm run migrate && npm run seed:admin`
   - Start Command: `npm start`
5. Variables de entorno:

```env
PORT=10000
DB_HOST=<host-aiven>
DB_USER=<user-aiven>
DB_PASSWORD=<password-aiven>
DB_NAME=<database-aiven>
JWT_SECRET=<cadena-larga-segura>
JWT_EXPIRES_IN=8h
ADMIN_USERNAME=admin
ADMIN_PASSWORD=<clave-segura>
ADMIN_NAME=Administrador
ADMIN_EMAIL=admin@tu-dominio.com
```

Render asigna el puerto por variable `PORT`; no uses `3118` en producción.

## 3. Desplegar frontend en Vercel

1. Entrar a Vercel.
2. Importar el repositorio desde GitHub.
3. Configurar:
   - Framework Preset: `Vite`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Variable de entorno:

```env
VITE_API_URL=https://<tu-backend-render>.onrender.com/api
```

5. Deploy.

Si usas Vercel Services para desplegar frontend y backend en un solo proyecto, usa esta variable en Vercel:

```env
VITE_API_URL=/api
```

## 4. Verificación

1. Abrir la URL de Vercel.
2. Entrar con el usuario coordinador configurado en Render.
3. Ir a `Usuarios`.
4. Crear un instructor y un aprendiz.
5. Cerrar sesión.
6. Validar que una ruta protegida redirige al login.

## Alternativas gratuitas

### Todo en Render

- Backend en Render Web Service Free.
- Frontend en Render Static Site Free.
- DB en Aiven MySQL Free Tier.
- Ventaja: todo queda en una sola plataforma excepto DB.
- Desventaja: Vercel suele ser más directo para Vite.

### Railway

- Puede desplegar backend y base de datos muy rápido.
- Tiene prueba con créditos gratuitos.
- No es la mejor opción si necesitas gratis indefinido.

### Filess.io para MySQL

- Opción simple para una base MySQL pequeña.
- Útil si quieres evitar configurar Aiven.
- Límite de almacenamiento bajo; mejor solo para demos.

## Recomendación final

Usa Aiven + Render + Vercel:

- Aiven resuelve MySQL gratis.
- Render corre Express sin cambiar backend.
- Vercel despliega React/Vite rápido y con HTTPS.

## Referencias oficiales

- Aiven Free Tier: https://aiven.io/free-tier
- Aiven MySQL Free Tier: https://aiven.io/docs/products/mysql/concepts/mysql-free-tier
- Render Free: https://render.com/docs/free
- Render Web Services: https://render.com/docs/web-services
- Vercel Hobby: https://vercel.com/docs/plans/hobby
- Railway Pricing: https://railway.com/pricing
- Filess.io: https://filess.io/
