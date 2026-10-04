import React, { useEffect, useState } from 'react';
import { api, API } from '../api';

export default function ComplaintModal({ complaint, onClose, onChanged }) {
  const [status, setStatus] = useState(complaint.status);
  const [department, setDepartment] = useState(complaint.department_id || '');
  const [employee, setEmployee] = useState(complaint.employee_id || '');
  const [meta, setMeta] = useState({ departments: [], employees: [] });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api('/complaints/meta').then(setMeta).catch(console.error);
  }, []);

  async function saveStatus() {
    setSaving(true);
    try {
      await api(`/complaints/${complaint.id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      setMessage('Status updated.');
      onChanged();
    } catch (e) {
      setMessage(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function saveAssignment() {
    setSaving(true);
    try {
      await api(`/complaints/${complaint.id}/assign`, {
        method: 'PUT',
        body: JSON.stringify({
          department_id: department || null,
          employee_id: employee || null
        })
      });
      setMessage('Assignment updated.');
      onChanged();
    } catch (e) {
      setMessage(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="eyebrow">Complaint #{complaint.id}</span>
            <h2>{complaint.title}</h2>
          </div>
          <button className="icon-btn" onClick={onClose}>×</button>
        </div>

        <div className="detail-grid">
          <div><label>Citizen</label><strong>{complaint.citizen_name}</strong></div>
          <div><label>Email</label><strong>{complaint.citizen_email || '—'}</strong></div>
          <div><label>Category</label><strong>{complaint.category}</strong></div>
          <div><label>AI Category</label><strong>{complaint.ai_category || 'Not available'}</strong></div>
          <div><label>Severity</label><strong>{complaint.severity}</strong></div>
          <div><label>Priority Score</label><strong>{complaint.priority_score}</strong></div>
          <div><label>Location</label><strong>{complaint.location || '—'}</strong></div>
          <div><label>Created</label><strong>{new Date(complaint.created_at).toLocaleString()}</strong></div>
        </div>

        <div className="description-box">
          <label>Description</label>
          <p>{complaint.description}</p>
        </div>

        {complaint.image && (
          <img
            className="complaint-image"
            src={`${API.replace('/api', '')}${complaint.image}`}
            alt="Complaint"
          />
        )}

        <div className="form-section">
          <h3>Manage Complaint</h3>
          <div className="form-row">
            <div>
              <label>Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)}>
                {['Pending','In Progress','Resolved','Rejected','Reopened'].map(s =>
                  <option key={s}>{s}</option>
                )}
              </select>
            </div>
            <button className="primary-btn align-end" disabled={saving} onClick={saveStatus}>
              Update Status
            </button>
          </div>

          <div className="form-row">
            <div>
              <label>Department</label>
              <select value={department} onChange={e => setDepartment(e.target.value)}>
                <option value="">Select department</option>
                {meta.departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label>Employee</label>
              <select value={employee} onChange={e => setEmployee(e.target.value)}>
                <option value="">Select employee</option>
                {meta.employees.map(e => <option key={e.id} value={e.id}>{e.name} — {e.department_name}</option>)}
              </select>
            </div>
            <button className="secondary-btn align-end" disabled={saving} onClick={saveAssignment}>
              Assign
            </button>
          </div>
          {message && <div className="success-message">{message}</div>}
        </div>
      </div>
    </div>
  );
}
