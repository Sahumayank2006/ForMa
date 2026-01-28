import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { childService } from '../services/services';
import Navbar from './Navbar';
import MotherDashboard from './dashboards/MotherDashboard';
import CaretakerDashboard from './dashboards/CaretakerDashboard';
import AdminDashboard from './dashboards/AdminDashboard';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      const response = await childService.getChildren();
      setChildren(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load children');
    } finally {
      setLoading(false);
    }
  };

  const renderDashboard = () => {
    if (loading) {
      return <div className="loading">Loading...</div>;
    }

    if (error) {
      return <div className="error-message">{error}</div>;
    }

    switch (user?.role) {
      case 'mother':
        return <MotherDashboard children={children} fetchChildren={fetchChildren} />;
      case 'caretaker':
        return <CaretakerDashboard children={children} fetchChildren={fetchChildren} />;
      case 'admin':
        return <AdminDashboard children={children} fetchChildren={fetchChildren} />;
      default:
        return <div>Invalid role</div>;
    }
  };

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        {renderDashboard()}
      </div>
    </div>
  );
};

export default Dashboard;
