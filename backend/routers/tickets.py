from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import get_db
import models, schemas

router = APIRouter(
    prefix="/tickets",
    tags=["tickets"]
)

@router.post("/", response_model=schemas.Ticket)
def create_ticket(ticket: schemas.TicketCreate, db: Session = Depends(get_db)):
    # Validate if function exists
    function = db.query(models.Function).filter(models.Function.id == ticket.function_id).first()
    if not function:
        raise HTTPException(status_code=404, detail="Function not found")

    # Validate if seat is already taken
    existing_ticket = db.query(models.Ticket).filter(
        models.Ticket.function_id == ticket.function_id,
        models.Ticket.seat_number == ticket.seat_number
    ).first()
    
    if existing_ticket:
        raise HTTPException(status_code=400, detail="Seat already taken")

    db_ticket = models.Ticket(**ticket.model_dump())
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    return db_ticket

@router.get("/{function_id}", response_model=List[schemas.Ticket])
def get_tickets_by_function(function_id: int, db: Session = Depends(get_db)):
    tickets = db.query(models.Ticket).filter(models.Ticket.function_id == function_id).all()
    return tickets
