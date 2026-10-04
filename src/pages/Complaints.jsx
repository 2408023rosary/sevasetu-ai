import React, { useEffect, useState } from 'react';
import { Search, Eye, RefreshCw } from 'lucide-react';
import Navbar from '../components/Navbar';
import ComplaintModal from '../components/ComplaintModal';
import { api } from '../api';

export default function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [severity, setSeverity] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    try {
      const params = new URLSearchParams({ search, status, category, severity });
      setComplaints(await api(`/complaints?${params.toString()}`));
      setError('');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(load, 250);
    return () => clearTimeout(timer);
  }, [search, status, category, severity]);

  async function openComplaint(id) {
    try {
      setSelected(await api(`/complaints/${id}`));
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <>
      <Navbar title="Complaint Management" subtitle="Search, filter, assign and manage citizen complaints." />

      <div className="panel">
        <div className="filters">
          <div className="search-box">
            <Search size={18} />
            <input placeholder="Search by ID, title, citizen or location..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select value={status} onChange={e => setStatus(e.target.value)}>
            <option value="">All Statuses</option>
            {['Pending','In Progress','Resolved','Rejected','Reopened'].map(x => <option key={x}>{x}</option>)}
          </select>
          <select value={category} onChange={e => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            {['Roads','Sanitation','Water Supply','Electricity','Public Safety'].map(x => <option key={x}>{x}</option>)}
          </select>
          <select value={severity} onChange={e => setSeverity(e.target.value)}>
            <option value="">All Priority</option>
            {['Low','Medium','High','Critical'].map(x => <option key={x}>{x}</option>)}
          </select>
          <button className="icon-btn bordered" onClick={load} title="Refresh"><RefreshCw size={18} /></button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Citizen / Complaint</th><th>Category</th><th>Severity</th>
                <th>Location</th><th>Department</th><th>Status</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" className="empty">Loading complaints...</td></tr>
              ) : complaints.length === 0 ? (
                <tr><td colSpan="8" className="empty">No complaints found.</td></tr>
              ) : complaints.map(c => (
                <tr key={c.id}>
                  <td>#{c.id}</td>
                  <td><strong>{c.citizen_name}</strong><small>{c.title}</small></td>
                  <td>{c.category}</td>
                  <td><span className={`priority ${c.severity.toLowerCase()}`}>{c.severity}</span></td>
                  <td>{c.location || '—'}</td>
                  <td>{c.department_name || 'Unassigned'}</td>
                  <td><span className={`status ${c.status.toLowerCase().replace(' ', '-')}`}>{c.status}</span></td>
                  <td><button className="view-btn" onClick={() => openComplaint(c.id)}><Eye size={16} /> View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <ComplaintModal
          complaint={selected}
          onClose={() => setSelected(null)}
          onChanged={async () => {
            const refreshed = await api(`/complaints/${selected.id}`);
            setSelected(refreshed);
            load();
          }}
        />
      )}
    </>
  );
}
