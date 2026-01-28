import React, { useState } from 'react';
import { activityService } from '../../services/services';
import './ActivityForms.css';

const FoodForm = ({ childId, childName, onClose }) => {
  const [formData, setFormData] = useState({
    foodType: 'Milk',
    quantity: '',
    unit: 'ml',
    timeGiven: new Date().toISOString().slice(0, 16),
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
      const response = await activityService.addFood({
        childId,
        ...formData
      });
      
      alert(response.message);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record feeding');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="activity-form">
      <div className="form-header">
        <h3>🍲 Record Feeding</h3>
        <span className="child-name">{childName}</span>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Food Type *</label>
          <select name="foodType" value={formData.foodType} onChange={handleChange} required>
            <option value="Milk">Milk</option>
            <option value="Formula">Formula</option>
            <option value="Solid Food">Solid Food</option>
            <option value="Water">Water</option>
            <option value="Fruit">Fruit</option>
            <option value="Juice">Juice</option>
            <option value="Snack">Snack</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Quantity *</label>
            <input
              type="text"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="150"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Unit</label>
            <select name="unit" value={formData.unit} onChange={handleChange}>
              <option value="ml">ml</option>
              <option value="grams">grams</option>
              <option value="pieces">pieces</option>
              <option value="bowl">bowl</option>
              <option value="cup">cup</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Time Given *</label>
          <input
            type="datetime-local"
            name="timeGiven"
            value={formData.timeGiven}
            onChange={handleChange}
            required
          />
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
            {loading ? 'Recording...' : 'Mark as Fed'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FoodForm;
