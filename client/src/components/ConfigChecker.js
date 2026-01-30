import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const ConfigChecker = () => {
  const [status, setStatus] = useState({
    apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    serverReachable: null,
    authenticated: false,
    error: null
  });

  useEffect(() => {
    checkConfiguration();
  }, []);

  const checkConfiguration = async () => {
    try {
      // Check if server is reachable
      const response = await api.get('/health');
      
      setStatus(prev => ({
        ...prev,
        serverReachable: true,
        authenticated: !!localStorage.getItem('token')
      }));
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        serverReachable: false,
        error: error.message || 'Cannot reach server',
        authenticated: !!localStorage.getItem('token')
      }));
    }
  };

  const getStatusIcon = (value) => {
    if (value === null) return '⏳';
    return value ? '✅' : '❌';
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      background: 'white',
      border: '2px solid #ccc',
      borderRadius: '8px',
      padding: '12px',
      fontSize: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      maxWidth: '300px',
      zIndex: 9999
    }}>
      <h4 style={{ margin: '0 0 10px 0' }}>🔧 Connection Status</h4>
      
      <div style={{ marginBottom: '8px' }}>
        <strong>API URL:</strong><br/>
        <code style={{ fontSize: '10px', wordBreak: 'break-all' }}>
          {status.apiUrl}
        </code>
      </div>
      
      <div style={{ marginBottom: '5px' }}>
        {getStatusIcon(status.serverReachable)} <strong>Server:</strong> {
          status.serverReachable === null ? 'Checking...' :
          status.serverReachable ? 'Connected' : 'Not reachable'
        }
      </div>
      
      <div style={{ marginBottom: '5px' }}>
        {getStatusIcon(status.authenticated)} <strong>Auth:</strong> {
          status.authenticated ? 'Logged in' : 'Not logged in'
        }
      </div>
      
      {status.error && (
        <div style={{
          marginTop: '8px',
          padding: '8px',
          background: '#fee',
          borderRadius: '4px',
          color: '#c00'
        }}>
          <strong>Error:</strong> {status.error}
        </div>
      )}
      
      <button
        onClick={checkConfiguration}
        style={{
          marginTop: '10px',
          padding: '6px 12px',
          background: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          width: '100%'
        }}
      >
        🔄 Recheck
      </button>
    </div>
  );
};

export default ConfigChecker;
