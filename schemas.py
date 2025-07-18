# Backend/schemas.py
from pydantic import BaseModel, EmailStr, Field
from datetime import date
from typing import Optional

class EmployeePreferences(BaseModel):
    theme: Optional[str] = "dark"
    notifications: Optional[bool] = True

class EmployeeBase(BaseModel):
    name: str
    email: EmailStr
    position: str
    hire_date: date
    status: str

class EmployeeCreate(EmployeeBase):
    preferences: Optional[EmployeePreferences] = None

class EmployeeUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    position: Optional[str] = None
    hire_date: Optional[date] = None
    status: Optional[str] = None
    preferences: Optional[EmployeePreferences] = None

class Employee(EmployeeBase):
    id: int
    class Config:
        from_attributes = True # For Pydantic v2

class CustomerBase(BaseModel):
    name: str
    email: EmailStr
    phone: str
    contact_person: Optional[str] = None
    address: Optional[str] = None
    industry: Optional[str] = None
    priority_level: Optional[int] = Field(None, ge=1, le=5)

class CustomerCreate(CustomerBase):
    pass

class CustomerUpdate(BaseModel):
    name: Optional[str] = None
    contact_person: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    industry: Optional[str] = None
    priority_level: Optional[int] = Field(None, ge=1, le=5)

class Customer(CustomerBase):
    id: int
    class Config:
        from_attributes = True

from pydantic import BaseModel
from datetime import date
from typing import Optional

class ProjectBase(BaseModel):
    project_name: str
    customer_id: int
    status: str
    budget_total: float
    start_date: date
    # Optionally add completion_percentage if needed
    completion_percentage: Optional[float] = 0.0
    # You can add other fields if necessary

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    project_name: Optional[str] = None
    customer_id: Optional[int] = None
    status: Optional[str] = None
    budget_total: Optional[float] = None
    start_date: Optional[date] = None
    completion_percentage: Optional[float] = None

class Project(ProjectBase):
    id: int
    class Config:
        from_attributes = True




class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    project_id: int
    assignee_id: Optional[int] = None # Task might not have an assignee immediately
    due_date: date
    status: str
    priority: str
    completion_date: Optional[date] = None
    reopened_count: int = 0

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    project_id: Optional[int] = None
    assignee_id: Optional[int] = None
    due_date: Optional[date] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    completion_date: Optional[date] = None
    reopened_count: Optional[int] = None

class Task(TaskBase):
    id: int
    class Config:
        from_attributes = True

class AlertBase(BaseModel):
    message: str
    project_id: Optional[int] = None
    task_id: Optional[int] = None
    type: str
    created_at: date
    is_resolved: bool = False

class AlertCreate(AlertBase):
    pass

class AlertUpdate(BaseModel):
    message: Optional[str] = None
    project_id: Optional[int] = None
    task_id: Optional[int] = None
    type: Optional[str] = None
    created_at: Optional[date] = None
    is_resolved: Optional[bool] = None

class Alert(AlertBase):
    id: int
    class Config:
        from_attributes = True

class BudgetHistoryBase(BaseModel):
    project_id: int
    date: date
    amount_spent: float
    remaining_budget: float

class BudgetHistoryCreate(BudgetHistoryBase):
    pass

class BudgetHistory(BudgetHistoryBase):
    id: int
    class Config:
        from_attributes = True

class ProjectKpiBase(BaseModel):
    project_id: int
    completion_percentage: float = 0.0
    milestone_completion: float = 0.0
    budget_utilization: float = 0.0
    schedule_variance: float = 0.0
    overdue_tasks: int = 0
    alert_count: int = 0
    avg_task_completion_time: float = 0.0
    employee_workload_index: float = 0.0
    customer_priority_level: int = 3
    reopened_tasks: int = 0
    risk_flag: bool = False
    kpi_class: Optional[str] = "Medium" # Default value

class ProjectKpiCreate(ProjectKpiBase):
    pass

class ProjectKpiUpdate(BaseModel):
    completion_percentage: Optional[float] = None
    milestone_completion: Optional[float] = None
    budget_utilization: Optional[float] = None
    schedule_variance: Optional[float] = None
    overdue_tasks: Optional[int] = None
    alert_count: Optional[int] = None
    avg_task_completion_time: Optional[float] = None
    employee_workload_index: Optional[float] = None
    customer_priority_level: Optional[int] = None
    reopened_tasks: Optional[int] = None
    risk_flag: Optional[bool] = None
    kpi_class: Optional[str] = None

class ProjectKpi(ProjectKpiBase):
    id: int
    class Config:
        from_attributes = True