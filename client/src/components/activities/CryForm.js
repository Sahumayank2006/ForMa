import React, { useState } from 'react';
import { activityService } from '../../services/services';
import './ActivityForms.css';

const CryForm = ({ childId, childName, activeCry, onClose }) => {
  const isEnding = !!activeCry;
  
  const [formData, setFormData] = useState({
    startTime: new Date().toISOString().slice(0, 16),
    endTime: new Date().toISOString().slice(0, 16),
    intensity: 'Unknown',
    reason: 'Unknown',
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
        response = await activityService.endCry(activeCry._id, {
          endTime: formData.endTime,
          intensity: formData.intensity,
          reason: formData.reason,
          notes: formData.notes
        });
      } else {
        response = await activityService.startCry({
          childId,
          startTime: formData.startTime,
          notes: formData.notes
        });
      }
      
      alert(response.message);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record cry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="activity-form">
      <div className="form-header">
        <h3>😢 {isEnding ? 'End Cry Session' : 'Start Cry Session'}</h3>
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
              When did the child start crying?
            </small>
          </div>
        ) : (
          <>
            <div style={{
              background: '#ffebee',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '15px',
              fontSize: '0.95em'
            }}>
              <strong>Started crying:</strong> {new Date(activeCry.startTime).toLocaleString()}
              <br />
              <strong>Duration so far:</strong> {Math.floor((new Date() - new Date(activeCry.startTime)) / (1000 * 60))} minutes
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
                When did the child stop crying?
              </small>
            </div>
          </>
        )}

        {isEnding && (
          <>
            <div className="form-group">
              <label>Cry Intensity</label>
              <select name="intensity" value={formData.intensity} onChange={handleChange}>
                <option value="Mild">😢 Mild</option>
                <option value="Moderate">😭 Moderate</option>
                <option value="Severe">😫 Severe</option>
                <option value="Unknown">❓ Unknown</option>
              </select>
            </div>

            <div className="form-group">
              <label>Possible Reason</label>
              <select name="reason" value={formData.reason} onChange={handleChange}>
                <option value="Hungry">🍼 Hungry</option>
                <option value="Diaper">🧷 Diaper Change Needed</option>
                <option value="Tired">😴 Tired/Sleepy</option>
                <option value="Pain">🤕 Pain/Discomfort</option>
                <option value="Attention">👋 Needs Attention</option>
                <option value="Unknown">❓ Unknown</option>
              </select>
            </div>
          </>
        )}

        <div className="form-group">
          <label>Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            placeholder="Any observations about the crying episode..."
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Recording...' : isEnding ? 'End Cry' : 'Start Cry'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CryForm;
