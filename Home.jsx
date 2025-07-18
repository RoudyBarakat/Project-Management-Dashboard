import React, { useState, useEffect, useCallback, useContext, useMemo } from 'react';
import {
  BsFillArchiveFill,
  BsListCheck,
  BsPeopleFill,
  BsFillBellFill,
  BsCurrencyDollar
} from 'react-icons/bs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { DataContext } from './DataContext';

const STATUS_COLORS = {
  Pending: '#8884d8',
  Completed: '#82ca9d',
  Overdue: '#ff7f7f'
};

function Home() {
  const navigate = useNavigate();
  const {
    projects,
    tasks,
    alerts,
    customers,
    fetchProjects,
    fetchTasks,
    fetchAlerts,
    fetchCustomers
  } = useContext(DataContext);

  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    totalCustomers: 0,
    totalBudget: 0,
    totalAlerts: 0
  });

  useEffect(() => {
    fetchProjects();
    fetchTasks();
    fetchAlerts();
    fetchCustomers();
  }, [fetchProjects, fetchTasks, fetchAlerts, fetchCustomers]);

  useEffect(() => {
    const totalProjects = projects.length;
    const totalTasks = tasks.length;
    const totalCustomers = customers.length;
    const totalBudget = projects.reduce((sum, project) => sum + (project.budget_total || 0), 0);
    const totalAlerts = alerts.length;

    setStats({
      totalProjects,
      totalTasks,
      totalCustomers,
      totalBudget,
      totalAlerts
    });
  }, [projects, tasks, alerts, customers]);

  const chartData = useMemo(() => {
    return projects.map(project => ({
      name: project.project_name,
      budget: project.budget_total || 0,
      spent: project.budget_used || 0,
      id: project.project_id
    }));
  }, [projects]);

  const pieData = useMemo(() => {
    const counts = { Pending: 2, Completed: 0, Overdue: 1 };
    tasks.forEach(task => {
      if (counts[task.status] !== undefined) {
        counts[task.status]++;
      }
    });
    return Object.keys(counts).map(status => ({
      name: status,
      value: counts[status]
    }));
  }, [tasks]);

  const handleBarClick = useCallback(
    (data) => {
      if (data && data.payload && data.payload.id) {
        navigate(`/projects/${data.payload.id}`);
      }
    },
    [navigate]
  );

  return (
    <main className='main-container' style={{ overflow: 'hidden', height: '100vh' }}>
      <div className='main-title'>
        <h3>DASHBOARD</h3>
      </div>

      <div className='main-cards'>
        <div className='card' onClick={() => navigate('/projects')} style={{ cursor: 'pointer' }}>
          <div className='card-inner'>
            <h3>PROJECTS</h3>
            <BsFillArchiveFill className='card_icon' />
          </div>
          <h1>{stats.totalProjects}</h1>
        </div>

        <div className='card' onClick={() => navigate('/tasks')} style={{ cursor: 'pointer' }}>
          <div className='card-inner'>
            <h3>TASKS</h3>
            <BsListCheck className='card_icon' />
          </div>
          <h1>{stats.totalTasks}</h1>
        </div>

        <div className='card' onClick={() => navigate('/customers')} style={{ cursor: 'pointer' }}>
          <div className='card-inner'>
            <h3>CUSTOMERS</h3>
            <BsPeopleFill className='card_icon' />
          </div>
          <h1>{stats.totalCustomers}</h1>
        </div>

        <div className='card'>
          <div className='card-inner'>
            <h3>TOTAL BUDGET</h3>
            <BsCurrencyDollar className='card_icon' />
          </div>
          <h1>${stats.totalBudget.toLocaleString()}</h1>
        </div>

        <div className='card' onClick={() => navigate('/alerts')} style={{ cursor: 'pointer' }}>
          <div className='card-inner'>
            <h3>ALERTS</h3>
            <BsFillBellFill className='card_icon' />
          </div>
          <h1>{stats.totalAlerts}</h1>
        </div>
      </div>

     <div className='charts' style={{
  display: 'flex',
  flexWrap: 'wrap',
  gap: '20px',
  flex: 1,
  overflow: 'auto',
  minHeight: 0
}}>

        <div className='chart-container' style={{
  flex: 1,
  minWidth: '400px',
  maxHeight: '300px',
  overflow: 'hidden'
}}>

          <h3>Project Budget Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              onClick={handleBarClick}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
              <Tooltip
                formatter={(value, name) => {
                  const label = name === 'spent' ? 'Spent' : 'Budget';
                  return [`$${value.toLocaleString()}`, label];
                }}
                labelFormatter={(name) => `Project: ${name}`}
              />
              <Legend />
              <Bar dataKey="budget" fill="#8884d8" name="Budget" />
              <Bar dataKey="spent" fill="#82ca9d" name="Spent" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className='chart-container' style={{ flex: 1, minWidth: '400px' }}>
          <h3>Task Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || '#ccc'} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </main>
  );
}

export default Home;
