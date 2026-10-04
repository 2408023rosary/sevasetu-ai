import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import Navbar from '../components/Navbar';
import { api } from '../api';

const STATUS_COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6', '#64748b'];

export default function Analytics() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/dashboard/analytics').then(setData).catch(e => setError(e.message));
  }, []);

  if (error) return <><Navbar title="Analytics" /><div className="error-message">{error}</div></>;
  if (!data) return <><Navbar title="Analytics" subtitle="Visual insights from complaint data." /><div className="panel empty">Loading analytics...</div></>;

  return (
    <>
      <Navbar title="Analytics" subtitle="Visual insights from complaint data." />

      <div className="chart-grid">
        <ChartCard title="Complaints by Category">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.category}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" radius={[6,6,0,0]} fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Complaints by Status">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={data.status} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={95} label>
                {data.status.map((_, i) => <Cell key={i} fill={STATUS_COLORS[i % STATUS_COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Priority / Severity">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.priority}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" radius={[6,6,0,0]} fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Monthly Complaint Trend">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data.monthly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#7c3aed" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Department-wise Complaints">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.department} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" allowDecimals={false} />
              <YAxis type="category" dataKey="name" width={130} />
              <Tooltip />
              <Bar dataKey="value" radius={[0,6,6,0]} fill="#06b6d4" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Complaints by Location">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.location}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" radius={[6,6,0,0]} fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="analytics-summary">
        <div className="panel">
          <span className="eyebrow">AVERAGE RESOLUTION TIME</span>
          <strong className="big-number">{data.resolution?.averageHours ?? 0} hrs</strong>
          <p>Calculated from complaints that have been resolved.</p>
        </div>
      </div>
    </>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="panel chart-card">
      <h2>{title}</h2>
      {children}
    </div>
  );
}
