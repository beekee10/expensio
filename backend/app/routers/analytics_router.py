from datetime import date
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, extract

from app.database import get_db
from app.models import Expense, User
from app.schemas import CategorySummary, DashboardSummary
from app.auth import get_current_user

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])


@router.get("/by-category", response_model=List[CategorySummary])
def get_spending_by_category(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Aggregate total spending grouped by category with percentage distribution."""
    # 1. Total spent across all categories for user
    total_spent = db.query(func.coalesce(func.sum(Expense.amount), 0.0)).filter(
        Expense.user_id == current_user.id
    ).scalar()

    # 2. Group by category query
    results = (
        db.query(
            Expense.category,
            func.sum(Expense.amount).label("total_amount"),
            func.count(Expense.id).label("count")
        )
        .filter(Expense.user_id == current_user.id)
        .group_by(Expense.category)
        .order_by(func.sum(Expense.amount).desc())
        .all()
    )

    summaries = []
    for cat, amount, count in results:
        pct = (amount / total_spent * 100.0) if total_spent > 0 else 0.0
        summaries.append(
            CategorySummary(
                category=cat,
                total_amount=round(float(amount), 2),
                percentage=round(float(pct), 1),
                count=count
            )
        )

    return summaries


@router.get("/dashboard", response_model=DashboardSummary)
def get_dashboard_summary(
    monthly_budget: float = 2000.0,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Fetch high-level KPI metrics for top-level dashboard display."""
    today = date.today()

    # All-time total spent
    total_spent = db.query(func.coalesce(func.sum(Expense.amount), 0.0)).filter(
        Expense.user_id == current_user.id
    ).scalar()

    # Current month spent
    monthly_spent = db.query(func.coalesce(func.sum(Expense.amount), 0.0)).filter(
        Expense.user_id == current_user.id,
        extract("year", Expense.date) == today.year,
        extract("month", Expense.date) == today.month
    ).scalar()

    # Transaction count
    tx_count = db.query(func.count(Expense.id)).filter(
        Expense.user_id == current_user.id
    ).scalar()

    # Category summaries
    categories = get_spending_by_category(db=db, current_user=current_user)

    monthly_spent_val = round(float(monthly_spent), 2)
    budget_remaining = round(max(0.0, monthly_budget - monthly_spent_val), 2)

    return DashboardSummary(
        total_spent=round(float(total_spent), 2),
        monthly_spent=monthly_spent_val,
        transaction_count=tx_count,
        monthly_budget=monthly_budget,
        budget_remaining=budget_remaining,
        categories=categories
    )
