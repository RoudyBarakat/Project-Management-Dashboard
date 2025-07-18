import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaSpinner, FaClock, FaArrowLeft, FaPlus, FaEdit, FaUser } from 'react-icons/fa';
import { DataContext } from './DataContext';
import './App.css';

function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    projects,
    employees,
    STATUS_OPTIONS,
    // Removed fetchProjects, fetchEmployees, addTaskToProject, updateTaskStatus, updateProject since static mode
  } = useContext(DataContext);

  const [project, setProject] = useState(null);
  const [newTask, setNewTask] = useState({
    task_name: '',
    deadline: '',
    employee_id: ''
  });
  const [showAddTask, setShowAddTask] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedProject, setEditedProject] = useState(null);

  const projectId = parseInt(id);

  // Load project and set edited project from static data
  useEffect(() => {
    const foundProject = projects.find(p => p.project_id === projectId);
    if (foundProject) {
      setProject(foundProject);
      setEditedProject(foundProject);
    }
  }, [projects, projectId]);

  // Memoize tasks list
  const projectTasks = useMemo(() => {
    return project ? project.tasks || [] : [];
  }, [project]);

  // Get employee name by id
  const getEmployeeName = useCallback((id) => {
    const emp = employees.find(e => e.employee_id === id);
    return emp ? emp.name : 'Unassigned';
  }, [employees]);

  const renderStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <FaCheckCircle className="status-icon completed" />;
      case 'In Progress': return <FaSpinner className="status-icon in-progress" />;
      case 'Overdue': return <FaClock className="status-icon overdue" />;
      case 'Not Started': return <div className="status-icon not-started" />;
      case 'On Hold': return <FaClock className="status-icon on-hold" />;
      default: return null;
    }
  };

  // Disabled: Adding task not functional in static mode
  const handleAddTask = () => {
    if (!newTask.task_name || !newTask.deadline || !newTask.employee_id) {
      alert("All task fields are required.");
      return;
    }
    alert("Adding tasks is disabled in static mode.");
    setNewTask({ task_name: '', deadline: '', employee_id: '' });
    setShowAddTask(false);
  };

  // Disabled: Updating task status not functional in static mode
  const handleUpdateTaskStatus = (taskId, currentStatus) => {
    alert("Updating task status is disabled in static mode.");
  };

  // Edit mode handlers: edits are local only (no save to backend)
  const handleEditProject = () => setEditMode(true);

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditedProject(project);
  };

  const handleSaveProject = () => {
    if (!editedProject.project_name || !editedProject.status) {
      alert('Project name and status are required.');
      return;
    }
    alert("Editing projects is disabled in static mode.");
    setEditMode(false);
    setEditedProject(project);
  };

  // Show loading if project not found yet
  if (!project) {
    return (
      <div className="main-container">
        <button className="back-button" onClick={() => navigate('/projects')}>
          <FaArrowLeft /> Back to Projects
        </button>
        <p>Loading project...</p>
      </div>
    );
  }

  return (
    <main className="main-container">
      <button className="back-button" onClick={() => navigate('/projects')}>
        <FaArrowLeft /> Back to Projects
      </button>

      <div className="details-header">
        <h2>{project.project_name}</h2>
        {!editMode ? (
          <button className="add-button" onClick={handleEditProject}>
            <FaEdit /> Edit Project
          </button>
        ) : (
          <>
            <button className="add-button" onClick={handleSaveProject}>
              <FaCheckCircle /> Save
            </button>
            <button className="cancel" onClick={handleCancelEdit} style={{ marginLeft: '10px' }}>
              Cancel
            </button>
          </>
        )}
      </div>

      <div className="details-info">
        <div className="info-item">
          <strong>Status</strong>
          {!editMode ? (
            <span>{renderStatusIcon(project.status)} {project.status}</span>
          ) : (
            <select
              value={editedProject.status}
              onChange={(e) => setEditedProject({ ...editedProject, status: e.target.value })}
            >
              <option value="">Select Status</option>
              {STATUS_OPTIONS.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          )}
        </div>

        <div className="info-item">
          <strong>Completion</strong>
          {!editMode ? (
            <span>{project.completion_percentage || 0}%</span>
          ) : (
            <input
              type="number"
              value={editedProject.completion_percentage || 0}
              onChange={(e) => setEditedProject({ ...editedProject, completion_percentage: parseFloat(e.target.value) })}
              min="0"
              max="100"
            />
          )}
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{ width: `${project.completion_percentage || 0}%` }}
            >
              {project.completion_percentage || 0}%
            </div>
          </div>
        </div>

        <div className="info-item">
          <strong>Budget</strong>
          {!editMode ? (
            <span>${project.budget_total || 0} (Used: ${project.budget_used || 0})</span>
          ) : (
            <>
              <label>Total:</label>
              <input
                type="number"
                value={editedProject.budget_total || 0}
                onChange={(e) => setEditedProject({ ...editedProject, budget_total: parseFloat(e.target.value) })}
              />
              <label>Used:</label>
              <input
                type="number"
                value={editedProject.budget_used || 0}
                onChange={(e) => setEditedProject({ ...editedProject, budget_used: parseFloat(e.target.value) })}
              />
            </>
          )}
        </div>

        <div className="info-item">
          <strong>Dates</strong>
          <span>Start: {project.start_date || 'N/A'}</span>
          <span>Launch: {project.launch_date || 'N/A'}</span>
          {editMode && (
            <>
              <label>Start:</label>
              <input
                type="date"
                value={editedProject.start_date || ''}
                onChange={(e) => setEditedProject({ ...editedProject, start_date: e.target.value })}
              />
              <label>Launch:</label>
              <input
                type="date"
                value={editedProject.launch_date || ''}
                onChange={(e) => setEditedProject({ ...editedProject, launch_date: e.target.value })}
              />
            </>
          )}
        </div>
      </div>

      <div className="project-section">
        <h3>Tasks ({projectTasks.length})</h3>
        <button className="add-button" onClick={() => setShowAddTask(!showAddTask)}>
          <FaPlus /> Add New Task
        </button>

        {showAddTask && (
          <div className="form-container">
            <h4>Add New Task (Disabled in Static Mode)</h4>
            <div className="form-group">
              <label>Task Name</label>
              <input
                type="text"
                value={newTask.task_name}
                onChange={(e) => setNewTask({ ...newTask, task_name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Deadline</label>
              <input
                type="date"
                value={newTask.deadline}
                onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Assigned To</label>
              <select
                value={newTask.employee_id}
                onChange={(e) => setNewTask({ ...newTask, employee_id: e.target.value })}
              >
                <option value="">Select Employee</option>
                {employees.map(emp => (
                  <option key={emp.employee_id} value={emp.employee_id}>
                    {emp.name}
                  </option>
                ))}
              </select>
            </div>
            <button onClick={handleAddTask}>Add Task</button>
            <button className="cancel" onClick={() => setShowAddTask(false)} style={{ marginLeft: '10px' }}>Cancel</button>
          </div>
        )}

        {projectTasks.length > 0 ? (
          <table className="tasks-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Task</th>
                <th>Deadline</th>
                <th>Assigned To</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projectTasks.map(task => (
                <tr key={task.task_id}>
                  <td>{renderStatusIcon(task.status)} {task.status}</td>
                  <td>{task.task_name}</td>
                  <td>{task.deadline}</td>
                  <td><FaUser /> {getEmployeeName(task.employee_id)}</td>
                  <td>
                    <button onClick={() => handleUpdateTaskStatus(task.task_id, task.status)}>
                      {task.status === 'Completed' ? 'Mark Pending' : 'Mark Completed'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No tasks found.</p>
        )}
      </div>
    </main>
  );
}

export default ProjectDetails;
