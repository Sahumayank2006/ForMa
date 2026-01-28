import React, { useState, useEffect } from 'react';
import { activityService } from '../../services/services';
import { extractApiData } from '../../utils/helpers';
import './DiaperPanel.css';

const CryPanel = ({ child, onSuccess }) => {
  const [activeCry, setActiveCry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    loadActiveCry();
  }, [child._id]);

  useEffect(() => {
    if (activeCry) {
      const interval = setInterval(() => {
        const mins = Math.floor((new Date() - new Date(activeCry.startTime)) / (1000 * 60));
        setDuration(mins);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [activeCry]);

  const loadActiveCry = async () => {
    try {
      const response = await activityService.getCrySummary(child._id);
      const summary = extractApiData(response);
      if (summary?.isCurrentlyCrying && summary?.activeCry) {
        setActiveCry(summary.activeCry);
      } else {
        setActiveCry(null);
      }
    } catch (error) {
      console.error('Error loading active cry:', error);
    }
  };

  const handleStartCry = async () => {
    setLoading(true);
    try {
      const response = await activityService.startCry({
        childId: child._id,
        startTime: new Date().toISOString()
      });
      
      if (response.success) {
        alert(response.message || '😢 Cry session started');
        await loadActiveCry();
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error('Error starting cry:', error);
      alert(error.response?.data?.message || 'Failed to start cry session');
    } finally {
      setLoading(false);
    }
  };

  const handleEndCry = async () => {
    if (!activeCry) return;
    
    setLoading(true);
    try {
      const response = await activityService.endCry(activeCry._id, {
        endTime: new Date().toISOString(),
        intensity: 'Unknown',
        reason: 'Unknown'
      });
      
      if (response.success) {
        alert(response.message || '😢 Cry session ended');
        setActiveCry(null);
        setDuration(0);
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error('Error ending cry:', error);
      alert(error.response?.data?.message || 'Failed to end cry session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="diaper-panel cry-panel">
      <h4>😢 Cry Tracking for {child.name}</h4>
      
      {activeCry ? (
        <div style={{ textAlign: 'center' }}>
          <div style={{
            background: '#ffebee',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '15px'
          }}>
            <div style={{ fontSize: '1.1em', fontWeight: 'bold', marginBottom: '8px' }}>
              Currently Crying
            </div>
            <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#d32f2f', marginBottom: '5px' }}>
              {duration} min
            </div>
            <div style={{ fontSize: '0.9em', color: '#666' }}>
              Started: {new Date(activeCry.startTime).toLocaleTimeString()}
            </div>
          </div>
          
          <button 
            onClick={handleEndCry}
            className="submit-btn"
            style={{ background: '#4caf50' }}
            disabled={loading}
          >
            {loading ? 'Ending...' : '✓ Stop Crying'}
          </button>
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <div style={{
            padding: '20px',
            marginBottom: '15px',
            color: '#666'
          }}>
            <p style={{ marginBottom: '10px' }}>
              Tap the button below when {child.name} starts crying
            </p>
          </div>
          
          <button 
            onClick={handleStartCry}
            className="submit-btn"
            style={{ background: '#ff6b6b' }}
            disabled={loading}
          >
            {loading ? 'Starting...' : '😢 Start Cry'}
          </button>
        </div>
      )}
    </div>
  );
};

export default CryPanel;
