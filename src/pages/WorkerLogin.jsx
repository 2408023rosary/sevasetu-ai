import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HardHat, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { api } from '../api';

export default function WorkerLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('rahul@example.com');
  const [password, setPassword] = useState('worker123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const data = await api('/auth/worker-login', { method: 'POST', body: JSON.stringify({ email, password }) });
      localStorage.setItem('workerToken', data.token);
      localStorage.setItem('workerUser', JSON.stringify(data.user));
      navigate('/worker/dashboard');
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  }

  return (
    <div className="login-page worker-login-page">
      <div className="login-decoration worker-decoration">
        <div className="login-icon worker-icon"><HardHat size={42} /></div>
        <h1>CitizenCare</h1>
        <p>Worker Portal · Turn assigned complaints into completed work.</p>
        <div className="worker-feature"><ShieldCheck size={18} /> Update progress in real time</div>
        <div className="worker-feature"><ShieldCheck size={18} /> Mark jobs completed when finished</div>
      </div>
      <div className="login-card">
        <span className="eyebrow worker-eyebrow">WORKER PORTAL</span>
        <h2>Welcome, team</h2>
        <p className="muted">Sign in to see your assigned complaints and update their progress.</p>
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <div className="input-icon"><Mail size={18} /><input value={email} onChange={e => setEmail(e.target.value)} type="email" required /></div>
          <label>Password</label>
          <div className="input-icon"><Lock size={18} /><input value={password} onChange={e => setPassword(e.target.value)} type="password" required /></div>
          {error && <div className="error-message">{error}</div>}
          <button className="primary-btn login-btn worker-btn" disabled={loading}>{loading ? 'Signing in...' : <>Open Worker Portal <ArrowRight size={18} /></>}</button>
        </form>
        <div className="demo-note"><strong>Demo worker</strong><span>rahul@example.com / worker123</span></div>
        <button className="portal-switch" onClick={() => navigate('/login')}>← Admin login</button>
      </div>
    </div>
  );
}
