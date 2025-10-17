#!/bin/bash

echo "🚀 Iniciando deploy de DentalCare Pro en Vercel..."

# 1. Generar Prisma Client
echo "📦 Generando Prisma Client..."
npx prisma generate

# 2. Hacer build del proyecto
echo "🔨 Construyendo el proyecto..."
npm run build

# 3. Push del schema a la base de datos
echo "🗄️ Sincronizando base de datos..."
npx prisma db push

echo "✅ Deploy completado!"
echo "🌐 Tu proyecto estará disponible en: https://dentalcare-pro.vercel.app"
