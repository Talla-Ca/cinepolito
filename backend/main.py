from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

import models
from database import engine
from routers import movies, functions, tickets, auth
from seed import seed

# Crear las tablas en la base de datos (para SQLite local esto es automático)
models.Base.metadata.create_all(bind=engine)

# Poblar la base de datos automáticamente si está vacía (ideal para Render)
try:
    seed()
except Exception as e:
    print("Error al poblar BD:", e)

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
app.include_router(auth.router)

# Configuración para servir el frontend de React
frontend_dist = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend", "dist")

@app.get("/api/seed")
def force_seed():
    try:
        seed()
        return {"message": "Base de datos poblada exitosamente. Revisa la cartelera ahora."}
    except Exception as e:
        import traceback
        return {"error": str(e), "traceback": traceback.format_exc()}

if os.path.exists(frontend_dist):
    # Montar la carpeta de assets (JS, CSS, etc) de Vite
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist, "assets")), name="assets")

    # Ruta catch-all para servir el index.html y dejar que React Router maneje las rutas
    @app.get("/{catchall:path}")
    def serve_react_app(catchall: str):
        file_path = os.path.join(frontend_dist, catchall)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(frontend_dist, "index.html"))
else:
    @app.get("/")
    def root():
        return {"message": "Bienvenido a la API de Cinepolito. Ve a /docs para ver la documentación. El frontend no ha sido compilado aún."}
