import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck, KeyRound, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { cloudService } from '../services/cloudService';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, initialRole = 'citizen' }) {
  if (!isOpen) return null;

  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [role, setRole] = useState(initialRole); // 'citizen' or 'admin'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      let user;
      if (mode === 'login') {
        user = await cloudService.login(email, password);
      } else {
        user = await cloudService.signup(name, email, password, role, adminCode);
      }
      onAuthSuccess(user);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || "Authentication failed. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (targetRole) => {
    setErrorMsg('');
    setLoading(true);
    try {
      let user;
      if (targetRole === 'admin') {
        user = await cloudService.login("admin@ewaste.gov", "admin123");
      } else {
        user = await cloudService.login("rahul@ewaste.in", "user123");
      }
      onAuthSuccess(user);
      onClose();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box auth-modal-box" onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-flex">
            <Lock className="text-emerald" size={24} />
            <div>
              <h3>{mode === 'login' ? "Sign In to Your Account" : "Register New Account"}</h3>
              <p className="text-muted">Cloud Authentication & Role-Based Access Control</p>
            </div>
          </div>
          <button type="button" className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab-btn ${mode === 'login' ? 'active' : ''}`}
            onClick={() => { setMode('login'); setErrorMsg(''); }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${mode === 'register' ? 'active' : ''}`}
            onClick={() => { setMode('register'); setErrorMsg(''); }}
          >
            Create Account
          </button>
        </div>

        {/* Error Banner */}
        {errorMsg && (
          <div className="auth-error-banner">
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Name Field (Register only) */}
          {mode === 'register' && (
            <div className="form-group">
              <label>Full Name *</label>
              <div className="input-with-icon">
                <User size={16} className="input-icon" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div className="form-group">
            <label>Email Address *</label>
            <div className="input-with-icon">
              <Mail size={16} className="input-icon" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label>Password *</label>
            <div className="input-with-icon">
              <Lock size={16} className="input-icon" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Role Selector (Register only) */}
          {mode === 'register' && (
            <div className="form-group">
              <label>Account Role *</label>
              <div className="role-selector-cards">
                <div 
                  className={`role-option-card ${role === 'citizen' ? 'selected' : ''}`}
                  onClick={() => setRole('citizen')}
                >
                  <User size={20} className="text-cyan" />
                  <div>
                    <strong>Citizen / Donor</strong>
                    <p>Schedule pickups, track status & earn green credits</p>
                  </div>
                </div>

                <div 
                  className={`role-option-card ${role === 'admin' ? 'selected' : ''}`}
                  onClick={() => setRole('admin')}
                >
                  <ShieldCheck size={20} className="text-emerald" />
                  <div>
                    <strong>Facility Collector / Admin</strong>
                    <p>Manage batches, route vans & update statuses</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Admin Passcode requirement if role === admin */}
          {mode === 'register' && role === 'admin' && (
            <div className="form-group admin-passcode-group">
              <label>Admin Authorization Key *</label>
              <div className="input-with-icon">
                <KeyRound size={16} className="input-icon text-amber" />
                <input
                  type="password"
                  required
                  placeholder="Enter 'ADMIN2026'"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                />
              </div>
              <small className="passcode-hint">💡 Faculty / Demo passcode is: <code>ADMIN2026</code></small>
            </div>
          )}

          <div className="form-actions" style={{ marginTop: '16px' }}>
            <button 
              type="submit" 
              className="btn btn-primary full-width"
              disabled={loading}
            >
              {loading ? (
                <span>Authenticating with Cloud...</span>
              ) : (
                <span>{mode === 'login' ? "Sign In" : "Complete Registration"}</span>
              )}
            </button>
          </div>
        </form>

        {/* Quick Demo Credentials Bar */}
        <div className="quick-demo-section">
          <div className="quick-demo-title">
            <Sparkles size={14} className="text-amber" />
            <span>Fast One-Click Demo Sign-In (For Reviewers):</span>
          </div>
          <div className="quick-buttons-row">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleQuickLogin('citizen')}
              disabled={loading}
              title="Sign in as Citizen (rahul@ewaste.in / user123)"
            >
              <User size={14} className="text-cyan" />
              <span>Demo Citizen</span>
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleQuickLogin('admin')}
              disabled={loading}
              title="Sign in as Logistics Admin (admin@ewaste.gov / admin123)"
            >
              <ShieldCheck size={14} className="text-emerald" />
              <span>Demo Admin</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
