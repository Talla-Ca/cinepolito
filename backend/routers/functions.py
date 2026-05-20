from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import get_db
import models, schemas

router = APIRouter(
    prefix="/functions",
    tags=["functions"]
)

@router.get("/", response_model=List[schemas.Function])
def read_functions(movie_id: int = None, db: Session = Depends(get_db)):
    query = db.query(models.Function)
    if movie_id:
        query = query.filter(models.Function.movie_id == movie_id)
    functions = query.all()
    return functions

@router.post("/", response_model=schemas.Function)
def create_function(function: schemas.FunctionCreate, db: Session = Depends(get_db)):
    db_function = models.Function(**function.model_dump())
    db.add(db_function)
    db.commit()
    db.refresh(db_function)
    return db_function
