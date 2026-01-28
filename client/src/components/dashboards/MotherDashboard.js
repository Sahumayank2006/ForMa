import React, { useState, useEffect } from 'react';
import ChildForm from '../children/ChildForm';
import ActivityTimeline from '../activities/ActivityTimeline';
import { activityService } from '../../services/services';
import { getDisplayName, formatMinutes, getDiaperAlertLevel, extractApiData } from '../../utils/helpers';
import '../activities/ActivityForms.css';

const MotherDashboard = ({ children, fetchChildren }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingChild, setEditingChild] = useState(null);
  const [childSummaries, setChildSummaries] = useState({});
  const [selectedChild, setSelectedChild] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (children.length > 0) {
      loadAllSummaries();
      // Refresh summaries every 30 seconds
      const interval = setInterval(loadAllSummaries, 30000);
      return () => clearInterval(interval);
    }
  }, [children]);

  const loadAllSummaries = async () => {
    setLoading(true);
    const summaries = {};
    for (const child of children) {
      try {
        const [food, diaper, sleep, play] = await Promise.all([
          activityService.getFoodSummary(child._id).catch(() => null),
          activityService.getDiaperSummary(child._id).catch(() => null),
          activityService.getSleepSummary(child._id).catch(() => null),
          activityService.getPlaySummary(child._id).catch(() => null)
        ]);
        summaries[child._id] = { 
          food: extractApiData(food), 
          diaper: extractApiData(diaper), 
          sleep: extractApiData(sleep), 
          play: extractApiData(play) 
        };
      } catch (err) {
        console.error(`Failed to load summaries for ${child.name}`);
      }
    }
    setChildSummaries(summaries);
    setLoading(false);
  };

  const handleAdd = () => {
    setEditingChild(null);
    setShowForm(true);
  };

  const handleEdit = (child) => {
    setEditingChild(child);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingChild(null);
    fetchChildren();
  };



  return (
    <div>
      <div className="dashboard-header">
        <h1>My Children</h1>
        <p>Manage your children's profiles and monitor their care</p>
      </div>

      {/* Alert Banner for Overdue Diapers */}
      {children.some(child => {
        const alertLevel = getDiaperAlertLevel(childSummaries[child._id]?.diaper?.timeSinceLastChange);
        return alertLevel === 'red';
      }) && (
        <div style={{
          background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
          color: 'white',
          padding: '15px 20px',
          borderRadius: '12px',
          marginBottom: '20px',
          boxShadow: '0 4px 12px rgba(238, 90, 111, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontWeight: '600'
        }}>
          <span style={{ fontSize: '1.5em' }}>⚠️</span>
          <div>
            <div style={{ fontSize: '1.1em' }}>Diaper Change Overdue!</div>
            <div style={{ fontSize: '0.9em', opacity: '0.9', marginTop: '4px' }}>
              {children.filter(child => {
                const alertLevel = getDiaperAlertLevel(childSummaries[child._id]?.diaper?.timeSinceLastChange);
                return alertLevel === 'red';
              }).map(c => c.name).join(', ')} needs attention
            </div>
          </div>
        </div>
      )}

      <div className="dashboard-actions">
        <button className="btn-add" onClick={handleAdd}>
          + Add Child
        </button>
        <button className="btn-secondary" onClick={loadAllSummaries} disabled={loading}>
          {loading ? '↻ Refreshing...' : '↻ Refresh Status'}
        </button>
      </div>

      {children.length === 0 ? (
        <div className="empty-state">
          <h3>No children profiles yet</h3>
          <p>Click "Add Child" to create your first child profile</p>
        </div>
      ) : (
        <div className="children-grid">
          {children.map((child) => {
            const summary = childSummaries[child._id] || {};
            const alertLevel = getDiaperAlertLevel(summary.diaper?.timeSinceLastChange);
            
            return (
              <div 
                key={child._id} 
                className="child-card"
              >
                <div className="child-card-header">
                  <div className="child-photo">
                    {child.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="child-info">
                    <h3>{child.name}</h3>
                    <p>ID: {child.childId}</p>
                  </div>
                </div>

                <div className="child-details">
                  <div className="detail-row">
                    <span className="detail-label">Age:</span>
                    <span className="detail-value">{child.age} years</span>
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

                {/* Activity Summary Cards */}
                {summary.food || summary.diaper || summary.sleep || summary.play ? (
                  <>
                    {/* Alert banner if diaper overdue */}
                    {alertLevel === 'red' && (
                      <div style={{
                        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
                        color: 'white',
                        padding: '10px 15px',
                        borderRadius: '8px',
                        marginTop: '1rem',
                        fontSize: '0.9em',
                        fontWeight: '600',
                        textAlign: 'center'
                      }}>
                        ⚠️ Diaper change overdue - {formatMinutes(summary.diaper?.timeSinceLastChange)}
                      </div>
                    )}

                    {/* Daily Summary Stats */}
                    {summary.diaper?.dailyStats && (
                      <div style={{
                        background: '#f5f7fa',
                        padding: '12px',
                        borderRadius: '8px',
                        marginTop: '1rem',
                        fontSize: '0.85rem'
                      }}>
                        <strong>Today's Diaper Summary:</strong>
                        <div style={{ marginTop: '6px' }}>
                          <div>• Total Changes: {summary.diaper.dailyStats.totalChangesToday}</div>
                          <div>• Average Interval: {formatMinutes(summary.diaper.dailyStats.averageInterval)}</div>
                          {summary.diaper.dailyStats.lastRashNote && (
                            <div style={{ color: '#ff9800', marginTop: '4px' }}>
                              ⚠️ Note: {summary.diaper.dailyStats.lastRashNote}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="summary-cards" style={{ marginTop: '1rem' }}>
                    {summary.food && (
                      <div className="summary-card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                        <div className="icon">🍲</div>
                        <div className="label">Last Fed</div>
                        <div className="value">{formatMinutes(summary.food.timeSinceLastFeed)}</div>
                      </div>
                    )}
                    {summary.diaper && (
                      <div className="summary-card" style={{ 
                        background: alertLevel === 'green' 
                          ? 'linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)'
                          : alertLevel === 'yellow'
                          ? 'linear-gradient(135deg, #ff9800 0%, #ffc107 100%)'
                          : 'linear-gradient(135deg, #f44336 0%, #e91e63 100%)'
                      }}>
                        <div className="icon">🧷</div>
                        <div className="label">Diaper Check</div>
                        <div className="value">{formatMinutes(summary.diaper.timeSinceLastChange)}</div>
                      </div>
                    )}
                    {summary.sleep && (
                      <div className="summary-card" style={{ background: 'linear-gradient(135deg, #9c27b0 0%, #673ab7 100%)' }}>
                        <div className="icon">😴</div>
                        <div className="label">
                          {summary.sleep.isCurrentlySleeping ? 'Sleeping Now' : 'Total Sleep Today'}
                        </div>
                        <div className="value">
                          {summary.sleep.isCurrentlySleeping 
                            ? formatMinutes(summary.sleep.currentSleepDuration)
                            : formatMinutes(summary.sleep.totalSleepToday)}
                        </div>
                      </div>
                    )}
                    {summary.play && (
                      <div className="summary-card" style={{ background: 'linear-gradient(135deg, #00bcd4 0%, #03a9f4 100%)' }}>
                        <div className="icon">🎈</div>
                        <div className="label">
                          {summary.play.isCurrentlyPlaying ? 'Playing Now' : 'Total Play Today'}
                        </div>
                        <div className="value">
                          {summary.play.isCurrentlyPlaying 
                            ? formatMinutes(summary.play.currentPlayDuration)
                            : formatMinutes(summary.play.totalPlayToday)}
                        </div>
                      </div>
                    )}
                  </div>
                  </>
                ) : null}

                <div className="child-card-actions">
                  <button 
                    className="btn-view" 
                    onClick={() => setSelectedChild(selectedChild === child._id ? null : child._id)}
                  >
                    {selectedChild === child._id ? 'Hide Timeline' : 'View Timeline'}
                  </button>
                  <button className="btn-edit" onClick={() => handleEdit(child)}>
                    Edit Profile
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

export default MotherDashboard;
