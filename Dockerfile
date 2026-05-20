FROM python:3.12-slim

WORKDIR /app

# Instalar dependencias del sistema necesarias para compilar/usar PostgreSQL
RUN apt-get update && apt-get install -y libpq-dev gcc

# Copiar requirements.txt desde la raíz
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Copiar todo el contenido de backend/
COPY backend/ .

# Exponer el puerto
EXPOSE 10000

# Comando para ejecutar la app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "10000"]