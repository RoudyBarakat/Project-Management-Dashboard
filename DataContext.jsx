import React, { createContext, useState, useEffect, useMemo } from 'react';


export const DataContext = createContext();

export const DataProvider = ({ children }) => {

  // Static dropdown options (shared across the app)
  const STATUS_OPTIONS = [
    "Not Started",
    "In Progress",
    "Completed",
    "On Hold",
    "Canceled",
  ];

  const INDUSTRY_OPTIONS = [
    "IT",
    "Construction",
    "Healthcare",
    "Finance",
    "Education",
    "Manufacturing",
  ];

  const PRIORITY_LEVELS = [1, 2, 3, 4, 5];

  const TASK_STATUSES = [
    "To Do",
    "In Progress",
    "Done",
    "Blocked",
    "Overdue",
  ];

  const TASK_PRIORITIES = ["Low", "Medium", "High", "Critical"];

  const KPI_CLASSES = ["Low", "Medium", "High"];

  // === Static data for all entities ===

  const customers = [
    {
      customer_id: 1,
      name: "John Doe",
      contact_person: "Jane Smith",
      email: "johndoe@example.com",
      phone: "123456789",
      address: "123 Main St",
      industry: "Manufacturing",
      priority_level: "High"
    },
    {
      customer_id: 2,
      name: "Acme Corp",
      contact_person: "Tom Johnson",
      email: "contact@acmecorp.com",
      phone: "987654321",
      address: "456 Elm St",
      industry: "Technology",
      priority_level: "Medium"
    },
      {
      customer_id: 3,
      name: "Roudy Barakat",
      contact_person: "Tom Johnson",
      email: "roudy@test.com",
      phone: "987654321",
      address: "456 Elm St",
      industry: "Technology",
      priority_level: "Medium"
    }
  ];

  const employees = [
    { employee_id: 1, name: "Alice Johnson", role: "Project Manager", email: "alice@example.com" },
    { employee_id: 2, name: "Bob Smith", role: "Developer", email: "bob@example.com" },
    { employee_id: 3, name: "Charlie Brown", role: "Tester", email: "charlie@example.com" },
  ];

  const projects = [
    {
      project_id: 1,
      project_name: "Project Alpha",
      status: "In Progress",
      kpi: "Medium",
      completion_percentage: 60,
      budget_total: 100000,
      budget_used: 60000,
      budget_status: "On Track",
      start_date: "2024-01-01",
      launch_date: "2024-06-01",
      customer_id: 1,
      tasks: [
        { task_id: 1, task_name: "Design UI", deadline: "2024-03-01", employee_id: 2, status: "Completed" },
        { task_id: 2, task_name: "Develop Backend", deadline: "2024-04-15", employee_id: 2, status: "In Progress" },
        { task_id: 3, task_name: "Testing", deadline: "2024-05-15", employee_id: 3, status: "To Do" },
      ]
    },
    {
      project_id: 2,
      project_name: "Project Beta",
      status: "Not Started",
      kpi: "Low",
      completion_percentage: 0,
      budget_total: 50000,
      budget_used: 0,
      budget_status: "Not Started",
      start_date: "2024-05-01",
      launch_date: "2024-10-01",
      customer_id: 2,
      tasks: []
    },
      {
      project_id: 3,
      project_name: "Project X",
      status: "Completed",
      kpi: "High",
      completion_percentage: 100,
      budget_total: 10000,
      budget_used: 9500,
      budget_status: "Good",
      start_date: "2024-05-01",
      launch_date: "2024-10-01",
      customer_id: 3,
      tasks: [
        { task_id: 1, task_name: "Design", deadline: "2024-03-01", employee_id: 2, status: "Completed" },
        { task_id: 2, task_name: "Development", deadline: "2024-04-15", employee_id: 2, status: "Completed" },
        { task_id: 3, task_name: "Testing", deadline: "2024-05-15", employee_id: 3, status: "Completed" },
      ]
    }
    
  ];

  const tasks = projects.flatMap(p => p.tasks);

  const [alerts, setAlerts] = useState([
  { alert_id: 1, message: "Database connection timeout", status: "High" },
  { alert_id: 2, message: "New project created", status: "Medium" },
  { alert_id: 3, message: "System running smoothly", status: "Low" },
]);


  // No fetching or CRUD functions needed — all static.

  // Provide no-op async functions for CRUD to avoid errors if called:
  const noopAsync = async () => {};

  const contextValue = useMemo(() => ({
    // Static data arrays
    customers,
    projects,
    tasks,
    alerts,
    employees,

    // Static dropdown options
    STATUS_OPTIONS,
    INDUSTRY_OPTIONS,
    PRIORITY_LEVELS,
    TASK_STATUSES,
    TASK_PRIORITIES,
    KPI_CLASSES,

    // No backend, so these are empty functions
    fetchCustomers: noopAsync,
    fetchProjects: noopAsync,
    fetchTasks: noopAsync,
    fetchAlerts: noopAsync,
    fetchEmployees: noopAsync,

    addProject: noopAsync,
    updateProject: noopAsync,
    deleteProject: noopAsync,

    addTaskToProject: noopAsync,
    updateTaskStatus: noopAsync,
    deleteTask: noopAsync,

    addCustomer: noopAsync,
    updateCustomer: noopAsync,
    deleteCustomer: noopAsync,

    addEmployee: noopAsync,
    updateEmployee: noopAsync,
    deleteEmployee: noopAsync,

    addAlert: noopAsync,
    updateAlert: noopAsync,
    deleteAlert: noopAsync,
  }), [
    customers,
    projects,
    tasks,
    alerts,
    employees,
    STATUS_OPTIONS,
    INDUSTRY_OPTIONS,
    PRIORITY_LEVELS,
    TASK_STATUSES,
    TASK_PRIORITIES,
    KPI_CLASSES,
  ]);

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};
