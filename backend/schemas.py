from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    is_admin: bool = False

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: User

class TokenData(BaseModel):
    email: Optional[str] = None

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
    user_id: Optional[int] = None

class TicketCreate(TicketBase):
    pass

class Ticket(TicketBase):
    id: int
    function: Optional[Function] = None
    user: Optional[User] = None

    class Config:
        from_attributes = True
