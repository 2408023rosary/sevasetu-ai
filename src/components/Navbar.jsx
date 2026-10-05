import React from 'react';

export default function Navbar({ title, subtitle }) {
  const admin = JSON.parse(localStorage.getItem('adminUser') || '{}');

  return (
    <header className="topbar">
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <div className="admin-chip">
        <div className="avatar">{(admin.name || 'A')[0]}</div>
        <div>
          <strong>{admin.name || 'Administrator'}</strong>
          <small>Administrator</small>
        </div>
      </div>
    </header>
  );
}
