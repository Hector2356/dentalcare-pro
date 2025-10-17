# 🚀 Guía de Despliegue Vercel - DentalCare Pro

## 📋 Variables de Entorno Configuradas ✅

```
NEXTAUTH_URL=https://dentalcare-pro.vercel.app
NEXTAUTH_SECRET=47zvNSa7GsKydUg44df80ygcC2wa58aeGO9bqVLIB34=
NODE_ENV=production
```

## 🔥 PASO 1: Crear Base de Datos Vercel

### 1.1 Ve a Vercel Dashboard
1. Inicia sesión en [vercel.com](https://vercel.com)
2. Ve a tu proyecto `dentalcare-pro`
3. Click en **Storage** (en el menú lateral)

### 1.2 Crear PostgreSQL Database
1. Click en **Create Database**
2. Selecciona **PostgreSQL**
3. Configura:
   - **Database Name**: `dentalcare-db`
   - **Region**: `Washington, D.C.` (o la más cercana a ti)
4. Click en **Create Database**

### 1.3 Obtener Credenciales
Una vez creada la BD, Vercel te mostrará:

```bash
# Copia estas variables - las necesitarás
DATABASE_URL="postgresql://username:password@host:5432/dbname?sslmode=require"
DIRECT_URL="postgresql://username:password@host:5432/dbname?sslmode=require"
```

## 🔥 PASO 2: Configurar Variables de Entorno en Vercel

### 2.1 Ve a Settings
1. En tu proyecto Vercel → **Settings**
2. Click en **Environment Variables**

### 2.2 Añade todas las variables:
```bash
# Variables que ya tienes:
NEXTAUTH_URL=https://dentalcare-pro.vercel.app
NEXTAUTH_SECRET=47zvNSa7GsKydUg44df80ygcC2wa58aeGO9bqVLIB34=
NODE_ENV=production

# Variables de la base de datos (del paso anterior):
DATABASE_URL=postgresql://username:password@host:5432/dbname?sslmode=require
DIRECT_URL=postgresql://username:password@host:5432/dbname?sslmode=require
```

**Importante**: Selecciona **Production**, **Preview**, y **Development** para cada variable.

## 🔥 PASO 3: Deploy del Proyecto

### 3.1 Trigger Deploy
1. Ve a **Deployments** en tu proyecto
2. Click en **Redeploy** (o espera el siguiente deploy automático)
3. El build tomará 2-3 minutos

### 3.2 Verificar Deploy
- El deploy debe ser **✅ Ready**
- Si hay errores, revisa los logs en **Build Logs**

## 🔥 PASO 4: Sincronizar Base de Datos

### 4.1 Generar Prisma Client
El deploy de Vercel ejecutará automáticamente:
```bash
npx prisma generate
npx prisma db push
```

### 4.2 Verificar Tablas
Puedes verificar en Vercel Storage → **Browse** que se crearon las tablas:
- users
- appointments
- memberships
- medical_history
- notifications
- time_slots

## 🔥 PASO 5: Primer Usuario y Configuración

### 5.1 Registrar Primer Usuario
1. Visita: `https://dentalcare-pro.vercel.app/register`
2. Crea una cuenta con email y contraseña
3. Este será tu primer usuario (rol: PATIENT por defecto)

### 5.2 Convertir en Administrador
Para convertir el primer usuario en ADMIN:

**Opción A: Via Vercel Storage UI**
1. Ve a **Storage** → **Browse**
2. Busca la tabla `users`
3. Encuentra tu usuario y cambia `role` a `ADMIN`

**Opción B: Via Prisma Studio (local)**
```bash
# Si tienes acceso local
npx prisma studio --browser
```

## 🔥 PASO 6: Probar Funcionalidades

### 6.1 URLs Importantes
- **Principal**: `https://dentalcare-pro.vercel.app`
- **Dashboard**: `https://dentalcare-pro.vercel.app/dashboard`
- **Login**: `https://dentalcare-pro.vercel.app/login`
- **Register**: `https://dentalcare-pro.vercel.app/register`

### 6.2 Funcionalidades a Probar
1. ✅ Login y registro
2. ✅ Dashboard principal
3. ✅ Crear pacientes (como admin/doctor)
4. ✅ Programar citas
5. ✅ Ver calendario
6. ✅ Sistema de membresías

## 🚨 Troubleshooting Común

### Error: "Database connection failed"
- Verifica que `DATABASE_URL` y `DIRECT_URL` sean correctas
- Asegúrate que no haya espacios extras
- Verifica que la BD esté en la misma región que el proyecto

### Error: "NextAuth error"
- Verifica que `NEXTAUTH_URL` sea exacta (sin / al final)
- Genera nuevo `NEXTAUTH_SECRET` si es necesario

### Error: "Build failed"
- Revisa los logs en Vercel
- Verifica que todas las dependencias estén en package.json

## 🎟️ Plan Vercel Recomendado

### Hobby (Gratis) - Para empezar
- ✅ 100GB bandwidth/mes
- ✅ Dominio personalizado
- ✅ PostgreSQL básico

### Pro ($20/mes) - Para producción
- ✅ Bandwidth ilimitado
- ✅ Edge Functions ilimitadas
- ✅ Analytics avanzado

## 🌟 Funcionalidades Disponibles en Producción

### ✅ Totalmente Funcionales:
- 🏥 Gestión completa de pacientes
- 📅 Sistema de citas y calendario
- 👥 Roles de usuario (Admin/Doctor/Paciente)
- 💳 Sistema de membresías
- 🔐 Autenticación segura
- 📱 Responsive design
- 🎨 UI moderna con shadcn/ui

### ⚠️ Limitaciones (Plan Gratis):
- Socket.IO no funciona en serverless (necesitaría adaptación)
- Límites de conexiones simultáneas
- Tiempo máximo de función: 10 segundos

## 🚀 Próximos Pasos Opcionales

1. **Dominio personalizado**: Settings → Domains
2. **Analytics**: Añadir Google Analytics
3. **Monitoreo**: Configurar alertas
4. **Backup**: Configurar backups automáticos

## 🎉 ¡Listo para Producción!

Tu sistema DentalCare Pro estará funcionando profesionalmente en:
**https://dentalcare-pro.vercel.app** 🦷✨

---

**¿Necesitas ayuda con algún paso específico? ¡Estoy aquí para ayudarte!** 🚀