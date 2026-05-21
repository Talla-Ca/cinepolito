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

from routers.auth import get_current_admin_user

@router.post("/", response_model=schemas.Function)
def create_function(function: schemas.FunctionCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_admin_user)):
    db_function = models.Function(**function.model_dump())
    db.add(db_function)
    db.commit()
    db.refresh(db_function)
    return db_function

@router.put("/{function_id}", response_model=schemas.Function)
def update_function(function_id: int, function: schemas.FunctionCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_admin_user)):
    db_function = db.query(models.Function).filter(models.Function.id == function_id).first()
    if not db_function:
        raise HTTPException(status_code=404, detail="Function not found")
    
    for key, value in function.model_dump().items():
        setattr(db_function, key, value)
        
    db.commit()
    db.refresh(db_function)
    return db_function

@router.delete("/{function_id}")
def delete_function(function_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_admin_user)):
    db_function = db.query(models.Function).filter(models.Function.id == function_id).first()
    if not db_function:
        raise HTTPException(status_code=404, detail="Function not found")
    
    db.delete(db_function)
    db.commit()
    return {"message": "Function deleted successfully"}
