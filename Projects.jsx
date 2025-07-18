import React, { useState, useContext, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaSpinner, FaSearch, FaPlus, FaClock } from 'react-icons/fa';
import { DataContext } from './DataContext';
import './App.css';

function Projects() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const {
    projects,
    customers,
    fetchProjects,
    fetchCustomers,
    addProject,
    STATUS_OPTIONS,
    KPI_CLASSES // Assuming KPI_CLASSES is ['Low', 'Medium', 'High']
  } = useContext(DataContext);

  const [showAddProject, setShowAddProject] = useState(false);
  const [newProject, setNewProject] = useState({
    project_name: '',
    customer_id: '',
    status: 'Not Started',
    kpi: 'Low',  // Add KPI default value here
    start_date: '',
  });

  useEffect(() => {
    fetchProjects();
    fetchCustomers();
  }, [fetchProjects, fetchCustomers]);

  const renderStatusIcon = useCallback((status) => {
    switch (status) {
      case "Completed":
        return <FaCheckCircle className="status-icon completed" />;
      case "In Progress":
        return <FaSpinner className="status-icon in-progress" />;
      case "On Hold":
        return <FaClock className="status-icon on-hold" />;
      case "Not Started":
        return <div className="status-icon not-started"></div>;
      case "Canceled":
        return <FaSpinner className="status-icon canceled" />;
      default:
        return null;
    }
  }, []);

  const handleProjectClick = useCallback((projectId) => {
    navigate(`/projects/${projectId}`);
  }, [navigate]);

  const handleAddProject = async () => {
    if (!newProject.project_name || !newProject.customer_id || !newProject.status) {
      alert("Project name, customer, and status are required.");
      return;
    }
    try {
      await addProject({
        project_name: newProject.project_name,
        customer_id: parseInt(newProject.customer_id),
        status: newProject.status,
        kpi: newProject.kpi,   // include KPI in the new project data
        start_date: newProject.start_date,
      });
      setNewProject({
        project_name: '',
        customer_id: '',
        status: 'Not Started',
        kpi: 'Low',
        start_date: '',
      });
      setShowAddProject(false);
      fetchProjects();
    } catch (error) {
      console.error("Failed to add project:", error);
      alert("Failed to add project. Please try again.");
    }
  };

  const filteredProjects = useMemo(() => {
    const projectsWithCustomerNames = projects.map(project => ({
      ...project,
      customer_name: customers.find(c => c.customer_id === project.customer_id)?.name || 'N/A',
      customer_email: customers.find(c => c.customer_id === project.customer_id)?.email || 'N/A',
    }));

    return projectsWithCustomerNames.filter(project =>
      project.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [projects, customers, searchTerm]);

  return (
    <main className='main-container'>
      <div className='main-title'>
        <h3>PROJECTS</h3>
        <div className="main-title-actions">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="add-button" onClick={() => setShowAddProject(!showAddProject)}>
            <FaPlus /> Add Project
          </button>
        </div>
      </div>

      {showAddProject && (
        <div className="form-container">
          <h3>Add New Project</h3>
          <div className="form-group">
            <label>Project Name</label>
            <input
              type="text"
              value={newProject.project_name}
              onChange={(e) => setNewProject({ ...newProject, project_name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Customer</label>
            <select
              value={newProject.customer_id}
              onChange={(e) => setNewProject({ ...newProject, customer_id: e.target.value })}
              required
            >
              <option value="">Select Customer</option>
              {customers.map(customer => (
                <option key={customer.customer_id} value={customer.customer_id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              value={newProject.status}
              onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
              required
            >
              <option value="">Select Status</option>
              {STATUS_OPTIONS.map(status => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>KPI</label>
            <select
              value={newProject.kpi}
              onChange={(e) => setNewProject({ ...newProject, kpi: e.target.value })}
              required
            >
              {KPI_CLASSES.map(kpi => (
                <option key={kpi} value={kpi}>{kpi}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              value={newProject.start_date}
              onChange={(e) => {
                const inputDate = new Date(e.target.value);
                const formatted = inputDate.toISOString().split("T")[0];
                setNewProject({ ...newProject, start_date: formatted });
              }}
            />
          </div>
          <div className="form-actions">
            <button onClick={handleAddProject}>Save Project</button>
            <button className="cancel" onClick={() => setShowAddProject(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className='projects-list-container'>
        <h3>All Projects ({filteredProjects.length})</h3>
        <div className="project-list-header">
          <span>Project Name</span>
          <span>Customer</span>
          <span>Status</span>
          <span>KPI_AI_AGENT</span>  {/* Added KPI column */}
          <span>Completion</span>
          {/* Removed Budget column */}
        </div>
        {filteredProjects.length > 0 ? (
          filteredProjects.map(project => (
            <div
              key={project.project_id}
              className='project-item'
              onClick={() => handleProjectClick(project.project_id)}
            >
              <span className="project-name">{project.project_name}</span>
              <span className="project-customer">{project.customer_name}</span>
              <span className="project-status">
                {renderStatusIcon(project.status)}
                {project.status}
              </span>
              <span className="project-kpi">{project.kpi || 'N/A'}</span> {/* Display KPI */}
              <span className="project-completion">
                {project.completion_percentage || 0}%
              </span>
            </div>
          ))
        ) : (
          <div className="no-projects">
            {searchTerm ? 'No projects match your search' : 'No projects found'}
          </div>
        )}
      </div>
    </main>
  );
}

export default Projects;
