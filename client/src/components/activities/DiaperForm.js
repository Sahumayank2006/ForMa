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
      console.log('Submitting diaper data:', {
        childId,
        ...formData
      });
      
      const response = await activityService.addDiaper({
        childId,
        ...formData
      });
      
      console.log('Diaper log response:', response);
      alert(response.message);
      onClose();
    } catch (err) {
      console.error('Diaper log error:', err);
      console.error('Error response:', err.response);
      console.error('Error data:', err.response?.data);
      console.error('Error status:', err.response?.status);
      
      // Handle different error types
      let errorMessage = 'Failed to record diaper change';
      
      if (err.message && !err.response) {
        // Network or timeout error
        errorMessage = err.message;
      } else if (err.response?.data?.message) {
        // Server error message
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (err.response?.status === 403) {
        errorMessage = 'You do not have permission to log diaper changes.';
      }
      
      setError(errorMessage);
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
