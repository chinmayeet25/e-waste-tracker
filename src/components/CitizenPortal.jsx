import React, { useState } from 'react';
import { 
  Smartphone, 
  Laptop, 
  BatteryCharging, 
  Cable, 
  Cpu, 
  Tv, 
  UploadCloud, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Recycle, 
  AlertCircle,
  PlusCircle,
  ListFilter,
  Image as ImageIcon,
  Award,
  Sparkles,
  Home,
  ArrowRight,
  Leaf,
  ShieldCheck,
  Calendar,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { cloudService } from '../services/cloudService';
import GreenCertificateModal from './GreenCertificateModal';

const CATEGORIES = [
  { id: "Mobile Phones & Tablets", icon: Smartphone, desc: "Smartphones, feature phones, iPads" },
  { id: "Laptops & Computers", icon: Laptop, desc: "Laptops, desktops, monitors, keyboards" },
  { id: "Batteries & Power Supplies", icon: BatteryCharging, desc: "Li-ion batteries, UPS, power banks" },
  { id: "Chargers, Cables & Accessories", icon: Cable, desc: "USB cords, adapters, headphones" },
  { id: "Circuit Boards & Components", icon: Cpu, desc: "RAM, PCBs, GPUs, hard drives" },
  { id: "Home Appliances & TVs", icon: Tv, desc: "Microwaves, TVs, audio players" }
];

const STATUS_STEPS = [
  { key: "Pending", label: "Pending Review", icon: Clock, desc: "Request logged in cloud" },
  { key: "Accepted", label: "Accepted & Scheduled", icon: CheckCircle2, desc: "Collector assigned" },
  { key: "Collected", label: "Collected", icon: Truck, desc: "Picked up from doorstep" },
  { key: "Completed", label: "Recycled", icon: Recycle, desc: "Processed at certified unit" }
];

export default function CitizenPortal({ requests, onRequestCreated, currentUser }) {
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'submit', 'track', or 'certificates'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [selectedCertRequest, setSelectedCertRequest] = useState(null);

  // Form state
  const [category, setCategory] = useState(CATEGORIES[0].id);
  const [brandModel, setBrandModel] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [weightKg, setWeightKg] = useState(1.0);
  const [condition, setCondition] = useState('Non-Working / Scrap');
  const [pickupAddress, setPickupAddress] = useState('Flat 402, Green Meadows, Bengaluru');
  const [userContact, setUserContact] = useState('+91 98765 43210');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!brandModel.trim() || !pickupAddress.trim()) {
      alert("Please fill in the device model and pickup address.");
      return;
    }

    try {
      setIsSubmitting(true);
      const newRequest = await cloudService.createRequest({
        category,
        brandModel,
        quantity,
        weightKg,
        condition,
        pickupAddress,
        userContact,
        userName: user?.displayName
      }, imageFile);

      setSubmitSuccess(newRequest);
      setBrandModel('');
      setImageFile(null);
      setImagePreview(null);
      onRequestCreated();
    } catch (err) {
      alert("Submission error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepIndex = (status) => {
    switch (status) {
      case 'Pending': return 0;
      case 'Accepted': return 1;
      case 'Collected': return 2;
      case 'Completed': return 3;
      default: return 0;
    }
  };

  // Filter requests for current user
  const user = currentUser || cloudService.getCurrentUser() || { uid: "demo-user-1", displayName: "Rahul Sharma", role: "citizen" };
  const myRequests = requests.filter(r => 
    r.userId === user.uid || 
    (user.uid && user.uid.startsWith('guest') && (r.userId === 'demo-user-1' || r.userId === 'demo-user-2')) ||
    user.role === 'admin'
  );
  
  const activePickups = myRequests.filter(r => r.status === 'Pending' || r.status === 'Accepted' || r.status === 'Collected');
  const completedItems = myRequests.filter(r => r.status === 'Completed');
  const totalWeight = myRequests.reduce((acc, r) => acc + (r.weightKg || 0), 0);
  const co2SavedKg = (totalWeight * 1.44).toFixed(1);
  const userPoints = (completedItems.length * 50) + Math.round(totalWeight * 25);
  const userTier = userPoints >= 250 ? "Green Champion" : userPoints >= 100 ? "Eco Warrior" : "Eco Scout";

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  let nextTierName = "Eco Warrior";
  let pointsToNext = 100 - userPoints;
  let tierPercent = Math.min(100, Math.round((userPoints / 100) * 100));

  if (userPoints >= 100 && userPoints < 250) {
    nextTierName = "Green Champion";
    pointsToNext = 250 - userPoints;
    tierPercent = Math.min(100, Math.round(((userPoints - 100) / 150) * 100));
  } else if (userPoints >= 250) {
    nextTierName = "Top Rank";
    pointsToNext = 0;
    tierPercent = 100;
  }

  return (
    <div className="citizen-portal">
      {/* Navigation Tabs Bar */}
      <div className="portal-tabs main-navigation-tabs">
        <button
          type="button"
          className={`tab-btn ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveTab('home')}
        >
          <Home size={18} />
          <span>Home Dashboard</span>
        </button>

        <button
          type="button"
          className={`tab-btn ${activeTab === 'submit' ? 'active' : ''}`}
          onClick={() => { setActiveTab('submit'); setSubmitSuccess(null); }}
        >
          <PlusCircle size={18} />
          <span>Schedule Doorstep Pickup</span>
        </button>

        <button
          type="button"
          className={`tab-btn ${activeTab === 'track' ? 'active' : ''}`}
          onClick={() => setActiveTab('track')}
        >
          <ListFilter size={18} />
          <span>Track Requests ({myRequests.length})</span>
        </button>

        <button
          type="button"
          className={`tab-btn ${activeTab === 'certificates' ? 'active' : ''}`}
          onClick={() => setActiveTab('certificates')}
        >
          <Award size={18} />
          <span>Green Certificates ({completedItems.length})</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: HOME PAGE DASHBOARD */}
      {/* ========================================================= */}
      {activeTab === 'home' && (
        <div className="home-dashboard-view">
          {/* Welcome Hero Banner */}
          <div className="home-welcome-hero">
            <div className="hero-welcome-content">
              <div className="welcome-tag">
                <Leaf size={14} className="text-emerald" />
                <span>Circular Economy & E-Waste Management Platform</span>
              </div>
              <h1>
                {getGreeting()}, <span className="hero-name-highlight">{user?.displayName || "Citizen"}</span>! 🌿
              </h1>
              <p className="hero-subtext">
                Every obsolete electronic device you recycle preserves scarce precious metals, prevents toxic heavy metal 
                leaching into soil and groundwater, and earns official <strong>Amazon SES-verified Green Certificates</strong>.
              </p>

              <div className="welcome-actions">
                <button
                  type="button"
                  className="btn btn-hero-primary"
                  onClick={() => setActiveTab('submit')}
                >
                  <PlusCircle size={18} />
                  <span>Schedule a Pickup Now</span>
                </button>
                <button
                  type="button"
                  className="btn btn-hero-secondary"
                  onClick={() => setActiveTab('track')}
                >
                  <ListFilter size={18} />
                  <span>View Pickup Status ({myRequests.length})</span>
                </button>
              </div>
            </div>

            <div className="welcome-tier-badge">
              <div className="tier-header-row">
                <div className="tier-icon-wrap">
                  <Sparkles size={24} className="text-amber" />
                </div>
                <div>
                  <span className="tier-label">Sustainability Rank</span>
                  <div className="tier-name">{userTier}</div>
                </div>
              </div>

              <div className="tier-points-badge">
                <strong>{userPoints}</strong> Eco-Credits Earned
              </div>

              <div className="tier-progress-section">
                <div className="tier-progress-labels">
                  <span>{pointsToNext > 0 ? `${pointsToNext} pts to ${nextTierName}` : "Top Rank Achieved! 🏆"}</span>
                  <span>{tierPercent}%</span>
                </div>
                <div className="tier-progress-track">
                  <div className="tier-progress-fill" style={{ width: `${tierPercent}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics KPI Bar */}
          <div className="stats-row" style={{ marginTop: '24px' }}>
            <div className="stat-card">
              <div className="stat-label">Total Submissions</div>
              <div className="stat-value">{myRequests.length}</div>
              <div className="stat-sub">Tracked in Cloud Database</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Active Pickups</div>
              <div className="stat-value text-amber">{activePickups.length}</div>
              <div className="stat-sub">Pending, Scheduled or In-Transit</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Landfill Diverted</div>
              <div className="stat-value text-emerald">{totalWeight.toFixed(1)} kg</div>
              <div className="stat-sub">Zero toxic leachate leakage</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">CO₂e Offset</div>
              <div className="stat-value text-cyan">{co2SavedKg} kg</div>
              <div className="stat-sub">Equivalent to ~{Math.round(totalWeight * 0.08) || 1} trees planted</div>
            </div>
          </div>

          {/* 4 Feature Action Cards */}
          <div className="home-action-cards-grid">
            <div className="home-action-card" onClick={() => setActiveTab('submit')}>
              <div className="action-card-icon bg-emerald">
                <PlusCircle size={24} />
              </div>
              <div className="action-card-text">
                <h3>Schedule Pickup</h3>
                <p>Register electronic waste for doorstep collection. Select categories and attach device photos.</p>
                <span className="action-card-link">Open Request Form →</span>
              </div>
            </div>

            <div className="home-action-card" onClick={() => setActiveTab('track')}>
              <div className="action-card-icon bg-amber">
                <Truck size={24} />
              </div>
              <div className="action-card-text">
                <h3>Live Pickup Tracking</h3>
                <p>Track request lifecycle: Pending Review → Collector Assigned → Doorstep Pickup → Recycled.</p>
                <span className="action-card-link">Track {myRequests.length} Items →</span>
              </div>
            </div>

            <div className="home-action-card" onClick={() => setActiveTab('certificates')}>
              <div className="action-card-icon bg-purple">
                <Award size={24} />
              </div>
              <div className="action-card-text">
                <h3>Green Certificates</h3>
                <p>Download official digitally signed recycling certificates for completed devices.</p>
                <span className="action-card-link">View {completedItems.length} Certificates →</span>
              </div>
            </div>

            <div className="home-action-card" onClick={() => setActiveTab('submit')}>
              <div className="action-card-icon bg-cyan">
                <UploadCloud size={24} />
              </div>
              <div className="action-card-text">
                <h3>Amazon S3 Photo Storage</h3>
                <p>Inspection photos are stored directly in Amazon S3 buckets, decoupled from database storage.</p>
                <span className="action-card-link">Upload Device Photos →</span>
              </div>
            </div>
          </div>

          {/* Active Pickups Quick Section */}
          <div className="home-recent-section">
            <div className="section-header-flex">
              <div>
                <h2>Active Pickup Requests ({activePickups.length})</h2>
                <p className="text-muted">Real-time status of your items currently being processed</p>
              </div>
              {myRequests.length > 0 && (
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => setActiveTab('track')}
                >
                  View All ({myRequests.length})
                </button>
              )}
            </div>

            {activePickups.length === 0 ? (
              <div className="empty-home-banner card">
                <CheckCircle size={36} className="text-emerald" />
                <div>
                  <h4>All caught up! No active pickups in progress.</h4>
                  <p className="text-muted">Have old phones, dead chargers, broken laptops, or swollen batteries sitting at home?</p>
                </div>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => setActiveTab('submit')}
                >
                  Schedule an E-Waste Pickup
                </button>
              </div>
            ) : (
              <div className="recent-requests-grid">
                {activePickups.slice(0, 2).map((req) => (
                  <div key={req.id} className="card recent-req-card">
                    <div className="recent-req-top">
                      <span className="req-id">{req.id}</span>
                      <span className={`status-tag status-${req.status.toLowerCase()}`}>
                        {req.status}
                      </span>
                    </div>
                    <h4>{req.brandModel}</h4>
                    <p className="text-muted" style={{ fontSize: '0.85rem' }}>{req.category} • {req.weightKg} kg</p>
                    {req.scheduledDate && (
                      <div className="recent-meta-pill">
                        <Calendar size={13} />
                        <span>Pickup: {req.scheduledDate}</span>
                      </div>
                    )}
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm full-width"
                      style={{ marginTop: '12px' }}
                      onClick={() => setActiveTab('track')}
                    >
                      Track Step-by-Step Progress →
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recyclable Materials Educational Guide */}
          <div className="materials-guide-section card">
            <div className="materials-header">
              <Recycle size={24} className="text-emerald" />
              <div>
                <h3>Recyclable Electronics Reference Guide</h3>
                <p className="text-muted">Accepted device categories processed through authorized CPCB & R2 dismantlers</p>
              </div>
            </div>

            <div className="materials-grid">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <div key={cat.id} className="material-guide-card">
                    <Icon size={20} className="text-cyan" />
                    <div>
                      <strong>{cat.id}</strong>
                      <p>{cat.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: SCHEDULE DOORSTEP PICKUP FORM */}
      {/* ========================================================= */}
      {activeTab === 'submit' && (
        <div className="card form-card">
          {submitSuccess ? (
            <div className="success-banner">
              <CheckCircle2 size={48} className="text-emerald" />
              <h3>Pickup Request Submitted Successfully!</h3>
              <p>Your tracking reference number is: <strong>{submitSuccess.id}</strong></p>
              <p className="text-muted">
                The logistics team has been notified via Cloud Trigger. An automated SMS confirmation has been dispatched.
              </p>
              <div className="action-buttons-row">
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={() => { setSubmitSuccess(null); setActiveTab('track'); }}
                >
                  Track This Request Live
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setSubmitSuccess(null)}
                >
                  Schedule Another Device
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="section-title">
                <h2>1. Select Electronic Waste Category</h2>
                <p>Categorization ensures routing to certified handling lines (e.g. battery reclamation, PCB desoldering).</p>
              </div>

              <div className="category-grid">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.id;
                  return (
                    <div
                      key={cat.id}
                      className={`category-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => setCategory(cat.id)}
                    >
                      <Icon size={24} className="cat-icon" />
                      <div className="cat-title">{cat.id}</div>
                      <div className="cat-desc">{cat.desc}</div>
                    </div>
                  );
                })}
              </div>

              <div className="section-title" style={{ marginTop: '24px' }}>
                <h2>2. Device Details & Photo Upload</h2>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Brand & Model / Description *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dell Inspiron 15 (2019), iPhone 11, etc."
                    value={brandModel}
                    onChange={(e) => setBrandModel(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Item Condition</label>
                  <select value={condition} onChange={(e) => setCondition(e.target.value)}>
                    <option value="Non-Working / Scrap">Non-Working / Dead / Scrap</option>
                    <option value="Partially Working">Partially Working (e.g. cracked display)</option>
                    <option value="Working but Obsolete">Fully Working (Obsolete/Old)</option>
                    <option value="Hazardous / Swollen Battery">Hazardous / Swollen Battery</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Quantity</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Estimated Total Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                  />
                </div>
              </div>

              {/* Photo Upload Component (Amazon S3 Object Storage) */}
              <div className="upload-container">
                <label className="upload-label">
                  <UploadCloud size={28} className="text-cyan" />
                  <div>
                    <strong>Upload or Capture Device Photo</strong>
                    <p>Image binary is saved to <strong>Amazon S3 Bucket</strong> (Object Storage Service)</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                </label>

                {imagePreview && (
                  <div className="image-preview-box">
                    <img src={imagePreview} alt="E-waste item preview" />
                    <div className="preview-meta">
                      <span className="s3-badge">☁️ Target: Amazon S3 (Bucket: ewaste-tracker-assets)</span>
                      <button 
                        type="button" 
                        className="btn-remove-photo"
                        onClick={() => { setImageFile(null); setImagePreview(null); }}
                      >
                        Remove Photo
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="section-title" style={{ marginTop: '24px' }}>
                <h2>3. Doorstep Pickup Details</h2>
              </div>

              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Full Pickup Address *</label>
                  <textarea
                    rows="2"
                    required
                    placeholder="Enter complete building, street, landmark and city..."
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Contact Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={userContact}
                    onChange={(e) => setUserContact(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="btn btn-primary submit-btn"
                >
                  {isSubmitting ? (
                    <span>Processing Cloud Request...</span>
                  ) : (
                    <>
                      <UploadCloud size={18} />
                      <span>Submit Request to Cloud</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: LIVE TRACKING & HISTORY */}
      {/* ========================================================= */}
      {activeTab === 'track' && (
        <div className="tracking-section">
          {myRequests.length === 0 ? (
            <div className="empty-state card">
              <AlertCircle size={40} className="text-muted" />
              <h3>No E-Waste Requests Found</h3>
              <p>You haven't scheduled any electronic waste collection requests yet.</p>
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={() => setActiveTab('submit')}
              >
                Schedule Your First Pickup
              </button>
            </div>
          ) : (
            <div className="requests-list">
              {myRequests.map((req) => {
                const currentStepIdx = getStepIndex(req.status);
                return (
                  <div key={req.id} className="card request-card">
                    <div className="req-header">
                      <div className="req-id-badge">
                        <span className="req-id">{req.id}</span>
                        <span className={`status-tag status-${req.status.toLowerCase()}`}>
                          {req.status}
                        </span>
                      </div>
                      <span className="req-date">
                        Logged: {new Date(req.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="req-body">
                      {req.photoUrl && (
                        <div className="req-thumb-container">
                          <div className="req-thumb">
                            <img src={req.photoUrl} alt={req.brandModel} />
                          </div>
                          <span className="s3-pill-badge" title="Binary object stored in Amazon Simple Storage Service (Amazon S3)">
                            ☁️ Amazon S3 Object
                          </span>
                        </div>
                      )}
                      <div className="req-details">
                        <h3 className="req-title">{req.brandModel}</h3>
                        <p className="req-meta">
                          <strong>Category:</strong> {req.category} | <strong>Quantity:</strong> {req.quantity} | <strong>Weight:</strong> {req.weightKg} kg
                        </p>
                        <p className="req-meta">
                          <strong>Condition:</strong> {req.condition}
                        </p>
                        <p className="req-meta">
                          <strong>Pickup Location:</strong> {req.pickupAddress}
                        </p>
                        {req.scheduledDate && (
                          <div className="collector-banner">
                            <strong>Scheduled Pickup:</strong> {req.scheduledDate}
                          </div>
                        )}
                        {req.collectorNotes && (
                          <div className="collector-banner notes">
                            <strong>Collector Notes:</strong> {req.collectorNotes}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Visual Stepper */}
                    <div className="stepper-container">
                      <div className="stepper-title">Real-Time Cloud Tracking Progress:</div>
                      <div className="stepper">
                        {STATUS_STEPS.map((step, idx) => {
                          const isDone = idx < currentStepIdx;
                          const isCurrent = idx === currentStepIdx;
                          const StepIcon = step.icon;

                          return (
                            <div 
                              key={step.key} 
                              className={`step-item ${isDone ? 'done' : ''} ${isCurrent ? 'active' : ''}`}
                            >
                              <div className="step-circle">
                                <StepIcon size={16} />
                              </div>
                              <div className="step-content">
                                <div className="step-label">{step.label}</div>
                                <div className="step-desc">{step.desc}</div>
                              </div>
                              {idx < STATUS_STEPS.length - 1 && <div className="step-connector"></div>}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Green Certificate Action for Completed Requests */}
                    {req.status === 'Completed' && (
                      <div className="req-cert-action-bar">
                        <div className="cert-info-text">
                          <Award size={18} className="text-emerald" />
                          <span>This item was safely dismantled and recycled according to environmental guidelines.</span>
                        </div>
                        <button
                          type="button"
                          className="btn btn-emerald btn-sm"
                          onClick={() => setSelectedCertRequest(req)}
                        >
                          <Award size={16} />
                          <span>View Official Green Certificate</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: GREEN CERTIFICATES */}
      {/* ========================================================= */}
      {activeTab === 'certificates' && (
        <div className="certificates-gallery-section">
          <div className="card section-intro-card">
            <div className="cert-seal-intro">
              <Award size={36} className="text-emerald" />
              <div>
                <h2>Verified Green Recycling Certificates</h2>
                <p className="text-muted">
                  Official certificates issued in compliance with environmental e-waste recovery guidelines.
                </p>
              </div>
            </div>
          </div>

          {completedItems.length === 0 ? (
            <div className="card empty-state" style={{ marginTop: '16px' }}>
              <Award size={40} className="text-muted" />
              <h3>No Completed Certificates Yet</h3>
              <p className="text-muted">
                Certificates are unlocked and emailed via Amazon SES once your device reaches <strong>Completed (Recycled)</strong> status.
              </p>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setActiveTab('track')}
              >
                Track Your Pending Pickups
              </button>
            </div>
          ) : (
            <div className="cert-cards-grid" style={{ marginTop: '16px' }}>
              {completedItems.map((item) => (
                <div key={item.id} className="card cert-display-card">
                  <div className="cert-card-top">
                    <Award size={28} className="text-emerald" />
                    <span className="cert-id-tag">CERT-{item.id}-2026</span>
                  </div>
                  <h3>{item.brandModel}</h3>
                  <p className="text-muted" style={{ fontSize: '0.85rem' }}>{item.category} • {item.weightKg} kg</p>
                  <div className="cert-stats-mini">
                    <div>
                      <span>CO₂e Saved:</span>
                      <strong>{((item.weightKg || 1) * 1.44).toFixed(1)} kg</strong>
                    </div>
                    <div>
                      <span>Diverted:</span>
                      <strong>100%</strong>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-emerald full-width btn-sm"
                    style={{ marginTop: '14px' }}
                    onClick={() => setSelectedCertRequest(item)}
                  >
                    <Award size={15} />
                    <span>View & Print Official Certificate</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Official Certificate Modal */}
      <GreenCertificateModal
        request={selectedCertRequest}
        isOpen={Boolean(selectedCertRequest)}
        onClose={() => setSelectedCertRequest(null)}
      />
    </div>
  );
}
