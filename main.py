from fastapi import FastAPI, Depends, HTTPException, status, APIRouter
from sqlalchemy.orm import Session
from typing import List, Optional

import models, schemas, crud # Absolute imports
from database import engine, Base, get_db # Absolute imports

from fastapi.middleware.cors import CORSMiddleware # For CORS configuration
import json # Ensure json is imported for EmployeePreferences handling in schemas

# Create all tables in the database (uncomment to run ONCE for initial setup, usually done with Alembic)
# models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Project Management Dashboard API",
    description="API for managing projects, tasks, employees, customers, and KPIs.",
    version="1.0.0",
)

# Configure CORS
origins = [
    "http://localhost",
    "http://localhost:3000", # Assuming your frontend might run on port 3000
    # Add other origins where your frontend might be hosted
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create an API router with the /api prefix
api_router = APIRouter(prefix="/api")

# --- Root Endpoint ---
# This endpoint remains directly on 'app' as it's not part of the /api prefix
@app.get("/")
def read_root():
    return {"message": "Welcome to the Project Management Dashboard API!"}

# --- Helper for employee email check (can remain here or be moved to crud.py) ---
def get_employee_by_email(db: Session, email: str):
    return db.query(models.Employee).filter(models.Employee.email == email).first()


# --- Employee Endpoints ---
@api_router.post("/employees/", response_model=schemas.Employee, status_code=status.HTTP_201_CREATED)
def create_employee(employee: schemas.EmployeeCreate, db: Session = Depends(get_db)):
    if get_employee_by_email(db, email=employee.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_employee(db=db, employee=employee)

@api_router.get("/employees/", response_model=List[schemas.Employee])
def read_employees(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    employees = crud.get_employees(db, skip=skip, limit=limit)
    return employees

@api_router.get("/employees/{employee_id}", response_model=schemas.Employee)
def read_employee(employee_id: int, db: Session = Depends(get_db)):
    db_employee = crud.get_employee(db, employee_id=employee_id)
    if db_employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")
    return db_employee

@api_router.patch("/employees/{employee_id}", response_model=schemas.Employee)
def update_employee(employee_id: int, employee: schemas.EmployeeUpdate, db: Session = Depends(get_db)):
    db_employee = crud.update_employee(db, employee_id=employee_id, employee_update=employee)
    if db_employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")
    return db_employee

@api_router.delete("/employees/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_employee(employee_id: int, db: Session = Depends(get_db)):
    if not crud.delete_employee(db, employee_id=employee_id):
        raise HTTPException(status_code=404, detail="Employee not found")
    return {"message": "Employee deleted successfully"}

# --- Customer Endpoints ---
@api_router.post("/customers/", response_model=schemas.Customer, status_code=status.HTTP_201_CREATED)
def create_customer(customer: schemas.CustomerCreate, db: Session = Depends(get_db)):
    return crud.create_customer(db=db, customer=customer)

@api_router.get("/customers/", response_model=List[schemas.Customer])
def read_customers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    customers = crud.get_customers(db, skip=skip, limit=limit)
    return customers

@api_router.get("/customers/{customer_id}", response_model=schemas.Customer)
def read_customer(customer_id: int, db: Session = Depends(get_db)):
    db_customer = crud.get_customer(db, customer_id=customer_id)
    if db_customer is None:
        raise HTTPException(status_code=404, detail="Customer not found")
    return db_customer

@api_router.patch("/customers/{customer_id}", response_model=schemas.Customer)
def update_customer(customer_id: int, customer: schemas.CustomerUpdate, db: Session = Depends(get_db)):
    db_customer = crud.update_customer(db, customer_id=customer_id, customer_update=customer)
    if db_customer is None:
        raise HTTPException(status_code=404, detail="Customer not found")
    return db_customer

@api_router.delete("/customers/{customer_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_customer(customer_id: int, db: Session = Depends(get_db)):
    if not crud.delete_customer(db, customer_id=customer_id):
        raise HTTPException(status_code=404, detail="Customer not found")
    return {"message": "Customer deleted successfully"}

# --- Project Endpoints ---
@api_router.post("/projects/", response_model=schemas.Project, status_code=status.HTTP_201_CREATED)
def create_project(project: schemas.ProjectCreate, db: Session = Depends(get_db)):
    return crud.create_project(db=db, project=project)

@api_router.get("/projects/", response_model=list[schemas.Project])
def read_projects(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_projects(db, skip=skip, limit=limit)

@api_router.get("/projects/{project_id}", response_model=schemas.Project)
def read_project(project_id: int, db: Session = Depends(get_db)):
    db_project = crud.get_project(db, project_id=project_id)
    if db_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return db_project

@api_router.patch("/projects/{project_id}", response_model=schemas.Project)
def update_project(project_id: int, project: schemas.ProjectUpdate, db: Session = Depends(get_db)):
    db_project = crud.update_project(db, project_id=project_id, project_update=project)
    if db_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return db_project

@api_router.delete("/projects/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(project_id: int, db: Session = Depends(get_db)):
    if not crud.delete_project(db, project_id=project_id):
        raise HTTPException(status_code=404, detail="Project not found or could not be deleted")
    return {"message": "Project deleted successfully"}

# --- Task Endpoints ---
@api_router.post("/tasks/", response_model=schemas.Task, status_code=status.HTTP_201_CREATED)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    return crud.create_task(db=db, task=task)

@api_router.get("/tasks/", response_model=List[schemas.Task])
def read_tasks(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    tasks = crud.get_tasks(db, skip=skip, limit=limit)
    return tasks

@api_router.get("/tasks/{task_id}", response_model=schemas.Task)
def read_task(task_id: int, db: Session = Depends(get_db)):
    db_task = crud.get_task(db, task_id=task_id)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task

@api_router.patch("/tasks/{task_id}", response_model=schemas.Task)
def update_task(task_id: int, task: schemas.TaskUpdate, db: Session = Depends(get_db)):
    db_task = crud.update_task(db, task_id=task_id, task_update=task)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task

@api_router.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    if not crud.delete_task(db, task_id=task_id):
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": "Task deleted successfully"}

# --- Alert Endpoints ---
@api_router.post("/alerts/", response_model=schemas.Alert, status_code=status.HTTP_201_CREATED)
def create_alert(alert: schemas.AlertCreate, db: Session = Depends(get_db)):
    return crud.create_alert(db=db, alert=alert)

@api_router.get("/alerts/", response_model=List[schemas.Alert])
def read_alerts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    alerts = crud.get_alerts(db, skip=skip, limit=limit)
    return alerts

@api_router.get("/alerts/{alert_id}", response_model=schemas.Alert)
def read_alert(alert_id: int, db: Session = Depends(get_db)):
    db_alert = crud.get_alert(db, alert_id=alert_id)
    if db_alert is None:
        raise HTTPException(status_code=404, detail="Alert not found")
    return db_alert

@api_router.patch("/alerts/{alert_id}", response_model=schemas.Alert)
def update_alert(alert_id: int, alert: schemas.AlertUpdate, db: Session = Depends(get_db)):
    db_alert = crud.update_alert(db, alert_id=alert_id, alert_update=alert)
    if db_alert is None:
        raise HTTPException(status_code=404, detail="Alert not found")
    return db_alert

@api_router.delete("/alerts/{alert_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_alert(alert_id: int, db: Session = Depends(get_db)):
    if not crud.delete_alert(db, alert_id=alert_id):
        raise HTTPException(status_code=404, detail="Alert not found")
    return {"message": "Alert deleted successfully"}

# --- Budget History Endpoints ---
@api_router.post("/budget-history/", response_model=schemas.BudgetHistory, status_code=status.HTTP_201_CREATED)
def create_budget_history(budget_history: schemas.BudgetHistoryCreate, db: Session = Depends(get_db)):
    return crud.create_budget_history(db=db, budget_history=budget_history)

@api_router.get("/budget-history/", response_model=List[schemas.BudgetHistory])
def read_budget_histories(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    histories = crud.get_budget_histories(db, skip=skip, limit=limit)
    return histories

@api_router.get("/budget-history/{history_id}", response_model=schemas.BudgetHistory)
def read_budget_history(history_id: int, db: Session = Depends(get_db)):
    db_history = crud.get_budget_history(db, history_id=history_id)
    if db_history is None:
        raise HTTPException(status_code=404, detail="Budget history record not found")
    return db_history

# --- Project KPI Endpoints ---
@api_router.post("/project-kpis/", response_model=schemas.ProjectKpi, status_code=status.HTTP_201_CREATED)
def create_project_kpi(kpi: schemas.ProjectKpiCreate, db: Session = Depends(get_db)):
    existing_kpi = db.query(models.Project_KPI).filter(models.Project_KPI.project_id == kpi.project_id).first()
    if existing_kpi:
        raise HTTPException(status_code=400, detail=f"KPI record already exists for project ID {kpi.project_id}")
    return crud.create_project_kpi(db=db, kpi=kpi)

@api_router.get("/project-kpis/", response_model=List[schemas.ProjectKpi])
def read_project_kpis(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    kpis = crud.get_project_kpis(db, skip=skip, limit=limit)
    return kpis

@api_router.get("/project-kpis/{kpi_id}", response_model=schemas.ProjectKpi)
def read_project_kpi(kpi_id: int, db: Session = Depends(get_db)):
    db_kpi = crud.get_project_kpi(db, kpi_id=kpi_id)
    if db_kpi is None:
        raise HTTPException(status_code=404, detail="Project KPI not found")
    return db_kpi

@api_router.get("/projects/{project_id}/kpi", response_model=schemas.ProjectKpi)
def get_project_kpi_by_project_id(project_id: int, db: Session = Depends(get_db)):
    db_kpi = db.query(models.Project_KPI).filter(models.Project_KPI.project_id == project_id).first()
    if db_kpi is None:
        raise HTTPException(status_code=404, detail="Project KPI not found for this project ID")
    return db_kpi

@api_router.patch("/project-kpis/{kpi_id}", response_model=schemas.ProjectKpi)
def update_project_kpi(kpi_id: int, kpi: schemas.ProjectKpiUpdate, db: Session = Depends(get_db)):
    db_kpi = crud.update_project_kpi(db, kpi_id=kpi_id, kpi_update=kpi)
    if db_kpi is None:
        raise HTTPException(status_code=404, detail="Project KPI not found")
    return db_kpi

@api_router.delete("/project-kpis/{kpi_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project_kpi(kpi_id: int, db: Session = Depends(get_db)):
    if not crud.delete_project_kpi(db, kpi_id=kpi_id):
        raise HTTPException(status_code=404, detail="Project KPI not found")
    return {"message": "Project KPI deleted successfully"}

# --- KPI Classification Endpoint (using Llama3) ---
@api_router.post("/projects/{project_id}/classify_kpi", response_model=schemas.ProjectKpi)
def trigger_kpi_classification(project_id: int, db: Session = Depends(get_db)):
    """
    Triggers the Llama3 agent to classify the KPI class for a specific project
    and updates the database.
    """
    db_kpi = crud.classify_and_update_project_kpi_class(db, project_id=project_id)
    if db_kpi is None:
        raise HTTPException(status_code=404, detail="Project KPI not found or classification failed. Check backend logs.")
    return db_kpi

# IMPORTANT: Include the router in your main app
app.include_router(api_router)