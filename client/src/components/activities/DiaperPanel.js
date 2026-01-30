import React, { useState } from 'react';
import axios from 'axios';
import './DiaperPanel.css';

const DiaperPanel = ({ child, onSuccess }) => {
  const [status, setStatus] = useState('Clean');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const currentTime = new Date().toISOString();
      
      console.log('Submitting diaper data:', {
        childId: child._id,
        status,
        notes,
        timeChecked: currentTime,
        timeChanged: currentTime
      });
      
      const response = await axios.post(
        'http://localhost:5000/api/activities/diaper',
        {
          childId: child._id,
          status,
          notes,
          timeChecked: currentTime,
          timeChanged: currentTime
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log('Response:', response.data);

      if (response.data.success) {
        alert(response.data.message || '🧷 Diaper changed successfully!');
        setNotes('');
        setStatus('Clean');
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error('Error logging diaper change:', error);
      console.error('Error response:', error.response);
      alert(error.response?.data?.message || 'Failed to log diaper change');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="diaper-panel">
      <h4>🧷 Diaper Update for {child.name}</h4>
      
      <form onSubmit={handleSubmit}>
        <div className="status-buttons">
          <button
            type="button"
            className={`status-btn ${status === 'Clean' ? 'active clean' : ''}`}
            onClick={() => setStatus('Clean')}
          >
            ✓ Clean
          </button>
          <button
            type="button"
            className={`status-btn ${status === 'Wet' ? 'active wet' : ''}`}
            onClick={() => setStatus('Wet')}
          >
            💧 Wet
          </button>
          <button
            type="button"
            className={`status-btn ${status === 'Soiled' ? 'active soiled' : ''}`}
            onClick={() => setStatus('Soiled')}
          >
            💩 Soiled
          </button>
        </div>

        <div className="form-group">
          <label>Notes (Optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any rash, redness, or irritation?"
            rows="2"
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Submitting...' : '🧷 Diaper Changed'}
        </button>
      </form>
    </div>
  );
};

export default DiaperPanel;
