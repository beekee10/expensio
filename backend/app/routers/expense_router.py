from datetime import date
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database import get_db
from app.models import Expense, User
from app.schemas import ExpenseCreate, ExpenseUpdate, ExpenseResponse
from app.auth import get_current_user

router = APIRouter(prefix="/api/expenses", tags=["Expenses"])


@router.post("", response_model=ExpenseResponse, status_code=status.HTTP_201_CREATED)
def create_expense(
    expense_data: ExpenseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new expense for the authenticated user."""
    expense = Expense(
        user_id=current_user.id,
        title=expense_data.title.strip(),
        amount=round(expense_data.amount, 2),
        category=expense_data.category.strip(),
        date=expense_data.date,
        notes=expense_data.notes
    )
    db.add(expense)
    db.commit()
    db.refresh(expense)
    return expense


@router.get("", response_model=List[ExpenseResponse])
def get_expenses(
    category: Optional[str] = Query(None, description="Filter by category"),
    search: Optional[str] = Query(None, description="Search by title substring"),
    start_date: Optional[date] = Query(None, description="Filter by start date"),
    end_date: Optional[date] = Query(None, description="Filter by end date"),
    skip: int = Query(0, ge=0, description="Pagination offset"),
    limit: int = Query(50, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve all expenses for current user with filtering and pagination."""
    query = db.query(Expense).filter(Expense.user_id == current_user.id)

    if category:
        query = query.filter(Expense.category.ilike(f"%{category.strip()}%"))
    if search:
        query = query.filter(Expense.title.ilike(f"%{search.strip()}%"))
    if start_date:
        query = query.filter(Expense.date >= start_date)
    if end_date:
        query = query.filter(Expense.date <= end_date)

    expenses = query.order_by(desc(Expense.date), desc(Expense.id)).offset(skip).limit(limit).all()
    return expenses


@router.get("/{expense_id}", response_model=ExpenseResponse)
def get_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve a single expense by ID, verifying ownership."""
    expense = db.query(Expense).filter(
        Expense.id == expense_id,
        Expense.user_id == current_user.id
    ).first()

    if not expense:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Expense not found")
    return expense


@router.put("/{expense_id}", response_model=ExpenseResponse)
def update_expense(
    expense_id: int,
    update_data: ExpenseUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update an existing expense, verifying user ownership."""
    expense = db.query(Expense).filter(
        Expense.id == expense_id,
        Expense.user_id == current_user.id
    ).first()

    if not expense:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Expense not found")

    update_dict = update_data.model_dump(exclude_unset=True)
    for field, value in update_dict.items():
        if value is not None:
            if field == "title" and isinstance(value, str):
                value = value.strip()
            elif field == "category" and isinstance(value, str):
                value = value.strip()
            elif field == "amount" and isinstance(value, (int, float)):
                value = round(value, 2)
            setattr(expense, field, value)

    db.commit()
    db.refresh(expense)
    return expense


@router.delete("/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete an expense by ID, verifying user ownership."""
    expense = db.query(Expense).filter(
        Expense.id == expense_id,
        Expense.user_id == current_user.id
    ).first()

    if not expense:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Expense not found")

    db.delete(expense)
    db.commit()
    return None
