from datetime import date as dt_date, datetime as dt_datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field


# ===================== USER SCHEMAS =====================

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None


class UserCreate(UserBase):
    password: str = Field(..., min_length=6, description="Password must be at least 6 characters")


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: int
    created_at: dt_datetime

    model_config = {"from_attributes": True}


# ===================== AUTH TOKEN SCHEMAS =====================

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class TokenData(BaseModel):
    user_id: Optional[int] = None
    email: Optional[str] = None


# ===================== EXPENSE SCHEMAS =====================

class ExpenseBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    amount: float = Field(..., gt=0, description="Amount must be greater than zero")
    category: str = Field(..., min_length=1, max_length=100)
    date: dt_date = Field(default_factory=dt_date.today)
    notes: Optional[str] = None


class ExpenseCreate(ExpenseBase):
    pass


class ExpenseUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    amount: Optional[float] = Field(None, gt=0)
    category: Optional[str] = Field(None, min_length=1, max_length=100)
    date: Optional[dt_date] = None
    notes: Optional[str] = None


class ExpenseResponse(ExpenseBase):
    id: int
    user_id: int
    created_at: dt_datetime

    model_config = {"from_attributes": True}


# ===================== ANALYTICS SCHEMAS =====================

class CategorySummary(BaseModel):
    category: str
    total_amount: float
    percentage: float
    count: int


class DashboardSummary(BaseModel):
    total_spent: float
    monthly_spent: float
    transaction_count: int
    monthly_budget: float = 2000.0  # Configurable target baseline
    budget_remaining: float
    categories: List[CategorySummary]
