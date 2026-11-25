import React, { useState } from 'react';
import { 
  Recycle, 
  Cloud, 
  ShieldCheck, 
  User, 
  Lock, 
  Mail, 
  Sparkles, 
  KeyRound, 
  AlertCircle, 
  Truck, 
  Award, 
  Leaf, 
  Cpu, 
  CheckCircle2, 
  ArrowRight,
  Shield,
  Smartphone,
  Check
} from 'lucide-react';
import { cloudService } from '../services/cloudService';

export default function LoginPage({ onLoginSuccess, onOpenCloudModal }) {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [role, setRole] = useState('citizen'); // 'citizen' or 'admin'
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
      onLoginSuccess(user);
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
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
        user = await cloudService.login('admin@ewaste.gov', 'admin123');
      } else {
        user = await cloudService.login('rahul@ewaste.in', 'user123');
      }
      onLoginSuccess(user);
    } catch (err) {
      setErrorMsg(err.message || 'Quick login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setErrorMsg('');
    setLoading(true);
    try {
      const guestUser = {
        uid: 'guest-' + Date.now().toString(36),
        displayName: 'Guest Citizen',
        email: 'guest@ewaste.in',
        role: 'citizen'
      };
      localStorage.setItem('ewaste_authenticated_user_v2', JSON.stringify(guestUser));
      onLoginSuccess(guestUser);
    } catch (err) {
      setErrorMsg('Guest access failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      {/* Top Floating Header */}
      <header className="login-header">
        <div className="login-header-container">
          <div className="brand">
            <div className="logo-badge">
              <Recycle className="icon-recycle" size={24} />
              <Cloud className="icon-cloud" size={16} />
            </div>
            <div>
              <div className="brand-title">
                E-Waste Tracker <span className="cloud-tag">AWS Cloud</span>
              </div>
              <div className="brand-subtitle">Smart Electronic Waste Collection & Circular Tracking</div>
            </div>
          </div>

          <div className="login-header-actions">
            <button 
              type="button" 
              className="btn-cloud-info"
              onClick={onOpenCloudModal}
              title="Inspect AWS Cloud Architecture Diagram and Viva Reference"
            >
              <Cpu size={16} />
              <span>AWS Architecture</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Hero & Auth Split Screen */}
      <main className="login-hero-container">
        {/* Left Column: Visual & Value Proposition */}
        <section className="login-hero-info">
          <div className="hero-pill-badge">
            <Leaf size={14} className="text-emerald" />
            <span>Sustainable Cloud Initiative • CPCB & R2 Compliant</span>
          </div>

          <h1 className="hero-heading">
            Transform Electronic Waste into <span className="gradient-text">Clean Green Impact</span>
          </h1>

          <p className="hero-description">
            Schedule certified doorstep pickups, track your deprecated devices in real time via 
            <strong> Amazon SNS (SMS)</strong> and <strong>Amazon SES (Email)</strong>, store inspection photos in 
            <strong> Amazon S3</strong>, and receive verified Green Recycling Certificates.
          </p>

          {/* Key Cloud Capabilities Grid */}
          <div className="hero-features-grid">
            <div className="hero-feature-item">
              <div className="feature-icon-box bg-emerald">
                <Truck size={20} />
              </div>
              <div>
                <h4>Smart Doorstep Pickup</h4>
                <p>Automated collector dispatch with verified time windows and route tracking.</p>
              </div>
            </div>

            <div className="hero-feature-item">
              <div className="feature-icon-box bg-cyan">
                <Cloud size={20} />
              </div>
              <div>
                <h4>Amazon S3 Object Storage</h4>
                <p>Direct photo uploads decoupled from database to prevent storage bloat.</p>
              </div>
            </div>

            <div className="hero-feature-item">
              <div className="feature-icon-box bg-amber">
                <Smartphone size={20} />
              </div>
              <div>
                <h4>Amazon SNS & SES Alerts</h4>
                <p>Automated SMS pickup reminders and email-delivered digital certificates.</p>
              </div>
            </div>

            <div className="hero-feature-item">
              <div className="feature-icon-box bg-purple">
                <Award size={20} />
              </div>
              <div>
                <h4>Green Certificate & Credits</h4>
                <p>Verifiable carbon offset calculations and citizen sustainability tiers.</p>
              </div>
            </div>
          </div>

          {/* Live System Metrics Bar */}
          <div className="hero-stats-bar">
            <div className="hero-stat-card">
              <span className="stat-number">12,480+ kg</span>
              <span className="stat-label">E-Waste Diverted</span>
            </div>
            <div className="hero-stat-card">
              <span className="stat-number">17,970 kg</span>
              <span className="stat-label">CO₂e Prevented</span>
            </div>
            <div className="hero-stat-card">
              <span className="stat-number">100%</span>
              <span className="stat-label">R2 Certified Units</span>
            </div>
            <div className="hero-stat-card">
              <span className="stat-number">4.9 ★</span>
              <span className="stat-label">Citizen Trust</span>
            </div>
          </div>
        </section>

        {/* Right Column: Interactive Login / Register Card */}
        <section className="login-card-section">
          <div className="login-card">
            <div className="login-card-header">
              <div className="auth-icon-circle">
                <Lock size={22} className="text-emerald" />
              </div>
              <div>
                <h2>{mode === 'login' ? 'Sign In to Portal' : 'Create New Account'}</h2>
                <p className="text-muted">Cloud Authentication & Role-Based Access Control</p>
              </div>
            </div>

            {/* Role Selection Tabs */}
            <div className="auth-role-tabs">
              <button
                type="button"
                className={`auth-role-tab ${role === 'citizen' ? 'active-citizen' : ''}`}
                onClick={() => { setRole('citizen'); setErrorMsg(''); }}
              >
                <User size={16} />
                <span>Citizen / Donor</span>
              </button>
              <button
                type="button"
                className={`auth-role-tab ${role === 'admin' ? 'active-admin' : ''}`}
                onClick={() => { setRole('admin'); setErrorMsg(''); }}
              >
                <ShieldCheck size={16} />
                <span>Logistics Admin</span>
              </button>
            </div>

            {/* Sign In vs Register Switcher */}
            <div className="auth-mode-toggle">
              <button
                type="button"
                className={`mode-btn ${mode === 'login' ? 'active' : ''}`}
                onClick={() => { setMode('login'); setErrorMsg(''); }}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`mode-btn ${mode === 'register' ? 'active' : ''}`}
                onClick={() => { setMode('register'); setErrorMsg(''); }}
              >
                Create Account
              </button>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="auth-error-banner">
                <AlertCircle size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="auth-form-card">
              {mode === 'register' && (
                <div className="form-group">
                  <label>Full Name *</label>
                  <div className="input-with-icon">
                    <User size={16} className="input-icon" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priya Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="form-group">
                <label>Email Address *</label>
                <div className="input-with-icon">
                  <Mail size={16} className="input-icon" />
                  <input
                    type="email"
                    required
                    placeholder={role === 'admin' ? 'admin@ewaste.gov' : 'rahul@ewaste.in'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

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

              {/* Admin Authorization Passcode (If Admin role selected) */}
              {role === 'admin' && (
                <div className="form-group admin-passcode-group">
                  <div className="label-with-hint">
                    <label>Admin Passcode {mode === 'register' ? '*' : '(Optional for Demo)'}</label>
                    <span className="badge-passcode-hint">Key: ADMIN2026</span>
                  </div>
                  <div className="input-with-icon">
                    <KeyRound size={16} className="input-icon text-amber" />
                    <input
                      type="password"
                      placeholder="Enter ADMIN2026"
                      value={adminCode}
                      onChange={(e) => setAdminCode(e.target.value)}
                      required={mode === 'register'}
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary full-width btn-auth-submit"
                disabled={loading}
              >
                {loading ? (
                  <span>Authenticating with Cloud...</span>
                ) : (
                  <>
                    <span>{mode === 'login' ? `Sign In as ${role === 'admin' ? 'Admin' : 'Citizen'}` : 'Complete Registration'}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* One-Click Quick Demo Sign-In */}
            <div className="demo-shortcuts-box">
              <div className="demo-shortcuts-title">
                <Sparkles size={14} className="text-amber" />
                <span>One-Click Demo Access (Examiner / Faculty Test):</span>
              </div>
              <div className="demo-btn-row">
                <button
                  type="button"
                  className="btn btn-demo-quick citizen-demo"
                  onClick={() => handleQuickLogin('citizen')}
                  disabled={loading}
                  title="Sign in as Citizen (rahul@ewaste.in / user123)"
                >
                  <User size={15} />
                  <span>Demo Citizen</span>
                </button>
                <button
                  type="button"
                  className="btn btn-demo-quick admin-demo"
                  onClick={() => handleQuickLogin('admin')}
                  disabled={loading}
                  title="Sign in as Logistics Admin (admin@ewaste.gov / admin123)"
                >
                  <ShieldCheck size={15} />
                  <span>Demo Admin</span>
                </button>
              </div>

              <div className="guest-explore-row">
                <button
                  type="button"
                  className="btn-guest-link"
                  onClick={handleGuestLogin}
                  disabled={loading}
                >
                  <span>Or explore portal instantly as Guest Citizen →</span>
                </button>
              </div>
            </div>

            {/* Cloud Security Note */}
            <div className="login-security-footer">
              <Shield size={14} className="text-emerald" />
              <span>AWS Cloud IAM & Cognito Compatible • AES-256 Encrypted</span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="login-footer">
        <div>E-Waste Collection Tracker • Cloud-Based Electronic Waste Management System</div>
        <div className="text-muted">Academic Project Demonstration • Cloud Computing & Environmental Sustainability</div>
      </footer>
    </div>
  );
}
