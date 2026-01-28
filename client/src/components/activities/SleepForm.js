import React, { useState } from 'react';
import { activityService } from '../../services/services';
import './ActivityForms.css';

const SleepForm = ({ childId, childName, activeSleep, onClose }) => {
  const isEnding = !!activeSleep;
  
  const [formData, setFormData] = useState({
    startTime: new Date().toISOString().slice(0, 16),
    endTime: new Date().toISOString().slice(0, 16),
    quality: 'Unknown',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let response;
      if (isEnding) {
        response = await activityService.endSleep(activeSleep._id, {
          endTime: formData.endTime,
          quality: formData.quality,
          notes: formData.notes
        });
      } else {
        response = await activityService.startSleep({
          childId,
          startTime: formData.startTime,
          notes: formData.notes
        });
      }
      
      alert(response.message);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record sleep');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="activity-form">
      <div className="form-header">
        <h3>😴 {isEnding ? 'End Sleep Session' : 'Start Sleep Session'}</h3>
        <span className="child-name">{childName}</span>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        {!isEnding ? (
          <div className="form-group">
            <label>Start Time *</label>
            <input
              type="datetime-local"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              required
            />
            <small style={{ color: '#666', marginTop: '5px', display: 'block' }}>
              When did the child start sleeping?
            </small>
          </div>
        ) : (
          <>
            <div style={{
              background: '#e3f2fd',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '15px',
              fontSize: '0.95em'
            }}>
              <strong>Started sleeping:</strong> {new Date(activeSleep.startTime).toLocaleString()}
              <br />
              <strong>Duration so far:</strong> {Math.floor((new Date() - new Date(activeSleep.startTime)) / (1000 * 60))} minutes
            </div>
            
            <div className="form-group">
              <label>End Time *</label>
              <input
                type="datetime-local"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
              <small style={{ color: '#666', marginTop: '5px', display: 'block' }}>
                When did the child wake up?
              </small>
            </div>
          </>
        )}

        {isEnding && (
          <div className="form-group">
            <label>Sleep Quality</label>
            <select name="quality" value={formData.quality} onChange={handleChange}>
              <option value="Deep">😴 Deep Sleep</option>
              <option value="Light">💤 Light Sleep</option>
              <option value="Restless">😟 Restless</option>
              <option value="Unknown">❓ Unknown</option>
            </select>
          </div>
        )}

        <div className="form-group">
          <label>Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            placeholder="Any observations..."
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Recording...' : isEnding ? 'End Sleep' : 'Start Sleep'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SleepForm;
