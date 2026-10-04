import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Clock3, ClipboardList, LogOut, MapPin, RefreshCw, UserRound, Wrench, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api, API } from '../api';

const statusClass = s => s.toLowerCase().replace(' ', '-');

export default function WorkerDashboard() {
  const navigate = useNavigate();
  const worker = JSON.parse(localStorage.getItem('workerUser') || '{}');
  const [complaints, setComplaints] = useState([]);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true); setError('');
    try { setComplaints(await api('/worker/complaints')); }
    catch (e) { setError(e.message); if (e.message.includes('Authentication')) logout(); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  const stats = useMemo(() => ({
    total: complaints.length,
    active: complaints.filter(c => ['In Progress', 'Reopened'].includes(c.status)).length,
    pending: complaints.filter(c => c.status === 'Pending').length,
    done: complaints.filter(c => c.status === 'Resolved').length
  }), [complaints]);

  function logout() {
    localStorage.removeItem('workerToken'); localStorage.removeItem('workerUser'); navigate('/worker/login');
  }

  async function updateStatus() {
    if (!selected || !status) return;
    try {
      const data = await api(`/worker/complaints/${selected.id}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
      setMessage(data.message); setSelected(null); await load();
    } catch (e) { setMessage(e.message); }
  }

  return (
    <div className="worker-shell">
      <header className="worker-topbar">
        <div className="worker-brand"><div className="worker-brand-icon"><Wrench size={20} /></div><div><strong>CitizenCare</strong><small>Worker Portal</small></div></div>
        <div className="worker-user"><div className="worker-user-avatar"><UserRound size={18} /></div><div><strong>{worker.name || 'Worker'}</strong><small>{worker.department_name || 'Field Team'}</small></div><button className="icon-btn" onClick={logout} title="Logout"><LogOut size={18} /></button></div>
      </header>

      <main className="worker-main">
        <section className="worker-hero">
          <div><span className="eyebrow worker-eyebrow">MY WORK QUEUE</span><h1>Good work starts with clear updates.</h1><p>Review your assigned complaints and mark each job as in progress or completed.</p></div>
          <button className="secondary-btn" onClick={load}><RefreshCw size={16} /> Refresh</button>
        </section>

        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}

        <section className="worker-stat-grid">
          <WorkerStat icon={ClipboardList} label="Assigned" value={stats.total} />
          <WorkerStat icon={Clock3} label="Pending" value={stats.pending} />
          <WorkerStat icon={AlertTriangle} label="Active Work" value={stats.active} />
          <WorkerStat icon={CheckCircle2} label="Completed" value={stats.done} />
        </section>

        <section className="worker-content-card">
          <div className="panel-header"><div><h2>Assigned complaints</h2><p>Only complaints assigned to you appear here.</p></div></div>
          <div className="worker-list">
            {loading ? <div className="empty">Loading your work...</div> : complaints.length === 0 ? <div className="worker-empty"><CheckCircle2 size={38} /><h3>You're all caught up</h3><p>No complaints are currently assigned to you.</p></div> : complaints.map(c => (
              <article className="worker-job" key={c.id}>
                <div className="worker-job-main">
                  <div className="job-id">COMPLAINT #{c.id}</div>
                  <h3>{c.title}</h3>
                  <p>{c.description}</p>
                  <div className="job-meta"><span><MapPin size={14} /> {c.location || 'Location not provided'}</span><span>{c.category}</span><span className={`priority ${c.severity.toLowerCase()}`}>{c.severity}</span></div>
                </div>
                <div className="worker-job-side"><span className={`status ${statusClass(c.status)}`}>{c.status}</span><button className="primary-btn" onClick={() => { setSelected(c); setStatus(c.status); setMessage(''); }}>Update work</button></div>
              </article>
            ))}
          </div>
        </section>
      </main>

      {selected && <div className="modal-backdrop" onMouseDown={() => setSelected(null)}><div className="worker-modal modal" onMouseDown={e => e.stopPropagation()}>
        <div className="modal-header"><div><span className="eyebrow worker-eyebrow">COMPLAINT #{selected.id}</span><h2>{selected.title}</h2></div><button className="icon-btn" onClick={() => setSelected(null)}>×</button></div>
        <div className="detail-grid"><div><label>Citizen</label><strong>{selected.citizen_name}</strong></div><div><label>Category</label><strong>{selected.category}</strong></div><div><label>Location</label><strong>{selected.location || '—'}</strong></div><div><label>Priority</label><strong>{selected.severity}</strong></div></div>
        <div className="description-box"><label>What needs to be done</label><p>{selected.description}</p></div>
        {selected.image && <img className="complaint-image" src={`${API.replace('/api', '')}${selected.image}`} alt="Complaint" />}
        <div className="worker-update-box"><div><label>Work status</label><select value={status} onChange={e => setStatus(e.target.value)}>{['Pending','In Progress','Resolved','Reopened'].map(s => <option key={s}>{s}</option>)}</select></div><button className="primary-btn" onClick={updateStatus}><CheckCircle2 size={17} /> Save update</button></div>
        <div className="completion-note"><CheckCircle2 size={17} /><span><strong>Finished the work?</strong> Select <b>Resolved</b> and save. The admin dashboard will immediately show the complaint as completed.</span></div>
      </div></div>}
    </div>
  );
}

function WorkerStat({ icon: Icon, label, value }) { return <div className="worker-stat"><div className="worker-stat-icon"><Icon size={20} /></div><div><span>{label}</span><strong>{value}</strong></div></div>; }
