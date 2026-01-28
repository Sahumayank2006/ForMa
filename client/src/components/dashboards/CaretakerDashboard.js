import React, { useState, useEffect, useCallback } from 'react';
import FoodForm from '../activities/FoodForm';
import DiaperPanel from '../activities/DiaperPanel';
import CryPanel from '../activities/CryPanel';
import SleepForm from '../activities/SleepForm';
import PlayForm from '../activities/PlayForm';
import CryForm from '../activities/CryForm';
import ActivityTimeline from '../activities/ActivityTimeline';
import { activityService } from '../../services/services';
import { getDisplayName, formatMinutes, getDiaperAlertLevel, extractApiData } from '../../utils/helpers';
import '../activities/ActivityForms.css';

const CaretakerDashboard = ({ children, fetchChildren }) => {
  const [selectedChild, setSelectedChild] = useState(null);
  const [activeForm, setActiveForm] = useState(null);
  const [childSummaries, setChildSummaries] = useState({});

  const loadAllSummaries = useCallback(async () => {
    const summaries = {};
    for (const child of children) {
      try {
        const [food, diaper, sleep, play, cry] = await Promise.all([
          activityService.getFoodSummary(child._id).catch(() => null),
          activityService.getDiaperSummary(child._id).catch(() => null),
          activityService.getSleepSummary(child._id).catch(() => null),
          activityService.getPlaySummary(child._id).catch(() => null),
          activityService.getCrySummary(child._id).catch(() => null)
        ]);
        summaries[child._id] = { 
          food: extractApiData(food), 
          diaper: extractApiData(diaper), 
          sleep: extractApiData(sleep), 
          play: extractApiData(play),
          cry: extractApiData(cry)
        };
      } catch (err) {
        console.error(`Failed to load summaries for ${child.name}`);
      }
    }
    setChildSummaries(summaries);
  }, [children]);

  useEffect(() => {
    if (children.length > 0) {
      loadAllSummaries();
    }
  }, [children, loadAllSummaries]);

  const openActivityForm = (child, formType) => {
    setSelectedChild(child);
    setActiveForm(formType);
  };

  const closeModal = () => {
    setSelectedChild(null);
    setActiveForm(null);
    loadAllSummaries();
  };



  return (
    <div>
      <div className="dashboard-header">
        <h1>Assigned Children</h1>
        <p>View and monitor the children under your care</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Children</h3>
          <div className="stat-value">{children.length}</div>
        </div>
      </div>

      {children.length === 0 ? (
        <div className="empty-state">
          <h3>No children assigned yet</h3>
          <p>You will see children here once they are assigned to you</p>
        </div>
      ) : (
        <>
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
                    <div 
                      className="child-photo"
                    >
                      {child.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="child-info">
                      <h3>
                        {child.name}
                        <span 
                          className={`status-badge ${alertLevel}`}
                          style={{ 
                            marginLeft: '10px', 
                            fontSize: '0.9em',
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontWeight: '600'
                          }}
                        >
                          {alertLevel === 'green' && '🟢 Fresh'}
                          {alertLevel === 'yellow' && '🟡 Due Soon'}
                          {alertLevel === 'red' && '🔴 Overdue'}
                        </span>
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
                      <span className="detail-label">Room:</span>
                      <span className="detail-value">
                        {child.assignedRoom || 'Not assigned'}
                      </span>
                    </div>
                    {child.allergies && child.allergies.length > 0 && (
                      <div className="detail-row">
                        <span className="detail-label">Allergies:</span>
                        <span className="detail-value" style={{ color: '#f44336' }}>
                          {child.allergies.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Activity Summary */}
                  {summary.food || summary.diaper || summary.sleep || summary.play ? (
                    <div style={{ margin: '1rem 0', padding: '0.75rem', background: '#f9f9f9', borderRadius: '8px', fontSize: '0.85rem' }}>
                      <div style={{ marginBottom: '0.5rem' }}>
                        <strong>🍲 Last Fed:</strong> {formatMinutes(summary.food?.timeSinceLastFeed)} ago
                      </div>
                      <div style={{ marginBottom: '0.5rem' }}>
                        <strong>🧷 Diaper:</strong> {formatMinutes(summary.diaper?.timeSinceLastChange)} ago
                        <span className={`alert-badge ${alertLevel}`} style={{ marginLeft: '0.5rem' }}>
                          {alertLevel === 'green' && '✓ OK'}
                          {alertLevel === 'yellow' && '⚠ Check Soon'}
                          {alertLevel === 'red' && '🚨 Urgent'}
                        </span>
                      </div>
                      {summary.sleep?.isCurrentlySleeping && (
                        <div style={{ marginBottom: '0.5rem', color: '#667eea' }}>
                          <strong>😴 Sleeping now</strong> ({formatMinutes(summary.sleep.currentSleepDuration)})
                        </div>
                      )}
                      {summary.play?.isCurrentlyPlaying && (
                        <div style={{ color: '#4caf50' }}>
                          <strong>🎈 Playing now</strong> ({formatMinutes(summary.play.currentPlayDuration)})
                        </div>
                      )}
                      {summary.cry?.isCurrentlyCrying && (
                        <div style={{ color: '#d32f2f' }}>
                          <strong>😢 Crying now</strong> ({formatMinutes(summary.cry.currentCryDuration)})
                        </div>
                      )}
                    </div>
                  ) : null}

                  {/* Enhanced Diaper Panel */}
                  <DiaperPanel child={child} onSuccess={loadAllSummaries} />

                  {/* Cry Panel */}
                  <div style={{ marginTop: '1rem' }}>
                    <CryPanel child={child} onSuccess={loadAllSummaries} />
                  </div>

                  {/* Activity Buttons */}
                  <div className="activity-buttons">
                    <button 
                      className="activity-btn"
                      onClick={() => openActivityForm(child, 'food')}
                    >
                      <span className="icon">🍲</span>
                      <span>Feed</span>
                    </button>
                    <button 
                      className="activity-btn"
                      onClick={() => openActivityForm(child, 'sleep')}
                      style={summary.sleep?.isCurrentlySleeping ? { borderColor: '#667eea', background: '#f0f4ff' } : {}}
                    >
                      <span className="icon">😴</span>
                      <span>{summary.sleep?.isCurrentlySleeping ? 'End Sleep' : 'Start Sleep'}</span>
                    </button>
                    <button 
                      className="activity-btn"
                      onClick={() => openActivityForm(child, 'play')}
                      style={summary.play?.isCurrentlyPlaying ? { borderColor: '#4caf50', background: '#f1f8f4' } : {}}
                    >
                      <span className="icon">🎈</span>
                      <span>{summary.play?.isCurrentlyPlaying ? 'End Play' : 'Start Play'}</span>
                    </button>
                    <button 
                      className="activity-btn"
                      onClick={() => openActivityForm(child, 'cry')}
                      style={summary.cry?.isCurrentlyCrying ? { borderColor: '#d32f2f', background: '#ffebee' } : {}}
                    >
                      <span className="icon">😢</span>
                      <span>{summary.cry?.isCurrentlyCrying ? 'End Cry' : 'Log Cry'}</span>
                    </button>
                  </div>

                  {/* Activity Timeline */}
                  <div style={{ marginTop: '1rem' }}>
                    <ActivityTimeline childId={child._id} />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Activity Form Modal */}
      {selectedChild && activeForm && (
        <div className="activity-modal" onClick={closeModal}>
          <div className="activity-modal-content" onClick={(e) => e.stopPropagation()}>
            {activeForm === 'food' && (
              <FoodForm childId={selectedChild._id} childName={selectedChild.name} onClose={closeModal} />
            )}
            {activeForm === 'sleep' && (
              <SleepForm 
                childId={selectedChild._id} 
                childName={selectedChild.name} 
                activeSleep={childSummaries[selectedChild._id]?.sleep?.activeSleep}
                onClose={closeModal} 
              />
            )}
            {activeForm === 'play' && (
              <PlayForm 
                childId={selectedChild._id} 
                childName={selectedChild.name} 
                activePlay={childSummaries[selectedChild._id]?.play?.activePlay}
                onClose={closeModal} 
              />
            )}
            {activeForm === 'cry' && (
              <CryForm 
                childId={selectedChild._id} 
                childName={selectedChild.name} 
                activeCry={childSummaries[selectedChild._id]?.cry?.activeCry}
                onClose={closeModal} 
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CaretakerDashboard;
