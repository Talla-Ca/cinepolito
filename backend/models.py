from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, Float
from sqlalchemy.orm import relationship
from database import Base

class Movie(Base):
    __tablename__ = "movies"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    duration_minutes = Column(Integer)
    poster_url = Column(String)

    functions = relationship("Function", back_populates="movie")

class Room(Base):
    __tablename__ = "rooms"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    capacity = Column(Integer)

    functions = relationship("Function", back_populates="room")

class Function(Base):
    __tablename__ = "functions"

    id = Column(Integer, primary_key=True, index=True)
    movie_id = Column(Integer, ForeignKey("movies.id"))
    room_id = Column(Integer, ForeignKey("rooms.id"))
    start_time = Column(DateTime)
    price = Column(Float)

    movie = relationship("Movie", back_populates="functions")
    room = relationship("Room", back_populates="functions")
    tickets = relationship("Ticket", back_populates="function")

class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)
    function_id = Column(Integer, ForeignKey("functions.id"))
    seat_number = Column(String)
    customer_name = Column(String)

    function = relationship("Function", back_populates="tickets")
