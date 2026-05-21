import datetime
from sqlalchemy.orm import Session
from database import engine, SessionLocal
import models
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def seed():
    models.Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Create dummy users
    users_to_create = [
        {"email": "admin@cinepolis.com", "password": "admin", "name": "Administrador", "is_admin": True},
        {"email": "test@cinepolis.com", "password": "123456", "name": "Usuario de Prueba", "is_admin": False},
        {"email": "talla@cinepolis.com", "password": "talla", "name": "Usuario Talla", "is_admin": False},
        {"email": "pasos@cinepolis.com", "password": "pasos", "name": "Usuario Pasos", "is_admin": False},
    ]

    for u in users_to_create:
        if not db.query(models.User).filter(models.User.email == u["email"]).first():
            user = models.User(
                email=u["email"],
                hashed_password=pwd_context.hash(u["password"]),
                full_name=u["name"],
                is_admin=u["is_admin"]
            )
            db.add(user)
    db.commit()

    # Create movies
    if not db.query(models.Movie).first():
        movies_data = [
            models.Movie(
                title="The Mandalorian & Grogu",
                description="El mandaloriano y su aprendiz Grogu emprenden una nueva aventura galáctica en la gran pantalla.",
                duration_minutes=120,
                poster_url="https://placehold.co/500x750/0b1c36/ffffff?text=Mandalorian+&+Grogu"
            ),
            models.Movie(
                title="Michael",
                description="La película biográfica definitiva que narra la compleja vida y el inmenso legado del Rey del Pop, Michael Jackson.",
                duration_minutes=135,
                poster_url="https://placehold.co/500x750/0b1c36/ffffff?text=Michael"
            ),
            models.Movie(
                title="Mortal Kombat 2",
                description="Los defensores de la Tierra se preparan para el torneo definitivo contra las fuerzas de Outworld.",
                duration_minutes=115,
                poster_url="https://placehold.co/500x750/0b1c36/ffffff?text=Mortal+Kombat+2"
            ),
            models.Movie(
                title="Scary Movie 6",
                description="Una nueva y divertidísima parodia de las películas de terror más populares de la última década.",
                duration_minutes=95,
                poster_url="https://placehold.co/500x750/0b1c36/ffffff?text=Scary+Movie+6"
            ),
            models.Movie(
                title="Ovejas Asesinas",
                description="Un experimento genético sale terriblemente mal en una granja, convirtiendo a las inofensivas ovejas en depredadores sedientos de sangre.",
                duration_minutes=102,
                poster_url="https://placehold.co/500x750/0b1c36/ffffff?text=Ovejas+Asesinas"
            ),
            models.Movie(
                title="Amos del Universo",
                description="He-Man debe defender el Castillo de Grayskull de las fuerzas del malvado Skeletor en una épica batalla en Eternia.",
                duration_minutes=125,
                poster_url="https://placehold.co/500x750/0b1c36/ffffff?text=Amos+del+Universo"
            ),
            models.Movie(
                title="The Backrooms",
                description="Un adolescente descubre un portal a una dimensión infinita y terrorífica de pasillos amarillos y luces fluorescentes zumbantes.",
                duration_minutes=110,
                poster_url="https://placehold.co/500x750/0b1c36/ffffff?text=The+Backrooms"
            ),
            models.Movie(
                title="Dune: Parte Dos",
                description="Paul Atreides se une a Chani y a los Fremen en su camino de venganza contra los conspiradores que destruyeron a su familia.",
                duration_minutes=166,
                poster_url="https://placehold.co/500x750/0b1c36/ffffff?text=Dune+2"
            ),
            models.Movie(
                title="Spider-Man: Beyond the Spider-Verse",
                description="Miles Morales se enfrenta al desafío final en el multiverso en la esperada conclusión de la trilogía animada.",
                duration_minutes=140,
                poster_url="https://placehold.co/500x750/0b1c36/ffffff?text=Spider-Man"
            ),
            models.Movie(
                title="Shrek 5",
                description="El ogro más querido regresa al pantano con una nueva aventura para toda la familia y viejos amigos.",
                duration_minutes=98,
                poster_url="https://placehold.co/500x750/0b1c36/ffffff?text=Shrek+5"
            ),
            models.Movie(
                title="The Batman Part II",
                description="El Caballero de la Noche se enfrenta a nuevas amenazas en una ciudad de Gotham cada vez más corrupta y peligrosa.",
                duration_minutes=155,
                poster_url="https://placehold.co/500x750/0b1c36/ffffff?text=The+Batman+2"
            ),
            models.Movie(
                title="Avengers: Doomsday",
                description="Los Vengadores deben unirse una vez más para enfrentar a Doctor Doom en un evento que cambiará el universo.",
                duration_minutes=150,
                poster_url="https://placehold.co/500x750/0b1c36/ffffff?text=Avengers"
            ),
            models.Movie(
                title="Super Mario Bros 2",
                description="Mario y Luigi descubren nuevas galaxias y se enfrentan a Bowser una vez más con la ayuda de Yoshi.",
                duration_minutes=105,
                poster_url="https://placehold.co/500x750/0b1c36/ffffff?text=Super+Mario+2"
            ),
            models.Movie(
                title="Superman",
                description="El Hombre de Acero inicia una nueva era de heroísmo en Metropolis.",
                duration_minutes=130,
                poster_url="https://placehold.co/500x750/0b1c36/ffffff?text=Superman"
            ),
            models.Movie(
                title="Jurassic World 4",
                description="Una nueva era jurásica comienza, explorando un mundo donde los dinosaurios y los humanos intentan coexistir.",
                duration_minutes=128,
                poster_url="https://placehold.co/500x750/0b1c36/ffffff?text=Jurassic+World"
            )
        ]
        
        # Como las URLs son aproximadas y algunas pueden romperse, agregamos un fallback en React 
        # pero aquí en el seed guardamos la data estructurada.
        
        db.add_all(movies_data)
        db.commit()

        # Create rooms
        rooms = [
            models.Room(name="Sala 1 MacroXE", capacity=140),
            models.Room(name="Sala 2 VIP", capacity=60),
            models.Room(name="Sala 3 Tradicional", capacity=100)
        ]
        db.add_all(rooms)
        db.commit()

        # Create functions for the next 3 days
        movies = db.query(models.Movie).all()
        rooms_db = db.query(models.Room).all()
        
        for i, movie in enumerate(movies):
            # Asignar a diferentes salas y horarios para variedad
            room = rooms_db[i % len(rooms_db)]
            for day in range(3):
                for hour in [14, 17, 20]:
                    fn = models.Function(
                        movie_id=movie.id,
                        room_id=room.id,
                        start_time=datetime.datetime.now() + datetime.timedelta(days=day, hours=hour - datetime.datetime.now().hour),
                        price=80.0 if "Tradicional" in room.name else (120.0 if "MacroXE" in room.name else 200.0)
                    )
                    db.add(fn)
        db.commit()

    db.close()
    print("Database seeded successfully with 15 movies, functions, and test users.")

if __name__ == "__main__":
    seed()
