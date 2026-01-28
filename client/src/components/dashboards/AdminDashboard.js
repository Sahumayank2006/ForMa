import React, { useState, useEffect } from 'react';
import { userService, childService, activityService } from '../../services/services';
import ChildForm from '../children/ChildForm';
import ActivityTimeline from '../activities/ActivityTimeline';
import AdminAuditTable from '../admin/AdminAuditTable';
import { getDisplayName, formatMinutes } from '../../utils/helpers';
import '../activities/ActivityForms.css';

const AdminDashboard = ({ children, fetchChildren }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingChild, setEditingChild] = useState(null);
  const [users, setUsers] = useState({ mothers: 0, caretakers: 0, total: 0 });
  const [overdueAlerts, setOverdueAlerts] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStats();
    checkOverdueAlerts();
    // Check alerts every 60 seconds
    const interval = setInterval(checkOverdueAlerts, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await userService.getUsers();
      const allUsers = response.data;
      setUsers({
        total: allUsers.length,
        mothers: allUsers.filter(u => u.role === 'mother').length,
        caretakers: allUsers.filter(u => u.role === 'caretaker').length,
      });
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const checkOverdueAlerts = async () => {
    try {
      setLoading(true);
      const response = await activityService.checkOverdueDiapers();
      setOverdueAlerts(response.data.alerts || []);
    } catch (err) {
      console.error('Failed to check alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingChild(null);
    setShowForm(true);
  };

  const handleEdit = (child) => {
    setEditingChild(child);
    setShowForm(true);
  };

  const handleDelete = async (childId) => {
    if (window.confirm('Are you sure you want to delete this child profile?')) {
      try {
        await childService.deleteChild(childId);
        fetchChildren();
      } catch (err) {
        alert('Failed to delete child: ' + err.response?.data?.message);
      }
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingChild(null);
    fetchChildren();
  };



  return (
    <div>
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage all users and children in the system</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Children</h3>
          <div className="stat-value">{children.length}</div>
        </div>
        <div className="stat-card">
          <h3>Total Users</h3>
          <div className="stat-value">{users.total}</div>
        </div>
        <div className="stat-card">
          <h3>Mothers</h3>
          <div className="stat-value">{users.mothers}</div>
        </div>
        <div className="stat-card">
          <h3>Caretakers</h3>
          <div className="stat-value">{users.caretakers}</div>
        </div>
      </div>

      {/* Overdue Alerts Section */}
      {overdueAlerts.length > 0 && (
        <div style={{ 
          background: 'linear-gradient(135deg, #f44336 0%, #e91e63 100%)', 
          color: 'white', 
          padding: '1.5rem', 
          borderRadius: '10px', 
          marginBottom: '1.5rem',
          boxShadow: '0 4px 12px rgba(244, 67, 54, 0.3)',
          animation: 'pulse 2s infinite'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🚨 Urgent Diaper Alerts ({overdueAlerts.length})
            <button 
              onClick={checkOverdueAlerts} 
              disabled={loading}
              style={{ 
                marginLeft: 'auto', 
                background: 'white', 
                color: '#f44336', 
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              {loading ? '↻ Checking...' : '↻ Refresh'}
            </button>
          </h3>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {overdueAlerts.map((alert, index) => (
              <div 
                key={index} 
                style={{ 
                  background: 'rgba(255, 255, 255, 0.2)', 
                  padding: '0.75rem', 
                  borderRadius: '5px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <strong>{alert.childName}</strong> - Last diaper change: {formatMinutes(alert.minutesSinceLastChange)} ago
                  <div style={{ fontSize: '0.9rem', opacity: '0.9', marginTop: '0.25rem' }}>
                    Caretaker: {getDisplayName(alert.assignedCaretaker, 'Not assigned')} • Mother: {alert.motherName || 'N/A'}
                  </div>
                </div>
                <span style={{ fontSize: '1.5rem' }}>🧷</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Diaper Audit Table */}
      <AdminAuditTable />

      <div className="dashboard-actions">
        <button className="btn-add" onClick={handleAdd}>
          + Add Child
        </button>
      </div>

      {children.length === 0 ? (
        <div className="empty-state">
          <h3>No children in the system</h3>
          <p>Add the first child profile to get started</p>
        </div>
      ) : (
        <div className="children-grid">
          {children.map((child) => {
            
            return (
              <div 
                key={child._id} 
                className="child-card"
              >
                <div className="child-card-header">
                  <div 
                    className="child-photo"
                  >
                    {child.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="child-info">
                    <h3>
                      {child.name}
                    </h3>
                    <p>ID: {child.childId}</p>
                  </div>
                </div>
              <div className="child-details">
                <div className="detail-row">
                  <span className="detail-label">Age:</span>
                  <span className="detail-value">{child.age} years</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Mother:</span>
                  <span className="detail-value">
                    {getDisplayName(child.mother)}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Caretaker:</span>
                  <span className="detail-value">
                    {getDisplayName(child.assignedCaretaker, 'Not assigned')}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Room:</span>
                  <span className="detail-value">
                    {child.assignedRoom || 'Not assigned'}
                  </span>
                </div>
              </div>
              <div className="child-card-actions">
                <button 
                  className="btn-view"
                  onClick={() => setSelectedChild(selectedChild === child._id ? null : child._id)}
                >
                  {selectedChild === child._id ? 'Hide Timeline' : 'View Timeline'}
                </button>
                <button className="btn-edit" onClick={() => handleEdit(child)}>
                  Edit
                </button>
                <button className="btn-delete" onClick={() => handleDelete(child._id)}>
                  Delete
                </button>
              </div>

              {/* Activity Timeline */}
              {selectedChild === child._id && (
                <div style={{ marginTop: '1rem' }}>
                  <ActivityTimeline childId={child._id} />
                </div>
              )}
            </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <ChildForm
          child={editingChild}
          onClose={handleFormClose}
          onSuccess={handleFormClose}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
