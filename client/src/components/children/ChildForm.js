import React, { useState, useEffect } from 'react';
import { childService, userService } from '../../services/services';
import { useAuth } from '../../context/AuthContext';
import './ChildForm.css';

const ChildForm = ({ child, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    childId: '',
    name: '',
    age: '',
    dateOfBirth: '',
    mother: '',
    assignedCaretaker: '',
    assignedRoom: '',
    assignedCamera: '',
    assignedMic: '',
    allergies: '',
    medicalConditions: '',
    emergencyContact: {
      name: '',
      phone: '',
      relation: ''
    },
    notes: ''
  });
  const [mothers, setMothers] = useState([]);
  const [caretakers, setCaretakers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user.role === 'admin') {
      fetchUsers();
    }
    if (child) {
      setFormData({
        childId: child.childId || '',
        name: child.name || '',
        age: child.age || '',
        dateOfBirth: child.dateOfBirth ? child.dateOfBirth.split('T')[0] : '',
        mother: child.mother?._id || '',
        assignedCaretaker: child.assignedCaretaker?._id || '',
        assignedRoom: child.assignedRoom || '',
        assignedCamera: child.assignedCamera || '',
        assignedMic: child.assignedMic || '',
        allergies: child.allergies?.join(', ') || '',
        medicalConditions: child.medicalConditions?.join(', ') || '',
        emergencyContact: child.emergencyContact || {
          name: '',
          phone: '',
          relation: ''
        },
        notes: child.notes || ''
      });
    }
  }, [child, user.role]);

  const fetchUsers = async () => {
    try {
      const [mothersRes, caretakersRes] = await Promise.all([
        userService.getMothers(),
        userService.getCaretakers()
      ]);
      setMothers(mothersRes.data);
      setCaretakers(caretakersRes.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('emergencyContact.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        emergencyContact: {
          ...formData.emergencyContact,
          [field]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        allergies: formData.allergies ? formData.allergies.split(',').map(a => a.trim()) : [],
        medicalConditions: formData.medicalConditions ? formData.medicalConditions.split(',').map(m => m.trim()) : []
      };

      if (child) {
        await childService.updateChild(child._id, submitData);
      } else {
        await childService.createChild(submitData);
      }

      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save child profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{child ? 'Edit Child Profile' : 'Add New Child'}</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="child-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="childId">Child ID *</label>
              <input
                type="text"
                id="childId"
                name="childId"
                value={formData.childId}
                onChange={handleChange}
                required
                disabled={!!child}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="age">Age *</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                min="0"
                max="18"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="dateOfBirth">Date of Birth</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </div>
          </div>

          {user.role === 'admin' && (
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="mother">Mother *</label>
                <select
                  id="mother"
                  name="mother"
                  value={formData.mother}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Mother</option>
                  {mothers.map(m => (
                    <option key={m._id} value={m._id}>{m.name} ({m.email})</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="assignedCaretaker">Assigned Caretaker</label>
                <select
                  id="assignedCaretaker"
                  name="assignedCaretaker"
                  value={formData.assignedCaretaker}
                  onChange={handleChange}
                >
                  <option value="">Select Caretaker</option>
                  {caretakers.map(c => (
                    <option key={c._id} value={c._id}>{c.name} ({c.email})</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="assignedRoom">Assigned Room</label>
              <input
                type="text"
                id="assignedRoom"
                name="assignedRoom"
                value={formData.assignedRoom}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="assignedCamera">Camera ID</label>
              <input
                type="text"
                id="assignedCamera"
                name="assignedCamera"
                value={formData.assignedCamera}
                onChange={handleChange}
                placeholder="For future AI monitoring"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="assignedMic">Microphone ID</label>
            <input
              type="text"
              id="assignedMic"
              name="assignedMic"
              value={formData.assignedMic}
              onChange={handleChange}
              placeholder="For future AI monitoring"
            />
          </div>

          <div className="form-group">
            <label htmlFor="allergies">Allergies (comma-separated)</label>
            <input
              type="text"
              id="allergies"
              name="allergies"
              value={formData.allergies}
              onChange={handleChange}
              placeholder="e.g., Peanuts, Dairy, Eggs"
            />
          </div>

          <div className="form-group">
            <label htmlFor="medicalConditions">Medical Conditions (comma-separated)</label>
            <input
              type="text"
              id="medicalConditions"
              name="medicalConditions"
              value={formData.medicalConditions}
              onChange={handleChange}
              placeholder="e.g., Asthma, Diabetes"
            />
          </div>

          <div className="form-section">
            <h3>Emergency Contact</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="emergencyContact.name">Name</label>
                <input
                  type="text"
                  id="emergencyContact.name"
                  name="emergencyContact.name"
                  value={formData.emergencyContact.name}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="emergencyContact.phone">Phone</label>
                <input
                  type="tel"
                  id="emergencyContact.phone"
                  name="emergencyContact.phone"
                  value={formData.emergencyContact.phone}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="emergencyContact.relation">Relation</label>
                <input
                  type="text"
                  id="emergencyContact.relation"
                  name="emergencyContact.relation"
                  value={formData.emergencyContact.relation}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              placeholder="Additional notes about the child"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Saving...' : child ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChildForm;
