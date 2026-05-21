# Etapa 1: Construir el frontend con Node.js
FROM node:20-alpine AS build
WORKDIR /app/frontend

# Copiar archivos de configuración del frontend e instalar dependencias
COPY frontend/package*.json ./
RUN npm install

# Copiar el resto del código fuente del frontend y construir
COPY frontend/ ./
RUN npm run build

# Etapa 2: Configurar Python y ejecutar la aplicación (Backend + Frontend)
FROM python:3.12-slim
WORKDIR /app

# Instalar dependencias del sistema necesarias para compilar/usar PostgreSQL
RUN apt-get update && apt-get install -y libpq-dev gcc

# Copiar requirements.txt desde la raíz
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el backend manteniendo la estructura de carpetas local
COPY backend/ ./backend/

# Copiar el frontend compilado desde la Etapa 1
COPY --from=build /app/frontend/dist ./frontend/dist

# Exponer el puerto
EXPOSE 10000

# Comando para ejecutar la app (ahora desde la carpeta backend para que coincida con local)
WORKDIR /app/backend
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "10000"]