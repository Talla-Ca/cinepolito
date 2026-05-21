# Cinepolito

Cinepolito es un clon de Cinépolis, construido con React (Frontend) y FastAPI (Backend), con soporte de base de datos PostgreSQL/SQLite.

## Cuentas de Acceso (Base de Datos)

Las siguientes cuentas se crean por defecto cuando se inicializa (seed) la base de datos:

| Rol | Email | Contraseña |
| --- | --- | --- |
| **Administrador** | `admin@cinepolis.com` | `admin` |
| Usuario | `test@cinepolis.com` | `123456` |
| Usuario | `talla@cinepolis.com` | `talla` |
| Usuario | `pasos@cinepolis.com` | `pasos` |

## Despliegue en Render
El proyecto está optimizado para desplegarse como un servicio único en Render usando Docker (Multi-stage build). Render construirá el frontend y lo servirá automáticamente junto con la API de FastAPI.


Falta crear el registro de nuevos usuarios la carga de imagenes locales archivo de imagenes, verificar que todo esta funcionando correctamente y que se pueda registrar nuevos usuarios, crear funciones y que se puedan ver las peliculas en cartelera.