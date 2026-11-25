import React, { useState } from 'react';
import { 
  Cloud, 
  Recycle, 
  ShieldCheck, 
  User, 
  Cpu, 
  ArrowRightLeft, 
  LogIn, 
  LogOut, 
  Bell, 
  CheckCheck,
  Smartphone,
  Mail,
  Clock
} from 'lucide-react';

export default function Navbar({
  currentUser,
  activeRole,
  onRoleChange,
  onOpenCloudModal,
  onOpenAuthModal,
  onLogout,
  notifications = [],
  onMarkNotificationsRead
}) {
  const [showNotifs, setShowNotifs] = useState(false);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleToggleNotifs = () => {
    setShowNotifs(!showNotifs);
    if (!showNotifs && unreadCount > 0 && onMarkNotificationsRead) {
      onMarkNotificationsRead();
    }
  };

  return (
    <header className="navbar">
      <div className="nav-container">
        <div className="brand">
          <div className="logo-badge">
            <Recycle className="icon-recycle" size={24} />
            <Cloud className="icon-cloud" size={16} />
          </div>
          <div>
            <div className="brand-title">
              E-Waste Tracker <span className="cloud-tag">AWS Cloud</span>
            </div>
            <div className="brand-subtitle">Cloud-Based Electronic Waste Management System</div>
          </div>
        </div>

        <div className="nav-actions">
          {/* Cloud Status Indicator */}
          <div 
            className="cloud-status-pill status-live"
            title="Running on Unified Node.js Server ready for AWS App Runner / EC2"
          >
            <span className="pulsing-dot"></span>
            <span>AWS Cloud Ready</span>
          </div>

          {/* Cloud Architecture Info Button */}
          <button 
            type="button" 
            className="btn-cloud-info"
            onClick={onOpenCloudModal}
          >
            <Cpu size={16} />
            <span>AWS Architecture</span>
          </button>

          {/* Notification Bell Dropdown (Amazon SNS & SES Alerts) */}
          <div className="notif-bell-container">
            <button
              type="button"
              className="btn-notif-bell"
              onClick={handleToggleNotifs}
              title="Notifications sent via Amazon SNS (SMS) & Amazon SES (Email)"
            >
              <Bell size={18} />
              {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
            </button>

            {showNotifs && (
              <div className="notif-dropdown">
                <div className="notif-dropdown-header">
                  <div>
                    <strong>User Notifications</strong>
                    <div className="notif-sub-aws">Dispatched via Amazon SNS & SES</div>
                  </div>
                  {notifications.length > 0 && (
                    <button 
                      type="button" 
                      className="btn-mark-read"
                      onClick={onMarkNotificationsRead}
                    >
                      <CheckCheck size={14} />
                      <span>Mark read</span>
                    </button>
                  )}
                </div>

                <div className="notif-list">
                  {notifications.length === 0 ? (
                    <div className="notif-empty">No notifications yet.</div>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id} className={`notif-item ${n.isRead ? 'read' : 'unread'}`}>
                        <div className="notif-item-top">
                          <span className="notif-title">{n.title}</span>
                          <span className={`status-tag status-${(n.status || 'pending').toLowerCase()}`}>
                            {n.status || 'Alert'}
                          </span>
                        </div>
                        <p className="notif-msg">{n.message}</p>
                        <div className="notif-footer-meta">
                          <span className="notif-channel">
                            {n.channel?.includes('Email') ? (
                              <><Mail size={12} /> {n.channel}</>
                            ) : (
                              <><Smartphone size={12} /> {n.channel}</>
                            )}
                          </span>
                          <span className="notif-time">
                            <Clock size={11} /> {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Current User & Role Profile Badge */}
          <div className="user-profile-badge">
            <div className="user-avatar-circle">
              {activeRole === 'admin' ? (
                <ShieldCheck size={16} className="text-emerald" />
              ) : (
                <User size={16} className="text-cyan" />
              )}
            </div>
            <div className="user-profile-text">
              <span className="user-name">{currentUser?.displayName || "Rahul Sharma"}</span>
              <span className="user-role-tag">
                {activeRole === 'admin' ? "Logistics Admin" : "Citizen"}
              </span>
            </div>
          </div>

          {/* Role Switcher Button */}
          <button
            type="button"
            className="btn-switch-role"
            onClick={() => onRoleChange(activeRole === 'citizen' ? 'admin' : 'citizen')}
            title="Toggle between Citizen View and Admin View"
          >
            <ArrowRightLeft size={14} />
            <span>Switch to {activeRole === 'citizen' ? 'Admin' : 'Citizen'}</span>
          </button>

          {/* Sign Out / Exit to Login Page */}
          <button
            type="button"
            className="btn-signout"
            onClick={onLogout}
            title="Sign out and return to the beginning login page"
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
