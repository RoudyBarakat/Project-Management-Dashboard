import React, { useContext, useMemo } from 'react';
import { FaBell, FaExclamationCircle, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { DataContext } from './DataContext';
import './App.css';

function Alerts() {
  const { alerts } = useContext(DataContext);

  // Categorize alerts
  const highAlerts = useMemo(() => alerts.filter(a => (a.status || '').toLowerCase() === 'high'), [alerts]);
  const mediumAlerts = useMemo(() => alerts.filter(a => (a.status || '').toLowerCase() === 'medium'), [alerts]);
  const lowAlerts = useMemo(() => alerts.filter(a => (a.status || '').toLowerCase() === 'low'), [alerts]);

  const renderStatusIcon = (status) => {
    const level = (status || '').toLowerCase();
    switch (level) {
      case 'high': return <FaExclamationCircle className="status-icon high" />;
      case 'medium': return <FaBell className="status-icon medium" />;
      case 'low': return <FaCheckCircle className="status-icon low" />;
      default: return <FaTimesCircle className="status-icon unknown" />;
    }
  };

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>ALERTS</h3>
      </div>

      <div className="main-cards">
        <div className="card high-alert">
          <div className="card-inner">
            <h3>HIGH</h3>
          </div>
          <h1>{highAlerts.length}</h1>
        </div>
        <div className="card medium-alert">
          <div className="card-inner">
            <h3>MEDIUM</h3>
          </div>
          <h1>{mediumAlerts.length}</h1>
        </div>
        <div className="card low-alert">
          <div className="card-inner">
            <h3>LOW</h3>
          </div>
          <h1>{lowAlerts.length}</h1>
        </div>
      </div>

      <div className="tasks-container">
        <h3>All Alerts ({alerts.length})</h3>

        <div className="tasks-list-header">
          <span>Status</span>
          <span>Message</span>
        </div>

        {alerts.length > 0 ? (
          alerts.map((alert) => (
            <div key={alert.alert_id || alert.id} className="task-item">
              <span className={`task-status status-${(alert.status || '').toLowerCase()}`}>
                {renderStatusIcon(alert.status)}
                {alert.status || 'Unknown'}
              </span>
              <span className="task-name">{alert.message}</span>
            </div>
          ))
        ) : (
          <div className="no-tasks">No alerts found</div>
        )}
      </div>
    </main>
  );
}

export default Alerts;
