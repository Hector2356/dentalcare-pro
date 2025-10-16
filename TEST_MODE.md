# 🧪 Modo de Pruebas - Sistema de Citas Médicas

## Overview

El Modo de Pruebas es un entorno seguro y aislado que permite realizar cambios, experimentos y pruebas sin afectar el sistema principal ni los datos de producción.

## ✨ Características

### 🔒 **Seguridad Total**
- Base de datos completamente aislada
- Datos de prueba con prefijos identificables
- Sin riesgo para datos reales

### 🤖 **Automatización**
- Generación automática de datos de prueba
- Limpieza programada de datos
- Mantenimiento sin intervención manual

### 🎛️ **Control Total**
- Panel de control intuitivo
- Configuración flexible
- Activación/desactivación instantánea

## 🚀 Cómo Usar

### 1. Acceder al Modo Pruebas

Hay varias formas de activar el modo de pruebas:

#### Desde la página principal:
1. Ve al panel de depuración en la página principal
2. Haz clic en "Modo Pruebas"

#### Directamente:
1. Navega a `/test` en tu navegador
2. Haz clic en "Activar Modo Pruebas"

### 2. Configurar el Modo

Una vez activado, puedes configurar:

- **Limpieza automática**: Intervalo de eliminación de datos (15min - 2horas)
- **Indicador visual**: Mostrar/ocultar indicador de modo pruebas
- **Base de datos**: Seleccionar entorno de pruebas

### 3. Generar Datos de Prueba

Usa el panel de control para:

- **Generar usuarios**: Crea cuentas de prueba para todos los roles
- **Crear membresías**: Genera planes de prueba
- **Simular citas**: Crea citas de ejemplo

### 4. Realizar Pruebas

Con el modo activo puedes:

- Probar nuevas funcionalidades
- Experimentar con la UI
- Testear flujos de usuario
- Realizar entrenamiento

### 5. Limpiar y Desactivar

Cuando termines:

1. Limpia los datos de prueba manualmente
2. Desactiva el modo pruebas
3. Vuelve al sistema normal

## 📋 Cuentas de Prueba Predefinidas

El sistema genera automáticamente estas cuentas:

### Paciente
- **Email**: `test_patient@example.com`
- **Password**: `Test123!@#`
- **ID**: `TEST_12345678`

### Doctor
- **Email**: `test_doctor@example.com`
- **Password**: `Test123!@#`
- **ID**: `TEST_87654321`

### Administrador
- **Email**: `test_admin@example.com`
- **Password**: `Test123!@#`
- **ID**: `TEST_11223344`

## 🎨 Indicadores Visuales

Cuando el modo pruebas está activo:

### Barra Superior
- Barra naranja pulsante en la parte superior
- Indicador "🧪 MODO PRUEBAS" en la esquina

### Panel Flotante
- Tarjeta naranja en la esquina superior izquierda
- Controles de configuración
- Estadísticas en tiempo real

### Resaltado de Elementos
- Formularios con bordes punteados naranjas
- Botones con borde al hacer hover
- Elementos con `data-test-id` muestran su identificador

## 🔧 Configuración Avanzada

### Variables de Entorno

```env
# Modo pruebas automático en desarrollo
NEXT_PUBLIC_TEST_MODE_AUTO=true

# Intervalo de limpieza por defecto (minutos)
NEXT_PUBLIC_TEST_CLEANUP_INTERVAL=30
```

### API Endpoints

#### Generar Datos de Prueba
```http
POST /api/test/seed
```

#### Limpiar Datos de Prueba
```http
POST /api/test/cleanup
Content-Type: application/json

{
  "olderThan": 30  // minutos
}
```

#### Estadísticas de Prueba
```http
GET /api/test/seed
```

## 🛡️ Medidas de Seguridad

### Aislamiento de Datos
- Prefijo `TEST_` en todos los datos de prueba
- Identificación con `[TEST]` en nombres
- Separación completa de datos reales

### Limpieza Automática
- Eliminación programada según configuración
- Limpieza manual disponible
- Sin acumulación de datos basura

### Prevención de Errores
- Indicadores visuales claros
- Confirmaciones para acciones destructivas
- Logs detallados para debugging

## 📊 Monitoreo y Logs

### Consola del Navegador
Todos los eventos del modo pruebas se registran en la consola:

```javascript
🧪 Test mode enabled
🧪 [TEST MODE] API Call: login [...]
✅ [TEST MODE] API Success: {...}
🧹 Cleaning up test data...
✅ Cleaned up 5 test records
```

### Logs del Servidor
El servidor registra todas las operaciones de prueba:

```bash
🌱 Starting test data seeding...
✅ Created test user: test_patient@example.com (PATIENT)
🧹 Starting test data cleanup older than 30 minutes
✅ Cleanup completed: 5 test records deleted
```

## 🔄 Integración con Desarrollo

### Durante el Desarrollo
1. Activa el modo pruebas al iniciar
2. Genera datos según necesites
3. Desarrolla y prueba funcionalidades
4. Limpia antes de commitear

### Para Testing
1. Usa cuentas predefinidas
2. Prueba todos los flujos
3. Verifica que no haya contaminación de datos
4. Documenta casos de prueba

### Para Demostraciones
1. Prepara datos de prueba realistas
2. Configura el modo para demo
3. Realiza la demostración
4. Limpia después de la demo

## 🚨 Precauciones

### ✅ Haz
- Usa el modo pruebas para todo desarrollo nuevo
- Genera datos específicos para cada prueba
- Limpia los datos después de usar
- Documenta tus pruebas

### ❌ No Hagas
- Desactivates el modo durante pruebas
- Uses datos reales en modo pruebas
- Dejes datos de prueba sin limpiar
- Commiteas con modo pruebas activo

## 🆘 Solución de Problemas

### Problemas Comunes

#### El modo pruebas no se activa
- Revisa la consola para errores
- Verifica que no haya otro modo activo
- Recarga la página

#### Los datos no se generan
- Verifica conexión con la API
- Revisa logs del servidor
- Intenta limpiar primero

#### La limpieza no funciona
- Verifica permisos de base de datos
- Revisa el intervalo de tiempo
- Consulta logs de error

### Soporte
Para problemas con el modo pruebas:

1. Revisa la consola del navegador
2. Consulta los logs del servidor
3. Verifica la configuración
4. Contacta al equipo de desarrollo

---

## 📝 Notas de Versión

### v1.0.0
- Modo pruebas básico
- Generación de usuarios y membresías
- Limpieza automática
- Indicadores visuales

### Próximas Mejoras
- Generación de citas de prueba
- Escenarios de prueba predefinidos
- Exportación/importación de datos de prueba
- Integración con CI/CD

---

**⚠️ Importante**: Este modo es exclusivamente para desarrollo y pruebas. 
Nunca usar en producción con datos reales.