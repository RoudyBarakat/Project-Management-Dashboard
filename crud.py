# Backend/crud.py

from sqlalchemy.orm import Session
from typing import List, Optional
from fastapi import HTTPException

# Assuming 'models' and 'schemas' are in the same 'Backend' directory
# Use relative imports for modules within the same package
import models, schemas 
from  llama_kpi_agent import Llama3Client # Note the leading dot for relative import

# Initialize your Llama3 client globally or pass it as a dependency
llama_client = Llama3Client() 

# --- Employee CRUD ---
def get_employee(db: Session, employee_id: int):
    return db.query(models.Employee).filter(models.Employee.id == employee_id).first()

def get_employee_by_email(db: Session, email: str):
    return db.query(models.Employee).filter(models.Employee.email == email).first()

def get_employees(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Employee).offset(skip).limit(limit).all()

def create_employee(db: Session, employee: schemas.EmployeeCreate):
    # Handle preferences conversion to JSON string
    preferences_json = employee.preferences.json() if employee.preferences else "{}"
    db_employee = models.Employee(
        name=employee.name,
        email=employee.email,
        position=employee.position,
        hire_date=employee.hire_date,
        status=employee.status,
        preferences=preferences_json
    )
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee

def update_employee(db: Session, employee_id: int, employee_update: schemas.EmployeeUpdate):
    db_employee = db.query(models.Employee).filter(models.Employee.id == employee_id).first()
    if db_employee:
        # Use model_dump for Pydantic v2. exclude_unset=True ensures only provided fields are considered.
        update_data = employee_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            if field == "preferences" and value is not None:
                # Convert Pydantic object back to JSON string for storage
                db_employee.preferences = value.json()
            else:
                setattr(db_employee, field, value)
        db.commit()
        db.refresh(db_employee)
    return db_employee

def delete_employee(db: Session, employee_id: int):
    db_employee = db.query(models.Employee).filter(models.Employee.id == employee_id).first()
    if db_employee:
        db.delete(db_employee)
        db.commit()
        return True
    return False

# --- Customer CRUD ---
def get_customer(db: Session, customer_id: int):
    return db.query(models.Customer).filter(models.Customer.id == customer_id).first()

def get_customers(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Customer).offset(skip).limit(limit).all()

def create_customer(db: Session, customer: schemas.CustomerCreate):
    # Use model_dump to convert Pydantic model to a dict for SQLAlchemy model creation
    db_customer = models.Customer(**customer.model_dump())
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer

def update_customer(db: Session, customer_id: int, customer_update: schemas.CustomerUpdate):
    db_customer = db.query(models.Customer).filter(models.Customer.id == customer_id).first()
    if db_customer:
        update_data = customer_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_customer, field, value)
        db.commit()
        db.refresh(db_customer)
    return db_customer

def delete_customer(db: Session, customer_id: int):
    db_customer = db.query(models.Customer).filter(models.Customer.id == customer_id).first()
    if db_customer:
        db.delete(db_customer)
        db.commit()
        return True
    return False

# --- Project CRUD ---
def get_project(db: Session, project_id: int):
    return db.query(models.Project).filter(models.Project.id == project_id).first()

def get_projects(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Project).offset(skip).limit(limit).all()

def create_project(db: Session, project: schemas.ProjectCreate):
    customer_obj = db.query(models.Customer).filter(models.Customer.id == project.customer_id).first()
    if not customer_obj:
        raise HTTPException(status_code=400, detail=f"Customer with id '{project.customer_id}' not found")

    db_project = models.Project(
        project_name=project.project_name,
        status=project.status,
        budget_total=project.budget_total,
        start_date=project.start_date,
        customer_id=project.customer_id,
        completion_percentage=project.completion_percentage or 0.0
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project


def update_project(db: Session, project_id: int, project_update: schemas.ProjectUpdate):
    db_project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not db_project:
        return None

    update_data = project_update.model_dump(exclude_unset=True)
    
    # Handle customer string -> customer_id conversion if needed
    if 'customer' in update_data:
        customer_name = update_data.pop('customer')
        customer_obj = db.query(models.Customer).filter(models.Customer.name == customer_name).first()
        if not customer_obj:
            raise HTTPException(status_code=400, detail=f"Customer '{customer_name}' not found")
        update_data['customer_id'] = customer_obj.id

    for field, value in update_data.items():
        setattr(db_project, field, value)
    
    db.commit()
    db.refresh(db_project)
    return db_project

def delete_project(db: Session, project_id: int):
    db_project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if db_project:
        db.delete(db_project)
        db.commit()
        return True
    return False

# --- Task CRUD ---
def get_task(db: Session, task_id: int):
    return db.query(models.Task).filter(models.Task.id == task_id).first()

def get_tasks(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Task).offset(skip).limit(limit).all()

def create_task(db: Session, task: schemas.TaskCreate):
    db_task = models.Task(**task.model_dump())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def update_task(db: Session, task_id: int, task_update: schemas.TaskUpdate):
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if db_task:
        update_data = task_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_task, field, value)
        db.commit()
        db.refresh(db_task)
    return db_task

def delete_task(db: Session, task_id: int):
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if db_task:
        db.delete(db_task)
        db.commit()
        return True
    return False

# --- Alert CRUD ---
def get_alert(db: Session, alert_id: int):
    return db.query(models.Alert).filter(models.Alert.id == alert_id).first()

def get_alerts(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Alert).offset(skip).limit(limit).all()

def create_alert(db: Session, alert: schemas.AlertCreate):
    db_alert = models.Alert(**alert.model_dump())
    db.add(db_alert)
    db.commit()
    db.refresh(db_alert)
    return db_alert

def update_alert(db: Session, alert_id: int, alert_update: schemas.AlertUpdate):
    db_alert = db.query(models.Alert).filter(models.Alert.id == alert_id).first()
    if db_alert:
        update_data = alert_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_alert, field, value)
        db.commit()
        db.refresh(db_alert)
    return db_alert

def delete_alert(db: Session, alert_id: int):
    db_alert = db.query(models.Alert).filter(models.Alert.id == alert_id).first()
    if db_alert:
        db.delete(db_alert)
        db.commit()
        return True
    return False

# --- Budget History CRUD ---
def get_budget_history(db: Session, history_id: int):
    return db.query(models.BudgetHistory).filter(models.BudgetHistory.id == history_id).first()

def get_budget_histories(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.BudgetHistory).offset(skip).limit(limit).all()

def create_budget_history(db: Session, budget_history: schemas.BudgetHistoryCreate):
    db_budget_history = models.BudgetHistory(**budget_history.model_dump())
    db.add(db_budget_history)
    db.commit()
    db.refresh(db_budget_history)
    return db_budget_history

# No direct update/delete for BudgetHistory as it's often an append-only ledger

# --- Project KPI CRUD ---
def get_project_kpi(db: Session, kpi_id: int):
    return db.query(models.Project_KPI).filter(models.Project_KPI.id == kpi_id).first()

def get_project_kpis(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Project_KPI).offset(skip).limit(limit).all()

def create_project_kpi(db: Session, kpi: schemas.ProjectKpiCreate):
    db_kpi = models.Project_KPI(**kpi.model_dump())
    db.add(db_kpi)
    db.commit()
    db.refresh(db_kpi)
    return db_kpi

def update_project_kpi(db: Session, kpi_id: int, kpi_update: schemas.ProjectKpiUpdate):
    db_kpi = db.query(models.Project_KPI).filter(models.Project_KPI.id == kpi_id).first()
    if db_kpi:
        update_data = kpi_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_kpi, field, value)
        db.commit()
        db.refresh(db_kpi)
    return db_kpi

def delete_project_kpi(db: Session, kpi_id: int):
    db_kpi = db.query(models.Project_KPI).filter(models.Project_KPI.id == kpi_id).first()
    if db_kpi:
        db.delete(db_kpi)
        db.commit()
        return True
    return False

# --- Llama3 Integration for KPI Classification ---
def classify_and_update_project_kpi_class(db: Session, project_id: int):
    db_kpi = db.query(models.Project_KPI).filter(models.Project_KPI.project_id == project_id).first()
    if not db_kpi:
        return None

    # Prepare data for Llama3 - Ensure these fields exist on your models.Project_KPI
    # and correspond to the parameters in Llama3Client.classify_kpi_class
    kpi_data = {
        "completion_percentage": db_kpi.completion_percentage,
        "milestone_completion": db_kpi.milestone_completion,
        "budget_utilization": db_kpi.budget_utilization,
        "schedule_variance": db_kpi.schedule_variance,
        "overdue_tasks": db_kpi.overdue_tasks,
        "alert_count": db_kpi.alert_count,
        "avg_task_completion_time": db_kpi.avg_task_completion_time,
        "employee_workload_index": db_kpi.employee_workload_index,
        "customer_priority_level": db_kpi.customer_priority_level,
        "reopened_tasks": db_kpi.reopened_tasks,
        "risk_flag": db_kpi.risk_flag
    }

    try:
        # Call Llama3 client to get the classification
        kpi_class_prediction = llama_client.classify_kpi_class(**kpi_data)
        db_kpi.kpi_class = kpi_class_prediction
        db.commit()
        db.refresh(db_kpi)
        return db_kpi
    except Exception as e:
        print(f"Error classifying KPI for project {project_id}: {e}")
        return None