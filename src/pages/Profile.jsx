import React from 'react';
import { UserCircle, Mail, ShieldCheck } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function Profile() {
  const admin = JSON.parse(localStorage.getItem('adminUser') || '{}');

  return (
    <>
      <Navbar title="Profile" subtitle="Administrator account information." />
      <div className="profile-card">
        <div className="profile-avatar"><UserCircle size={64} /></div>
        <h2>{admin.name || 'System Administrator'}</h2>
        <p>{admin.email || 'admin@gmail.com'}</p>
        <div className="profile-detail"><Mail size={18} /><span>Email</span><strong>{admin.email || 'admin@gmail.com'}</strong></div>
        <div className="profile-detail"><ShieldCheck size={18} /><span>Role</span><strong>Administrator</strong></div>
      </div>
    </>
  );
}
