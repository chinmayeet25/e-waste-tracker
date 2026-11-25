import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Filter, 
  CheckCircle2, 
  Truck, 
  Recycle, 
  Clock, 
  MapPin, 
  Calendar, 
  Phone, 
  FileText,
  BarChart3,
  Scale,
  PackageCheck,
  Download,
  Search,
  RotateCcw
} from 'lucide-react';
import { cloudService } from '../services/cloudService';


export default function AdminPortal({ requests, onStatusUpdated }) {
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  // Modal / Prompt state for Scheduling
  const [scheduleModalReq, setScheduleModalReq] = useState(null);
  const [scheduledDateInput, setScheduledDateInput] = useState('');
  const [collectorNotesInput, setCollectorNotesInput] = useState('');

  const handleOpenScheduleModal = (req) => {
    setScheduleModalReq(req);
    setScheduledDateInput("Tomorrow, 10:00 AM");
    setCollectorNotesInput("Assigned to Route Van #3 (Driver: Suresh). Will inspect device condition.");
  };

  const handleConfirmSchedule = async () => {
    if (!scheduleModalReq) return;
    try {
      setUpdatingId(scheduleModalReq.id);
      await cloudService.updateStatus(
        scheduleModalReq.id, 
        'Accepted', 
        collectorNotesInput, 
        scheduledDateInput
      );
      setScheduleModalReq(null);
      onStatusUpdated();
    } catch (err) {
      alert("Update failed: " + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDirectTransition = async (requestId, nextStatus, defaultNote = "") => {
    try {
      setUpdatingId(requestId);
      await cloudService.updateStatus(requestId, nextStatus, defaultNote);
      onStatusUpdated();
    } catch (err) {
      alert("Update failed: " + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  // Compute analytics
  const totalCount = requests.length;
  const pendingCount = requests.filter(r => r.status === 'Pending').length;
  const acceptedCount = requests.filter(r => r.status === 'Accepted').length;
  const collectedCount = requests.filter(r => r.status === 'Collected').length;
  const completedCount = requests.filter(r => r.status === 'Completed').length;
  const totalWeight = requests.reduce((acc, r) => acc + (r.weightKg || 0), 0).toFixed(1);

  // Category counts
  const categoryStats = {};
  requests.forEach(r => {
    categoryStats[r.category] = (categoryStats[r.category] || 0) + 1;
  });

  const handleExportCSV = () => {
    const csv = cloudService.exportToCSV(requests);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ewaste_audit_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter requests
  const filteredRequests = requests.filter(r => {
    const matchesStatus = filterStatus === 'All' || r.status === filterStatus;
    const matchesCat = filterCategory === 'All' || r.category === filterCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery = !q || 
      (r.id && r.id.toLowerCase().includes(q)) ||
      (r.brandModel && r.brandModel.toLowerCase().includes(q)) ||
      (r.userName && r.userName.toLowerCase().includes(q)) ||
      (r.category && r.category.toLowerCase().includes(q));
    return matchesStatus && matchesCat && matchesQuery;
  });


  return (
    <div className="admin-portal">
      {/* Admin KPI Ribbon */}
      <div className="admin-header-row">
        <div>
          <h2>E-Waste Logistics & Recycling Control Center</h2>
          <p className="text-muted">Cloud database synchronized real-time management view for authorized collectors</p>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-label">Total Submissions</div>
          <div className="stat-value">{totalCount}</div>
          <div className="stat-sub">Central Cloud Registry</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending Review</div>
          <div className="stat-value text-amber">{pendingCount}</div>
          <div className="stat-sub">Needs schedule approval</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Scheduled / In Transit</div>
          <div className="stat-value text-cyan">{acceptedCount + collectedCount}</div>
          <div className="stat-sub">{acceptedCount} scheduled, {collectedCount} collected</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Diverted</div>
          <div className="stat-value text-emerald">{totalWeight} kg</div>
          <div className="stat-sub">{completedCount} batches safely recycled</div>
        </div>
      </div>

      {/* Category Breakdown Progress */}
      <div className="card category-analytics-card">
        <div className="card-header-flex">
          <div className="card-title-group">
            <BarChart3 size={18} className="text-emerald" />
            <h3>Cloud Analytics: Collection by E-Waste Category</h3>
          </div>
          <span className="badge-pill">{Object.keys(categoryStats).length} Active Categories</span>
        </div>

        <div className="category-bars-grid">
          {Object.entries(categoryStats).map(([catName, count]) => {
            const pct = Math.round((count / (totalCount || 1)) * 100);
            return (
              <div key={catName} className="cat-bar-item">
                <div className="cat-bar-header">
                  <span className="cat-name">{catName}</span>
                  <span className="cat-count">{count} units ({pct}%)</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${pct}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="admin-filter-bar">
        <div className="admin-search-box">
          <Search size={16} className="text-muted" />
          <input
            type="text"
            placeholder="Search by ID, Model, or Citizen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <Filter size={16} />
          <span>Status:</span>
          {['All', 'Pending', 'Accepted', 'Collected', 'Completed'].map((s) => (
            <button
              key={s}
              type="button"
              className={`filter-btn ${filterStatus === s ? 'active' : ''}`}
              onClick={() => setFilterStatus(s)}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="export-action-group" style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleExportCSV}
            title="Export all requests to CSV format for audit reporting"
          >
            <Download size={15} />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => {
              if (window.confirm("Reset all requests to fresh initial sample demonstration data?")) {
                cloudService.resetDemoData();
                onStatusUpdated();
              }
            }}
            title="Reset to fresh demo requests"
          >
            <RotateCcw size={15} />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>



      {/* Requests Management Grid */}
      <div className="admin-requests-list">
        {filteredRequests.length === 0 ? (
          <div className="card empty-state">
            <p>No e-waste requests match the selected filter criteria.</p>
          </div>
        ) : (
          filteredRequests.map((req) => (
            <div key={req.id} className="card admin-request-card">
              <div className="admin-card-top">
                <div className="req-id-badge">
                  <span className="req-id">{req.id}</span>
                  <span className={`status-tag status-${req.status.toLowerCase()}`}>
                    {req.status}
                  </span>
                </div>
                <span className="badge-category">{req.category}</span>
              </div>

              <div className="admin-card-content">
                {req.photoUrl && (
                  <div className="admin-card-photo">
                    <img src={req.photoUrl} alt={req.brandModel} />
                  </div>
                )}

                <div className="admin-card-info">
                  <h3>{req.brandModel}</h3>
                  <div className="info-grid">
                    <div><strong>Quantity:</strong> {req.quantity} unit(s)</div>
                    <div><strong>Weight:</strong> {req.weightKg} kg</div>
                    <div><strong>Condition:</strong> {req.condition}</div>
                    <div><strong>Citizen:</strong> {req.userName}</div>
                  </div>

                  <div className="location-row">
                    <MapPin size={15} className="text-muted" />
                    <span>{req.pickupAddress}</span>
                  </div>

                  <div className="phone-row">
                    <Phone size={15} className="text-muted" />
                    <span>{req.userContact}</span>
                  </div>

                  {req.scheduledDate && (
                    <div className="schedule-row">
                      <Calendar size={15} className="text-cyan" />
                      <span><strong>Scheduled:</strong> {req.scheduledDate}</span>
                    </div>
                  )}

                  {req.collectorNotes && (
                    <div className="notes-row">
                      <FileText size={15} className="text-muted" />
                      <span>{req.collectorNotes}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="admin-card-actions">
                {req.status === 'Pending' && (
                  <button
                    type="button"
                    disabled={updatingId === req.id}
                    className="btn btn-primary"
                    onClick={() => handleOpenScheduleModal(req)}
                  >
                    <Clock size={16} />
                    <span>Accept & Schedule Pickup</span>
                  </button>
                )}

                {req.status === 'Accepted' && (
                  <button
                    type="button"
                    disabled={updatingId === req.id}
                    className="btn btn-cyan"
                    onClick={() => handleDirectTransition(req.id, 'Collected', 'Picked up by Logistics Van. Transit to sorting facility.')}
                  >
                    <Truck size={16} />
                    <span>Confirm Doorstep Collection</span>
                  </button>
                )}

                {req.status === 'Collected' && (
                  <button
                    type="button"
                    disabled={updatingId === req.id}
                    className="btn btn-emerald"
                    onClick={() => handleDirectTransition(req.id, 'Completed', 'Processed at authorized recycling plant. Hazardous components isolated and raw metals reclaimed.')}
                  >
                    <Recycle size={16} />
                    <span>Mark as Recycled (Complete)</span>
                  </button>
                )}

                {req.status === 'Completed' && (
                  <div className="completed-badge">
                    <PackageCheck size={18} className="text-emerald" />
                    <span>Recycling Cycle Completed</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Schedule Pickup Modal */}
      {scheduleModalReq && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h3>Schedule Pickup for {scheduleModalReq.id}</h3>
            <p className="text-muted">Item: {scheduleModalReq.brandModel} ({scheduleModalReq.category})</p>
            
            <div className="form-group" style={{ marginTop: '16px' }}>
              <label>Pickup Date & Time Slot:</label>
              <input
                type="text"
                value={scheduledDateInput}
                onChange={(e) => setScheduledDateInput(e.target.value)}
                placeholder="e.g. Tomorrow, 10:00 AM - 12:00 PM"
              />
            </div>

            <div className="form-group">
              <label>Collector Instructions / Driver Note:</label>
              <textarea
                rows="3"
                value={collectorNotesInput}
                onChange={(e) => setCollectorNotesInput(e.target.value)}
                placeholder="Driver name, van number, packaging instructions..."
              />
            </div>

            <div className="modal-actions">
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => setScheduleModalReq(null)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={handleConfirmSchedule}
              >
                Confirm & Push to Cloud
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
