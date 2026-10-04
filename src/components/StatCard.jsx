import React from 'react';

export default function StatCard({ icon: Icon, label, value, className = '' }) {
  return (
    <div className={`stat-card ${className}`}>
      <div className="stat-icon"><Icon size={22} /></div>
      <div>
        <p>{label}</p>
        <h2>{value ?? 0}</h2>
      </div>
    </div>
  );
}
