from sqlalchemy import Column, Integer, String, Float, Boolean, Date, ForeignKey, Text
from sqlalchemy.orm import relationship, declarative_base
from datetime import date

Base = declarative_base()

# ---------------------------
# Project model
# ---------------------------
class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    project_name = Column(String, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"))
    status = Column(String)
    budget_total = Column(Float)
    completion_percentage = Column(Float, default=0.0)
    budget_used = Column(Float, default=0.0)
    budget_status = Column(String, default="OK")
    start_date = Column(Date)
    launch_date = Column(Date, nullable=True)

    customer = relationship("Customer", back_populates="projects")
    tasks = relationship("Task", back_populates="project")
    budget_history = relationship("BudgetHistory", back_populates="project")
    kpi = relationship("Project_KPI", back_populates="project", uselist=False)

# ---------------------------
# Customer model
# ---------------------------
class Customer(Base):
    __tablename__ = "customers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    contact_person = Column(String)
    email = Column(String)
    phone = Column(String)
    address = Column(String)
    industry = Column(String)
    priority_level = Column(Integer)  # 1 to 5

    projects = relationship("Project", back_populates="customer")

# ---------------------------
# Employee model
# ---------------------------
class Employee(Base):
    __tablename__ = "employees"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    position = Column(String)
    hire_date = Column(Date)
    status = Column(String)
    preferences = Column(Text)

    tasks = relationship("Task", back_populates="assignee")

# ---------------------------
# Task model
# ---------------------------
class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    project_id = Column(Integer, ForeignKey("projects.id"))
    assignee_id = Column(Integer, ForeignKey("employees.id"))
    due_date = Column(Date)
    status = Column(String)
    priority = Column(String)
    completion_date = Column(Date, nullable=True)
    reopened_count = Column(Integer, default=0)

    project = relationship("Project", back_populates="tasks")
    assignee = relationship("Employee", back_populates="tasks")

# ---------------------------
# Alert model
# ---------------------------
class Alert(Base):
    __tablename__ = "alerts"
    id = Column(Integer, primary_key=True, index=True)
    message = Column(String)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
    task_id = Column(Integer, ForeignKey("tasks.id"), nullable=True)
    type = Column(String)
    created_at = Column(Date)
    is_resolved = Column(Boolean, default=False)

# ---------------------------
# Budget History model
# ---------------------------
class BudgetHistory(Base):
    __tablename__ = "budget_history"
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    date = Column(Date)
    amount_spent = Column(Float)
    remaining_budget = Column(Float)

    project = relationship("Project", back_populates="budget_history")

# ---------------------------
# Project KPI model
# ---------------------------
class Project_KPI(Base):
    __tablename__ = "project_kpis"
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), unique=True)

    completion_percentage = Column(Float, default=0.0)
    milestone_completion = Column(Float, default=0.0)
    budget_utilization = Column(Float, default=0.0)
    schedule_variance = Column(Float, default=0.0)
    overdue_tasks = Column(Integer, default=0)
    alert_count = Column(Integer, default=0)
    avg_task_completion_time = Column(Float, default=0.0)
    employee_workload_index = Column(Float, default=0.0)
    customer_priority_level = Column(Integer, default=3)
    reopened_tasks = Column(Integer, default=0)
    risk_flag = Column(Boolean, default=False)
    kpi_class = Column(String, default="Medium")

    project = relationship("Project", back_populates="kpi")
