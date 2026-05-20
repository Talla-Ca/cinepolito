from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class MovieBase(BaseModel):
    title: str
    description: str
    duration_minutes: int
    poster_url: str

class MovieCreate(MovieBase):
    pass

class Movie(MovieBase):
    id: int

    class Config:
        from_attributes = True

class RoomBase(BaseModel):
    name: str
    capacity: int

class RoomCreate(RoomBase):
    pass

class Room(RoomBase):
    id: int

    class Config:
        from_attributes = True

class FunctionBase(BaseModel):
    movie_id: int
    room_id: int
    start_time: datetime
    price: float

class FunctionCreate(FunctionBase):
    pass

class Function(FunctionBase):
    id: int
    movie: Optional[Movie] = None
    room: Optional[Room] = None

    class Config:
        from_attributes = True

class TicketBase(BaseModel):
    function_id: int
    seat_number: str
    customer_name: str

class TicketCreate(TicketBase):
    pass

class Ticket(TicketBase):
    id: int
    function: Optional[Function] = None

    class Config:
        from_attributes = True
