import React, { useState } from 'react';
import { activityService } from '../../services/services';
import './ActivityForms.css';

const PlayForm = ({ childId, childName, activePlay, onClose }) => {
  const isEnding = !!activePlay;
  
  const [formData, setFormData] = useState({
    playType: 'Indoor',
    activityLevel: 'Medium',
    startTime: new Date().toISOString().slice(0, 16),
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
        response = await activityService.endPlay(activePlay._id, {
          notes: formData.notes
        });
      } else {
        response = await activityService.startPlay({
          childId,
          playType: formData.playType,
          activityLevel: formData.activityLevel,
          startTime: formData.startTime,
          notes: formData.notes
        });
      }
      
      alert(response.message);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record play session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="activity-form">
      <div className="form-header">
        <h3>🎈 {isEnding ? 'End Play Session' : 'Start Play Session'}</h3>
        <span className="child-name">{childName}</span>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        {!isEnding && (
          <>
            <div className="form-group">
              <label>Play Type</label>
              <select name="playType" value={formData.playType} onChange={handleChange}>
                <option value="Indoor">Indoor</option>
                <option value="Outdoor">Outdoor</option>
                <option value="Toys">Toys</option>
                <option value="Games">Games</option>
                <option value="Creative">Creative</option>
                <option value="Physical">Physical</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Activity Level</label>
              <select name="activityLevel" value={formData.activityLevel} onChange={handleChange}>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div className="form-group">
              <label>Start Time *</label>
              <input
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
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
            placeholder="Any observations about play activity..."
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Recording...' : isEnding ? 'End Play' : 'Start Play'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlayForm;
