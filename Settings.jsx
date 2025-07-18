import React, { useState, useContext, useEffect, useCallback } from 'react';
import {
  FaUserCog, FaBell, FaPalette, FaLock, FaSignOutAlt, FaSave
} from 'react-icons/fa';
import { DataContext } from './DataContext';
import './App.css';

function Settings() {
  const {
    currentUser,
    updateUserPreferences,
    changePassword,
    logoutUser,
    isAuthenticated
  } = useContext(DataContext);

  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    notifications: {
      projectUpdates: currentUser?.preferences?.notifications?.projectUpdates ?? true,
      taskAssignments: currentUser?.preferences?.notifications?.taskAssignments ?? true,
      overdueAlerts: currentUser?.preferences?.notifications?.overdueAlerts ?? true,
    },
    theme: currentUser?.preferences?.theme || 'light',
  });
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_new_password: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name,
        email: currentUser.email,
        notifications: currentUser.preferences?.notifications ?? {
          projectUpdates: true,
          taskAssignments: true,
          overdueAlerts: true,
        },
        theme: currentUser.preferences?.theme || 'light',
      });
    }
  }, [currentUser]);

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setMessage('');
    if (['current_password', 'new_password', 'confirm_new_password'].includes(name)) {
      setPasswordForm(prev => ({ ...prev, [name]: value }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [name]: checked
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  }, []);

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    setMessage('');
    const success = await updateUserPreferences(formData);
    setMessage(success ? 'Profile updated successfully!' : 'Failed to update profile.');
  };

  const handleSubmitSecurity = async (e) => {
    e.preventDefault();
    setMessage('');
    const { current_password, new_password, confirm_new_password } = passwordForm;
    if (new_password !== confirm_new_password) {
      return setMessage('New password and confirmation do not match.');
    }
    if (new_password.length < 8) {
      return setMessage('New password must be at least 8 characters.');
    }
    try {
      await changePassword(current_password, new_password);
      setPasswordForm({ current_password: '', new_password: '', confirm_new_password: '' });
      setMessage('Password updated successfully!');
    } catch (err) {
      setMessage('Error updating password.');
    }
  };

  

  return (
    <main className="main-container">
      <div className="main-title"><h3>USER SETTINGS</h3></div>
      <div className="settings-layout">
        <aside className="settings-sidebar">
          <ul>
            <li><button className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}><FaUserCog /> Profile</button></li>
            <li><button className={activeTab === 'notifications' ? 'active' : ''} onClick={() => setActiveTab('notifications')}><FaBell /> Notifications</button></li>
            <li><button className={activeTab === 'theme' ? 'active' : ''} onClick={() => setActiveTab('theme')}><FaPalette /> Theme</button></li>
            <li><button className={activeTab === 'security' ? 'active' : ''} onClick={() => setActiveTab('security')}><FaLock /> Security</button></li>
            <li><button onClick={logoutUser}><FaSignOutAlt /> Logout</button></li>
          </ul>
        </aside>

        <div className="settings-content">
          {message && <div className={`message ${message.startsWith('Error') ? 'error' : 'success'}`}>{message}</div>}

          {activeTab === 'profile' && (
            <form onSubmit={handleSubmitProfile} className="settings-card">
              <h4>Update Profile</h4>
              <div className="form-group">
                <label>Name</label>
                <input name="name" value={formData.name} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input name="email" value={formData.email} onChange={handleInputChange} />
              </div>
              <button type="submit" className="save-button"><FaSave /> Save</button>
            </form>
          )}

          {activeTab === 'notifications' && (
            <form onSubmit={handleSubmitProfile} className="settings-card">
              <h4>Notification Settings</h4>
              {['projectUpdates', 'taskAssignments', 'overdueAlerts'].map(key => (
                <div key={key} className="form-group checkbox-group">
                  <label>
                    <input type="checkbox" name={key} checked={formData.notifications[key]} onChange={handleInputChange} />
                    {key.replace(/([A-Z])/g, ' $1')}
                  </label>
                </div>
              ))}
              <button type="submit" className="save-button"><FaSave /> Save</button>
            </form>
          )}

          {activeTab === 'theme' && (
            <form onSubmit={handleSubmitProfile} className="settings-card">
              <h4>Theme Preference</h4>
              {['light', 'dark', 'system'].map(theme => (
                <label key={theme} className="radio-group">
                  <input type="radio" name="theme" value={theme} checked={formData.theme === theme} onChange={handleInputChange} />
                  {theme.charAt(0).toUpperCase() + theme.slice(1)}
                </label>
              ))}
              <button type="submit" className="save-button"><FaSave /> Save</button>
            </form>
          )}

          {activeTab === 'security' && (
            <form onSubmit={handleSubmitSecurity} className="settings-card">
              <h4>Change Password</h4>
              {['current_password', 'new_password', 'confirm_new_password'].map(field => (
                <div key={field} className="form-group">
                  <label>{field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</label>
                  <input type="password" name={field} value={passwordForm[field]} onChange={handleInputChange} />
                </div>
              ))}
              <button type="submit" className="save-button"><FaSave /> Update Password</button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

export default Settings;
