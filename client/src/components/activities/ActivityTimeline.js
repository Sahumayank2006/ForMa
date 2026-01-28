import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { activityService } from '../../services/services';
import { getDisplayName, formatTimeAgo, extractApiData } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import './ActivityForms.css';

const ActivityTimeline = ({ childId }) => {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  const loadTimeline = useCallback(async () => {
    try {
      setLoading(true);
      const response = await activityService.getTimeline(childId);
      const timelineData = extractApiData(response) || [];
      console.log('Timeline raw data:', timelineData);
      setTimeline(Array.isArray(timelineData) ? timelineData : []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load timeline');
      setTimeline([]);
    } finally {
      setLoading(false);
    }
  }, [childId]);

  useEffect(() => {
    loadTimeline();
    // Refresh timeline every 30 seconds
    const interval = setInterval(loadTimeline, 30000);
    return () => clearInterval(interval);
  }, [loadTimeline]);

  const openActivityModal = useCallback(() => {
    console.log('Opening activity modal...');
    setIsModalOpen(true);
  }, []);

  const closeActivityModal = useCallback(() => {
    console.log('Closing activity modal...');
    setIsModalOpen(false);
  }, []);

  const handleDeleteActivity = useCallback(async (activityId, activityType) => {
    if (!window.confirm(`Are you sure you want to delete this ${activityType} activity? This action cannot be undone.`)) {
      return;
    }

    try {
      switch (activityType) {
        case 'food':
          await activityService.deleteFood(activityId);
          break;
        case 'diaper':
          await activityService.deleteDiaper(activityId);
          break;
        case 'sleep':
          await activityService.deleteSleep(activityId);
          break;
        case 'play':
          await activityService.deletePlay(activityId);
          break;
        case 'cry':
          await activityService.deleteCry(activityId);
          break;
        default:
          throw new Error('Unknown activity type');
      }
      
      // Reload timeline after successful deletion
      await loadTimeline();
      alert(`${activityType.charAt(0).toUpperCase() + activityType.slice(1)} activity deleted successfully!`);
    } catch (err) {
      console.error('Delete error:', err);
      alert(err.response?.data?.message || `Failed to delete ${activityType} activity`);
    }
  }, [loadTimeline]);

  console.log('ActivityTimeline render - isModalOpen:', isModalOpen, 'timeline length:', timeline.length);

  const getActivityIcon = (type) => {
    const icons = {
      food: '🍲',
      diaper: '🧷',
      sleep: '😴',
      play: '🎈',
      cry: '😢'
    };
    return icons[type] || '📝';
  };

  const formatDuration = (minutes) => {
    if (!minutes) return 'Unknown';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const formatFullDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    return date.toLocaleString('en-US', options);
  };

  const renderActivityDetails = (activity) => {
    // Safety check for activity and details
    if (!activity || !activity.details) {
      console.warn('Activity missing details:', activity);
      return <div className="timeline-title">Activity (No details available)</div>;
    }

    console.log(`Rendering ${activity.type} activity:`, activity.details);

    switch (activity.type) {
      case 'food':
        const foodEmoji = {
          'Milk': '🍼',
          'Formula': '🍼',
          'Solid Food': '🍽️',
          'Snack': '🍪',
          'Fruits': '🍎',
          'Vegetables': '🥗'
        }[activity.details.foodType] || '🍲';
        
        return (
          <>
            <div className="timeline-title-compact">
              <span className="activity-icon-badge">{foodEmoji}</span>
              <span className="activity-main-text">
                {activity.details.foodType || 'Food'} 
                <span className="quantity-badge">({activity.details.quantity || 'N/A'} {activity.details.unit || ''})</span>
              </span>
              <span className="activity-badge-mini completed">✓</span>
            </div>
            {activity.details.notes && (
              <div className="activity-notes">
                <span className="notes-icon">📝</span>
                {activity.details.notes}
              </div>
            )}
          </>
        );
      case 'diaper':
        const diaperStatus = activity.details.status || 'Unknown';
        const diaperEmoji = {
          'Clean': '✨',
          'Wet': '💧',
          'Soiled': '💩',
          'Unknown': '❓'
        }[diaperStatus] || '🧷';
        
        return (
          <>
            <div className="timeline-title-compact">
              <span className="activity-icon-badge">🧷</span>
              <span className="activity-main-text">
                Diaper Change
                <span className={`status-badge status-${diaperStatus.toLowerCase()}`}>
                  {diaperEmoji} {diaperStatus}
                </span>
              </span>
              <span className="activity-badge-mini completed">✓</span>
            </div>
            {activity.details.notes && (
              <div className="activity-notes">
                <span className="notes-icon">📝</span>
                {activity.details.notes}
              </div>
            )}
          </>
        );
      case 'sleep':
        const isActiveSleep = activity.details.isActive === true;
        const sleepStartTime = activity.details.startTime || activity.timestamp;
        const sleepEndTime = activity.details.endTime;
        const sleepDuration = activity.details.duration;
        const currentDuration = isActiveSleep 
          ? formatDuration(Math.floor((new Date() - new Date(sleepStartTime)) / 60000))
          : formatDuration(sleepDuration || 0);
        const qualityEmoji = {
          'Deep': '🌙',
          'Light': '☁️',
          'Restless': '😰'
        }[activity.details.quality] || '';
        
        return (
          <>
            <div className="timeline-title-compact">
              <span className="activity-icon-badge">😴</span>
              <span className="activity-main-text">
                Sleep Session {isActiveSleep ? 'Started' : 'Completed'}
                <span className="duration-badge">
                  ⏱️ {currentDuration}{isActiveSleep ? ' (ongoing)' : ''}
                </span>
              </span>
              <span className={`activity-badge-mini ${isActiveSleep ? 'ongoing' : 'completed'}`}>
                {isActiveSleep ? '🔄' : '✓'}
              </span>
            </div>
            <div className="activity-meta">
              <span className="meta-item">
                🛏️ Sleep From: <strong>{formatFullDateTime(sleepStartTime)}</strong>
              </span>
              {!isActiveSleep && sleepEndTime && (
                <span className="meta-item">
                  ⏰ Sleep To: <strong>{formatFullDateTime(sleepEndTime)}</strong>
                </span>
              )}
              {activity.details.quality && activity.details.quality !== 'Unknown' && (
                <span className="meta-item">
                  {qualityEmoji} Quality: {activity.details.quality}
                </span>
              )}
            </div>
            {activity.details.notes && (
              <div className="activity-notes">
                <span className="notes-icon">📝</span>
                {activity.details.notes}
              </div>
            )}
            {isActiveSleep && (
              <div className="activity-alert info">
                💤 Currently sleeping...
              </div>
            )}
          </>
        );
      case 'play':
        const playStartTime = activity.details.startTime || activity.timestamp;
        const playEndTime = activity.details.endTime;
        const playDuration = activity.details.duration;
        const isActivePlay = !playEndTime; // Active only if there's no end time
        const currentPlayDuration = isActivePlay 
          ? formatDuration(Math.floor((new Date() - new Date(playStartTime)) / 60000))
          : formatDuration(playDuration || 0);
        const playEmoji = {
          'Indoor': '🏠',
          'Outdoor': '🌳',
          'Toys': '🧸',
          'Games': '🎮',
          'Creative': '🎨',
          'Physical': '⚽'
        }[activity.details.playType] || '🎈';
        const levelEmoji = {
          'High': '🔥',
          'Medium': '⚡',
          'Low': '🌱'
        }[activity.details.activityLevel] || '';
        
        return (
          <>
            <div className="timeline-title-compact">
              <span className="activity-icon-badge">{playEmoji}</span>
              <span className="activity-main-text">
                {activity.details.playType || 'Play'} Session
                <span className="duration-badge">
                  ⏱️ {currentPlayDuration}{isActivePlay ? ' (ongoing)' : ''}
                </span>
              </span>
              <span className={`activity-badge-mini ${isActivePlay ? 'ongoing' : 'completed'}`}>
                {isActivePlay ? '🔄' : '✓'}
              </span>
            </div>
            <div className="activity-meta">
              <span className="meta-item">
                🎯 Play Start: <strong>{formatFullDateTime(playStartTime)}</strong>
              </span>
              {!isActivePlay && playEndTime && (
                <span className="meta-item">
                  🏁 Play End: <strong>{formatFullDateTime(playEndTime)}</strong>
                </span>
              )}
              {activity.details.activityLevel && (
                <span className="meta-item">
                  {levelEmoji} Intensity: {activity.details.activityLevel}
                </span>
              )}
            </div>
            {activity.details.notes && (
              <div className="activity-notes">
                <span className="notes-icon">📝</span>
                {activity.details.notes}
              </div>
            )}
            {isActivePlay && (
              <div className="activity-alert info">
                🎯 Currently playing...
              </div>
            )}
          </>
        );
      case 'cry':
        const cryStartTime = activity.details.startTime || activity.timestamp;
        const cryEndTime = activity.details.endTime;
        const cryDuration = activity.details.duration;
        const isActiveCry = activity.details.isActive === true;
        const currentCryDuration = isActiveCry 
          ? formatDuration(Math.floor((new Date() - new Date(cryStartTime)) / 60000))
          : formatDuration(cryDuration || 0);
        const intensityEmoji = {
          'Mild': '😢',
          'Moderate': '😭',
          'Severe': '😫'
        }[activity.details.intensity] || '😢';
        const reasonEmoji = {
          'Hungry': '🍼',
          'Diaper': '🧷',
          'Tired': '😴',
          'Pain': '🤕',
          'Attention': '👋'
        }[activity.details.reason] || '❓';
        
        return (
          <>
            <div className="timeline-title-compact">
              <span className="activity-icon-badge">😢</span>
              <span className="activity-main-text">
                Cry Session {isActiveCry ? 'Started' : 'Ended'}
                <span className="duration-badge">
                  ⏱️ {currentCryDuration}{isActiveCry ? ' (ongoing)' : ''}
                </span>
              </span>
              <span className={`activity-badge-mini ${isActiveCry ? 'ongoing' : 'completed'}`}>
                {isActiveCry ? '🔄' : '✓'}
              </span>
            </div>
            <div className="activity-meta">
              <span className="meta-item">
                😢 Cry Start: <strong>{formatFullDateTime(cryStartTime)}</strong>
              </span>
              {!isActiveCry && cryEndTime && (
                <span className="meta-item">
                  ✅ Cry End: <strong>{formatFullDateTime(cryEndTime)}</strong>
                </span>
              )}
              {!isActiveCry && cryDuration && (
                <span className="meta-item">
                  ⏱️ Duration: <strong>{currentCryDuration}</strong>
                </span>
              )}
              {activity.details.intensity && (
                <span className="meta-item">
                  {intensityEmoji} Intensity: {activity.details.intensity}
                </span>
              )}
              {activity.details.reason && (
                <span className="meta-item">
                  {reasonEmoji} Reason: {activity.details.reason}
                </span>
              )}
            </div>
            {activity.details.notes && (
              <div className="activity-notes">
                <span className="notes-icon">📝</span>
                {activity.details.notes}
              </div>
            )}
            {isActiveCry && (
              <div className="activity-alert info" style={{ background: '#ffebee' }}>
                😢 Currently crying...
              </div>
            )}
          </>
        );
      default:
        return <div className="timeline-title">Activity</div>;
    }
  };

  if (loading && timeline.length === 0) {
    return (
      <div className="timeline-widget-compact">
        <div className="widget-header">
          <h3>📅 Activities</h3>
          <div className="loading-spinner">⏳</div>
        </div>
        <div className="widget-loading">
          <p>Loading activities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="timeline-widget-compact">
        <div className="widget-header">
          <h3>📅 Activities</h3>
        </div>
        <div className="widget-error">{error}</div>
      </div>
    );
  }

  return (
    <>
      {/* Compact Activity Widget - Click to open dialog */}
      <div className="timeline-widget-compact">
        <div className="widget-header">
          <h3>📅 Recent Activities</h3>
          <button onClick={loadTimeline} className="btn-refresh-mini" disabled={loading}>
            {loading ? '↻' : '↻'}
          </button>
        </div>

        <button 
          onClick={openActivityModal} 
          style={{
            padding: '10px', 
            background: '#ff6b81', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px',
            cursor: 'pointer',
            margin: '10px 0',
            width: '100%'
          }}
        >
          🔍 Open Timeline Dialog (Test)
        </button>

        {timeline.length === 0 ? (
          <div className="widget-empty">
            <span className="icon">📋</span>
            <p>No activities yet</p>
          </div>
        ) : (
          <>
            <div className="widget-items">
              {timeline.slice(0, 5).map((activity, index) => (
                <div 
                  key={`${activity.type}-${activity._id || index}`} 
                  className="widget-item"
                  onClick={openActivityModal}
                >
                  <div className="widget-icon">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="widget-content">
                    <div className="widget-type">
                      {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                    </div>
                    <div className="widget-time">
                      {formatTimeAgo(activity.timestamp)}
                    </div>
                  </div>
                  <div className="widget-arrow">›</div>
                </div>
              ))}
            </div>
            {timeline.length > 5 && (
              <button className="btn-view-all" onClick={openActivityModal}>
                View All ({timeline.length})
              </button>
            )}
          </>
        )}
      </div>

      {/* Activity Timeline Dialog Box - Upgraded Version */}
      {isModalOpen && ReactDOM.createPortal(
        <div 
          className="dialog-overlay-upgraded" 
          onClick={closeActivityModal}
        >
          <div 
            className="dialog-box-upgraded" 
            onClick={(e) => e.stopPropagation()}
            role="dialog" 
            aria-modal="true" 
            aria-labelledby="dialog-title"
          >
            <div className="dialog-header-upgraded">
              <div className="dialog-title-section">
                <h2 id="dialog-title">📋 Activity Timeline</h2>
                <p className="dialog-subtitle">Complete history of all activities</p>
              </div>
              <button 
                className="dialog-close-upgraded" 
                onClick={closeActivityModal}
                aria-label="Close dialog"
              >
                <span className="close-icon">✕</span>
              </button>
            </div>
            
            <div className="dialog-body-upgraded">
              {timeline.length === 0 ? (
                <div className="dialog-empty-upgraded">
                  <div className="empty-icon">📋</div>
                  <h3>No Activities Yet</h3>
                  <p>Start tracking activities and they will appear here</p>
                </div>
              ) : (
                <div className="dialog-timeline-upgraded">
                  {timeline.map((activity, index) => (
                    <div 
                      key={`${activity.type}-${activity._id || index}`} 
                      className="dialog-activity-upgraded"
                    >
                      <div className="activity-icon-upgraded">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="activity-content-upgraded">
                        {renderActivityDetails(activity)}
                        <div className="activity-footer-upgraded">
                          <span className="activity-by-upgraded">
                            <span className="footer-icon">👤</span>
                            {getDisplayName(activity.caretaker, 'System')}
                          </span>
                          <span className="activity-when-upgraded">
                            <span className="footer-icon">🕐</span>
                            {formatTimeAgo(activity.timestamp)}
                          </span>
                          <span className="activity-timestamp-upgraded">
                            <span className="footer-icon">📅</span>
                            {formatFullDateTime(activity.timestamp)}
                          </span>
                          {user && user.role === 'admin' && (
                            <button
                              onClick={() => handleDeleteActivity(activity._id, activity.type)}
                              className="btn-delete-activity"
                              title="Delete this activity"
                            >
                              <span className="btn-icon">🗑️</span>
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="dialog-footer-upgraded">
              <button 
                onClick={loadTimeline} 
                className="btn-dialog-refresh" 
                disabled={loading}
              >
                <span className="btn-icon">{loading ? '⏳' : '↻'}</span>
                {loading ? 'Refreshing...' : 'Refresh Timeline'}
              </button>
              <button onClick={closeActivityModal} className="btn-dialog-close">
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default ActivityTimeline;
