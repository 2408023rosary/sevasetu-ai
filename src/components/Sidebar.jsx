import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ClipboardList, BarChart3, UserCircle, LogOut,
  Menu, X, ShieldCheck
} from 'lucide-react';

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/complaints', label: 'Complaints', icon: ClipboardList },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/profile', label: 'Profile', icon: UserCircle }
  ];

  function logout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/login');
  }

  return (
    <>
      <button className="mobile-menu" onClick={() => setOpen(!open)}>
        {open ? <X /> : <Menu />}
      </button>

      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="brand">
          <ShieldCheck size={30} />
          <div>
            <strong>CitizenCare</strong>
            <small>Admin Portal</small>
          </div>
        </div>

        <nav>
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={location.pathname === to ? 'active' : ''}
            >
              <Icon size={20} />
              {label}
            </Link>
          ))}
        </nav>

        <button className="logout" onClick={logout}>
          <LogOut size={20} />
          Logout
        </button>
      </aside>
    </>
  );
}
