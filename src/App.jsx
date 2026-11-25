import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CitizenPortal from './components/CitizenPortal';
import AdminPortal from './components/AdminPortal';
import CloudArchitectureModal from './components/CloudArchitectureModal';
import AuthModal from './components/AuthModal';
import LoginPage from './components/LoginPage';
import { cloudService } from './services/cloudService';
import './App.css';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => cloudService.getCurrentUser());
  const [activeRole, setActiveRole] = useState(() => currentUser?.role || 'citizen');
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isArchModalOpen, setIsArchModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const isConnected = cloudService.isCloudConnected();

  const loadRequests = async () => {
    try {
      setIsLoading(true);
      const data = await cloudService.getRequests();
      setRequests(data);
      if (currentUser?.uid) {
        loadNotifications(currentUser.uid);
      }
    } catch (err) {
      console.error("Failed to load cloud requests:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadNotifications = async (uid) => {
    try {
      const notifs = await cloudService.getNotifications(uid || currentUser?.uid);
      setNotifications(notifs);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadRequests();
      loadNotifications(currentUser.uid);
    } else {
      setIsLoading(false);
    }
  }, [currentUser]);

  const handleMarkNotificationsRead = async () => {
    await cloudService.markNotificationsRead();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleRoleChange = async (newRole) => {
    const updated = await cloudService.switchRole(newRole);
    setCurrentUser(updated);
    setActiveRole(newRole);
    loadRequests();
  };

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    setActiveRole(user.role || 'citizen');
    setIsAuthModalOpen(false);
    loadRequests();
    loadNotifications(user.uid);
  };

  const handleLogout = async () => {
    await cloudService.logout();
    setCurrentUser(null);
    setActiveRole('citizen');
  };

  // If user is not authenticated, render the dedicated Login Page at the beginning!
  if (!currentUser) {
    return (
      <div className="app-root-login">
        <LoginPage 
          onLoginSuccess={handleAuthSuccess}
          onOpenCloudModal={() => setIsArchModalOpen(true)}
        />
        <CloudArchitectureModal
          isOpen={isArchModalOpen}
          onClose={() => setIsArchModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="app-layout">
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        activeRole={activeRole}
        onRoleChange={handleRoleChange}
        onOpenCloudModal={() => setIsArchModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        isConnected={isConnected}
        notifications={notifications}
        onMarkNotificationsRead={handleMarkNotificationsRead}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {isLoading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Syncing with Cloud Database...</p>
          </div>
        ) : (
          <>
            {activeRole === 'citizen' ? (
              <CitizenPortal
                requests={requests}
                onRequestCreated={loadRequests}
                currentUser={currentUser}
              />
            ) : (
              <AdminPortal
                requests={requests}
                onStatusUpdated={loadRequests}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div>
            <strong>E-Waste Collection Tracker</strong> — Cloud-Based Electronic Waste Management System
          </div>
          <div className="footer-sub">
            Academic Project Demonstration • Cloud Computing & Environmental Sustainability
          </div>
        </div>
      </footer>

      {/* Cloud Architecture & Viva Modal */}
      <CloudArchitectureModal
        isOpen={isArchModalOpen}
        onClose={() => setIsArchModalOpen(false)}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        initialRole={activeRole}
      />
    </div>
  );
}
