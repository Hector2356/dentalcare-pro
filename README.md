# 🦷 DentalCare Pro - Sistema de Gestión Dental

Un sistema de gestión integral para clínicas dentales, construido con tecnologías modernas para optimizar la administración de pacientes, citas y membresías.

## ✨ Características Principales

### 🏥 Gestión de Pacientes
- Registro completo de pacientes con historial médico
- Gestión de citas y calendario integrado
- Seguimiento de tratamientos dentales
- Sistema de notificaciones automáticas

### 👥 Gestión de Roles
- **Administrador**: Control total del sistema
- **Doctor**: Gestión de pacientes y citas
- **Paciente**: Acceso a su información y citas

### 💳 Sistema de Membresías
- Membresías premium con beneficios exclusivos
- Gestión de suscripciones y pagos
- Descuentos especiales para miembros

### 📅 Calendario Inteligente
- Gestión de disponibilidad de doctores
- Sistema de bloques de tiempo
- Confirmación automática de citas
- Recordatorios por email/SMS

## 🛠️ Stack Tecnológico

### Frontend
- **⚡ Next.js 15** - Framework React con App Router
- **📘 TypeScript 5** - Tipado seguro y desarrollo robusto
- **🎨 Tailwind CSS 4** - Diseño utility-first
- **🧩 shadcn/ui** - Componentes UI de alta calidad
- **🎯 Lucide React** - Iconos modernos y consistentes
- **🌈 Framer Motion** - Animaciones fluidas
- **🎨 Next Themes** - Soporte para modo oscuro/claro

### Backend & Base de Datos
- **🗄️ Prisma ORM** - Gestión de base de datos tipo-safe
- **🔐 NextAuth.js** - Sistema de autenticación completo
- **🌐 Socket.IO** - Comunicación en tiempo real
- **📊 Zustand** - Manejo de estado del cliente
- **🔄 TanStack Query** - Sincronización de datos del servidor

### Base de Datos
- **🗄️ SQLite** - Base de datos ligera y eficiente
- **🔍 Prisma Client** - Acceso tipo-safe a los datos

## 🚀 Quick Start

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/dentalcare-pro.git
cd dentalcare-pro

# Instalar dependencias
npm install

# Configurar base de datos
npm run db:push

# Iniciar servidor de desarrollo
npm run dev
```

### Variables de Entorno

Crea un archivo `.env.local`:

```env
# Base de datos
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET="tu-secreto-aqui"
NEXTAUTH_URL="http://localhost:3000"

# Configuración del servidor
PORT=3000
HOST=localhost
```

## 📁 Estructura del Proyecto

```
src/
├── app/                    # Páginas Next.js App Router
│   ├── api/               # Rutas API
│   ├── dashboard/         # Panel principal
│   ├── doctor/            # Sección doctores
│   ├── patient/           # Sección pacientes
│   └── admin/             # Sección administración
├── components/            # Componentes React
│   ├── ui/               # Componentes shadcn/ui
│   └── appointment-modal.tsx  # Modal de citas
├── hooks/                # Hooks personalizados
├── lib/                  # Utilidades y configuración
├── services/             # Servicios de API
└── stores/               # Manejo de estado
```

## 🎯 Funcionalidades Detalladas

### 🔐 Autenticación y Autorización
- Login con email y contraseña
- Registro de nuevos usuarios
- Protección de rutas por rol
- Refresh tokens automáticos
- Cambio de contraseña seguro

### 📊 Dashboard Principal
- Estadísticas en tiempo real
- Gráficos de pacientes y citas
- Vista rápida de actividades recientes
- Accesos directos a funciones principales

### 🗓️ Gestión de Citas
- Creación de citas con modal intuitivo
- Disponibilidad en tiempo real
- Confirmación y cancelación
- Recordatorios automáticos
- Historial de citas por paciente

### 👤 Gestión de Pacientes
- Ficha completa del paciente
- Historial médico dental
- Tratamientos realizados
- Documentos adjuntos
- Notas privadas del doctor

### 💎 Sistema de Membresías
- Membresía Básica (gratuita)
- Membresía Premium (beneficios exclusivos)
- Gestión de pagos
- Renovación automática
- Descuentos especiales

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo
npm run build        # Build para producción
npm run start        # Servidor de producción
npm run lint         # Linting del código

# Base de datos
npm run db:push      # Sincronizar schema
npm run db:studio    # Prisma Studio
npm run db:seed      # Poblar base de datos

# Servidor personalizado
npm run server       # Servidor con Socket.IO
```

## 🌐 Despliegue

### Vercel (Recomendado)

1. Conectar repositorio a Vercel
2. Configurar variables de entorno
3. Deploy automático en cada push

```bash
# Build para Vercel
npm run build
```

### Docker

```bash
# Construir imagen
docker build -t dentalcare-pro .

# Ejecutar contenedor
docker run -p 3000:3000 dentalcare-pro
```

### GitHub Pages

1. Hacer fork del repositorio
2. Activar GitHub Pages
3. Configurar source: `gh-pages`

## 🧪 Modo de Prueba

El proyecto incluye un modo de prueba para desarrollo:

```typescript
// Activar modo prueba
const TEST_MODE = true;
```

- Usuarios pre-configurados
- Datos de ejemplo
- Funcionalidades simuladas

## 📱 Responsive Design

- **Mobile-first**: Optimizado para dispositivos móviles
- **Tablet**: Adaptación perfecta para tablets
- **Desktop**: Experiencia completa en escritorio
- **Touch-friendly**: Interacciones táctiles optimizadas

## 🔒 Seguridad

- Validación de inputs con Zod
- Protección contra CSRF
- Headers de seguridad
- Sanitización de datos
- Autenticación JWT segura

## 🌍 Temas

- Modo claro/oscuro automático
- Detección de preferencias del sistema
- Persistencia de preferencias
- Transiciones suaves

## 📈 Performance

- Optimización de imágenes automáticas
- Code splitting por páginas
- Lazy loading de componentes
- Caching inteligente
- Bundle optimization

## 🤝 Contribuir

1. Fork del proyecto
2. Crear feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit de cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

- 📧 Email: soporte@dentalcare.pro
- 💬 Discord: [Comunidad DentalCare](https://discord.gg/dentalcare)
- 📖 Documentación: [docs.dentalcare.pro](https://docs.dentalcare.pro)

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/) - Framework React
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [shadcn/ui](https://ui.shadcn.com/) - Componentes UI
- [Prisma](https://www.prisma.io/) - ORM
- [NextAuth.js](https://next-auth.js.org/) - Autenticación

---

Built con ❤️ para la comunidad dental. ¡Mejorando la gestión de clínicas dentales! 🦷✨