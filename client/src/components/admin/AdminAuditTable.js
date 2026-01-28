import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getDisplayName, formatMinutes } from '../../utils/helpers';
import './AdminAuditTable.css';

const AdminAuditTable = () => {
  const [auditData, setAuditData] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAuditData();
  }, []);

  const loadAuditData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Fetch all diaper logs
      const response = await axios.get('http://localhost:5000/api/activities/diaper/all', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        const logs = response.data.data;
        
        // Group by child
        const childGroups = {};
        logs.forEach(log => {
          const childId = log.child._id;
          if (!childGroups[childId]) {
            childGroups[childId] = {
              child: log.child,
              logs: []
            };
          }
          childGroups[childId].logs.push(log);
        });

        // Calculate audit data for each child
        const audit = Object.values(childGroups).map(group => {
          const sortedLogs = group.logs.sort((a, b) => 
            new Date(b.timeChanged) - new Date(a.timeChanged)
          );
          
          const lastLog = sortedLogs[0];
          const now = new Date();
          const timeSince = lastLog 
            ? Math.floor((now - new Date(lastLog.timeChanged)) / (1000 * 60))
            : null;
          
          let status = 'green';
          if (timeSince > 180) status = 'red';
          else if (timeSince > 120) status = 'yellow';

          // Calculate average response time for this child
          let avgResponseTime = 0;
          if (sortedLogs.length > 1) {
            let totalIntervals = 0;
            for (let i = 0; i < sortedLogs.length - 1; i++) {
              const interval = (new Date(sortedLogs[i].timeChanged) - new Date(sortedLogs[i + 1].timeChanged)) / (1000 * 60);
              totalIntervals += interval;
            }
            avgResponseTime = totalIntervals / (sortedLogs.length - 1);
          }

          const overdueCount = sortedLogs.filter(log => {
            // Check if this log was recorded after overdue time
            const prevLogIndex = sortedLogs.indexOf(log) + 1;
            if (prevLogIndex < sortedLogs.length) {
              const prevLog = sortedLogs[prevLogIndex];
              const timeBetween = (new Date(log.timeChanged) - new Date(prevLog.timeChanged)) / (1000 * 60);
              return timeBetween > 180;
            }
            return false;
          }).length;

          return {
            child: group.child,
            caretaker: lastLog?.caretaker,
            lastChange: lastLog?.timeChanged,
            timeSince,
            status,
            totalChanges: sortedLogs.length,
            avgResponseTime,
            overdueCount
          };
        });

        setAuditData(audit);

        // Calculate overall metrics
        const totalChildren = audit.length;
        const overdueChildren = audit.filter(a => a.status === 'red').length;
        const avgResponseOverall = audit.reduce((sum, a) => sum + a.avgResponseTime, 0) / totalChildren;
        const overdueFrequency = (audit.reduce((sum, a) => sum + a.overdueCount, 0) / totalChildren).toFixed(1);
        const complianceScore = Math.max(0, 100 - (overdueChildren / totalChildren) * 100).toFixed(1);

        setMetrics({
          totalChildren,
          overdueChildren,
          avgResponseOverall: avgResponseOverall.toFixed(0),
          overdueFrequency,
          complianceScore
        });
      }
    } catch (error) {
      console.error('Error loading audit data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = ['Child', 'Child ID', 'Caretaker', 'Last Change', 'Delay (minutes)', 'Status', 'Total Changes Today', 'Avg Interval', 'Overdue Count'];
    
    const rows = auditData.map(item => [
      getDisplayName(item.child),
      item.child.childId,
      getDisplayName(item.caretaker),
      item.lastChange ? new Date(item.lastChange).toLocaleString() : 'Never',
      item.timeSince || 0,
      item.status,
      item.totalChanges,
      item.avgResponseTime.toFixed(0),
      item.overdueCount
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diaper-audit-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="loading">Loading audit data...</div>;
  }

  return (
    <div className="audit-container">
      <div className="audit-header">
        <h2>🧷 Diaper Change Audit</h2>
        <button className="btn-export" onClick={exportToCSV}>
          📥 Export CSV
        </button>
      </div>

      {/* Metrics Dashboard */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-value">{metrics.totalChildren}</div>
          <div className="metric-label">Total Children</div>
        </div>
        <div className="metric-card alert">
          <div className="metric-value">{metrics.overdueChildren}</div>
          <div className="metric-label">Overdue Now</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{metrics.avgResponseOverall} min</div>
          <div className="metric-label">Avg Response Time</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{metrics.overdueFrequency}</div>
          <div className="metric-label">Avg Overdue/Child</div>
        </div>
        <div className="metric-card success">
          <div className="metric-value">{metrics.complianceScore}%</div>
          <div className="metric-label">Hygiene Compliance Score</div>
        </div>
      </div>

      {/* Audit Table */}
      <div className="audit-table-container">
        <table className="audit-table">
          <thead>
            <tr>
              <th>Child</th>
              <th>Caretaker</th>
              <th>Last Change</th>
              <th>Delay</th>
              <th>Status</th>
              <th>Total Today</th>
              <th>Avg Interval</th>
              <th>Overdue Count</th>
            </tr>
          </thead>
          <tbody>
            {auditData.map((item, index) => (
              <tr key={index} className={item.status}>
                <td>
                  <strong>{getDisplayName(item.child)}</strong>
                  <div style={{ fontSize: '0.85em', color: '#666' }}>
                    {item.child.childId}
                  </div>
                </td>
                <td>{getDisplayName(item.caretaker, 'Unassigned')}</td>
                <td>
                  {item.lastChange 
                    ? new Date(item.lastChange).toLocaleTimeString()
                    : 'Never'}
                </td>
                <td>{formatMinutes(item.timeSince)}</td>
                <td>
                  <span className={`status-badge ${item.status}`}>
                    {item.status === 'green' && '🟢 Fresh'}
                    {item.status === 'yellow' && '🟡 Due'}
                    {item.status === 'red' && '🔴 Overdue'}
                  </span>
                </td>
                <td>{item.totalChanges}</td>
                <td>{item.avgResponseTime.toFixed(0)} min</td>
                <td>
                  {item.overdueCount > 0 ? (
                    <span style={{ color: '#f44336', fontWeight: '600' }}>
                      {item.overdueCount}
                    </span>
                  ) : (
                    <span style={{ color: '#4caf50' }}>0</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '20px', textAlign: 'center', color: '#666', fontSize: '0.9em' }}>
        Last updated: {new Date().toLocaleTimeString()}
        <button 
          onClick={loadAuditData} 
          style={{ marginLeft: '20px', padding: '6px 12px', cursor: 'pointer' }}
        >
          ↻ Refresh
        </button>
      </div>
    </div>
  );
};

export default AdminAuditTable;
