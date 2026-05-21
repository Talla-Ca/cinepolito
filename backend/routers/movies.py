from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
import os
import shutil

from database import get_db
import models, schemas

router = APIRouter(
    prefix="/movies",
    tags=["movies"]
)

@router.get("/", response_model=List[schemas.Movie])
def read_movies(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    movies = db.query(models.Movie).offset(skip).limit(limit).all()
    return movies

from routers.auth import get_current_admin_user

@router.post("/upload-image")
async def upload_image(file: UploadFile = File(...), current_user: models.User = Depends(get_current_admin_user)):
    # Guardar en public/images del frontend
    # backend y frontend estan al mismo nivel
    frontend_public_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "frontend", "public", "images")
    os.makedirs(frontend_public_dir, exist_ok=True)
    
    file_path = os.path.join(frontend_public_dir, file.filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Retornamos la ruta pública que el frontend puede usar
    return {"imageUrl": f"/images/{file.filename}"}

@router.post("/", response_model=schemas.Movie)
def create_movie(movie: schemas.MovieCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_admin_user)):
    db_movie = models.Movie(**movie.model_dump())
    db.add(db_movie)
    db.commit()
    db.refresh(db_movie)
    return db_movie

@router.put("/{movie_id}", response_model=schemas.Movie)
def update_movie(movie_id: int, movie: schemas.MovieCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_admin_user)):
    db_movie = db.query(models.Movie).filter(models.Movie.id == movie_id).first()
    if not db_movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    
    for key, value in movie.model_dump().items():
        setattr(db_movie, key, value)
        
    db.commit()
    db.refresh(db_movie)
    return db_movie

@router.delete("/{movie_id}")
def delete_movie(movie_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_admin_user)):
    db_movie = db.query(models.Movie).filter(models.Movie.id == movie_id).first()
    if not db_movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    
    db.delete(db_movie)
    db.commit()
    return {"message": "Movie deleted successfully"}

@router.get("/{movie_id}", response_model=schemas.Movie)
def read_movie(movie_id: int, db: Session = Depends(get_db)):
    movie = db.query(models.Movie).filter(models.Movie.id == movie_id).first()
    if movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    return movie
