import React, { useState } from 'react';
import { activityService } from '../../services/services';
import './ActivityForms.css';

const DiaperForm = ({ childId, childName, onClose }) => {
  const [formData, setFormData] = useState({
    status: 'Clean',
    timeChecked: new Date().toISOString().slice(0, 16),
    timeChanged: new Date().toISOString().slice(0, 16),
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
      const response = await activityService.addDiaper({
        childId,
        ...formData
      });
      
      alert(response.message);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record diaper change');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="activity-form">
      <div className="form-header">
        <h3>🧷 Record Diaper Change</h3>
        <span className="child-name">{childName}</span>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Status *</label>
          <div className="status-buttons">
            <button
              type="button"
              className={`status-btn ${formData.status === 'Clean' ? 'active green' : ''}`}
              onClick={() => setFormData({...formData, status: 'Clean'})}
            >
              🟢 Clean
            </button>
            <button
              type="button"
              className={`status-btn ${formData.status === 'Wet' ? 'active yellow' : ''}`}
              onClick={() => setFormData({...formData, status: 'Wet'})}
            >
              🟡 Wet
            </button>
            <button
              type="button"
              className={`status-btn ${formData.status === 'Soiled' ? 'active red' : ''}`}
              onClick={() => setFormData({...formData, status: 'Soiled'})}
            >
              🔴 Soiled
            </button>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Time Checked *</label>
            <input
              type="datetime-local"
              name="timeChecked"
              value={formData.timeChecked}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Time Changed *</label>
            <input
              type="datetime-local"
              name="timeChanged"
              value={formData.timeChanged}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            placeholder="Any additional notes..."
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Recording...' : 'Diaper Changed'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DiaperForm;
