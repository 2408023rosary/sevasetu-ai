import React, { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, Clock3, FileText, XCircle, Activity, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import { api } from '../api';

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState('');

  async function load() {
    try {
      const [s, c] = await Promise.all([
        api('/dashboard/stats'),
        api('/complaints')
      ]);
      setStats(s);
      setComplaints(c.slice(0, 6));
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <>
      <Navbar title="Dashboard" subtitle="Overview of citizen complaints and current activity." />

      {error && <div className="error-message">{error}</div>}

      <section className="stat-grid">
        <StatCard icon={FileText} label="Total Complaints" value={stats.total} />
        <StatCard icon={Clock3} label="Pending" value={stats.pending} className="warning" />
        <StatCard icon={Activity} label="In Progress" value={stats.inProgress} className="info" />
        <StatCard icon={CheckCircle2} label="Resolved" value={stats.resolved} className="success" />
        <StatCard icon={XCircle} label="Rejected" value={stats.rejected} className="danger" />
        <StatCard icon={AlertTriangle} label="High / Critical" value={stats.highPriority} className="critical" />
      </section>

      <section className="dashboard-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h2>Recent Complaints</h2>
              <p>Latest complaints received by the system.</p>
            </div>
              <span className="badge neutral">{stats.recent || 0} this week</span>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>ID</th><th>Complaint</th><th>Category</th><th>Priority</th><th>Status</th></tr>
              </thead>
              <tbody>
                {complaints.map(c => (
                  <tr key={c.id}>
                    <td>#{c.id}</td>
                    <td><strong>{c.title}</strong><small>{c.location}</small></td>
                    <td>{c.category}</td>
                    <td><span className={`priority ${c.severity.toLowerCase()}`}>{c.severity}</span></td>
                    <td><span className={`status ${c.status.toLowerCase().replace(' ', '-')}`}>{c.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel tips-panel">
          <Sparkles size={28} />
          <h2>Admin Overview</h2>
          <p>Use the Complaints page to search, assign and update complaints. Analytics provides a visual summary of categories, status, locations and departments.</p>
          <div className="mini-stat"><span>New complaints</span><strong>{stats.recent || 0}</strong></div>
          <div className="mini-stat"><span>High priority</span><strong>{stats.highPriority || 0}</strong></div>
        </div>
      </section>
    </>
  );
}
