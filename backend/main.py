from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import models
from database import engine
from routers import movies, functions, tickets

# Crear las tablas en la base de datos (para SQLite local esto es automático)
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Cinepolito API",
    description="API para el clon de Cinépolis",
    version="1.0.0"
)

# Configurar CORS (necesario para conectar con el Frontend en React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # En producción se debe cambiar por el dominio de Render del frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir las rutas
app.include_router(movies.router)
app.include_router(functions.router)
app.include_router(tickets.router)

@app.get("/")
def root():
    return {"message": "Bienvenido a la API de Cinepolito. Ve a /docs para ver la documentación."}
