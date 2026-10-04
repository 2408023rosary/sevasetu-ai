import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, ArrowRight } from 'lucide-react';
import { api } from '../api';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.admin));
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-decoration">
        <div className="login-icon"><ShieldCheck size={42} /></div>
        <h1>CitizenCare</h1>
        <p>Complaint Management & Administration</p>
      </div>

      <div className="login-card">
        <span className="eyebrow">ADMIN PORTAL</span>
        <h2>Welcome back</h2>
        <p className="muted">Sign in to manage citizen complaints.</p>

        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <div className="input-icon">
            <Mail size={18} />
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" required />
          </div>

          <label>Password</label>
          <div className="input-icon">
            <Lock size={18} />
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" required />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button className="primary-btn login-btn" disabled={loading}>
            {loading ? 'Signing in...' : <>Sign In <ArrowRight size={18} /></>}
          </button>
        </form>

        <div className="demo-note">
          <strong>Demo account</strong>
          <span>admin@gmail.com / admin123</span>
        </div>
      </div>
    </div>
  );
}
