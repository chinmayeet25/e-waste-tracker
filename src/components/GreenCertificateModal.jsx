import React from 'react';
import { X, Award, Printer, ShieldCheck, Leaf, CheckCircle2, Trees, Sparkles } from 'lucide-react';
import { cloudService } from '../services/cloudService';

export default function GreenCertificateModal({ request, isOpen, onClose }) {
  if (!isOpen || !request) return null;

  const cert = cloudService.getCertificate(request);
  if (!cert) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box cert-modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Modal Controls Bar */}
        <div className="cert-modal-toolbar no-print">
          <span className="cert-toolbar-title">Official E-Waste Recycling Certificate</span>
          <div className="cert-toolbar-actions">
            <button type="button" className="btn btn-emerald btn-sm" onClick={handlePrint}>
              <Printer size={16} />
              <span>Print / Save as PDF</span>
            </button>
            <button type="button" className="btn-close" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Printable Certificate Document */}
        <div className="certificate-document" id="printable-cert">
          <div className="cert-border-outer">
            <div className="cert-border-inner">
              
              {/* Header */}
              <div className="cert-header">
                <div className="cert-seal">
                  <Award size={48} className="text-emerald" />
                  <Sparkles size={20} className="seal-sparkle" />
                </div>
                <div className="cert-org">NATIONAL E-WASTE CLEANUP & RECYCLING NETWORK</div>
                <h1 className="cert-title">Certificate of Safe E-Waste Recycling</h1>
                <p className="cert-subtitle">Issued in compliance with E-Waste Management & Environmental Protection Rules</p>
                <div className="cert-number">Certificate No: <strong>{cert.certificateNumber}</strong></div>
              </div>

              {/* Body */}
              <div className="cert-body">
                <p className="cert-presents">This certifies that</p>
                <h2 className="cert-recipient">{cert.recipientName}</h2>
                <p className="cert-statement">
                  has demonstrated exemplary environmental responsibility by responsibly channeling obsolete electronic equipment into certified recycling and material recovery streams.
                </p>

                {/* Device Breakdown Table */}
                <div className="cert-item-summary">
                  <div className="cert-metric-col">
                    <span className="metric-label">Equipment Category</span>
                    <span className="metric-val">{cert.category}</span>
                  </div>
                  <div className="cert-metric-col">
                    <span className="metric-label">Device Model</span>
                    <span className="metric-val">{cert.deviceModel}</span>
                  </div>
                  <div className="cert-metric-col">
                    <span className="metric-label">Quantity & Weight</span>
                    <span className="metric-val">{cert.quantity} Unit(s) • {cert.weightKg} kg</span>
                  </div>
                </div>

                {/* Eco Impact Stats */}
                <div className="cert-eco-impact">
                  <div className="impact-box">
                    <Trees size={24} className="text-emerald" />
                    <div>
                      <div className="impact-num">{cert.co2SavedKg} kg</div>
                      <div className="impact-desc">Estimated CO₂e Emissions Prevented</div>
                    </div>
                  </div>
                  <div className="impact-box">
                    <ShieldCheck size={24} className="text-cyan" />
                    <div>
                      <div className="impact-num">{cert.landfillDiverted}</div>
                      <div className="impact-desc">Diverted from Groundwater Contamination</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Signatures & Footer */}
              <div className="cert-footer">
                <div className="cert-sig-block">
                  <div className="sig-line">
                    <span className="sig-signature">Dr. S. K. Mukherjee</span>
                  </div>
                  <div className="sig-title">Director of Environmental Compliance</div>
                  <div className="sig-sub">{cert.facilityName}</div>
                </div>

                <div className="cert-auth-stamp">
                  <div className="stamp-circle">
                    <CheckCircle2 size={32} className="text-emerald" />
                    <span>VERIFIED RECYCLED</span>
                  </div>
                  <div className="stamp-date">Date: {cert.completionDate}</div>
                </div>

                <div className="cert-sig-block">
                  <div className="sig-line">
                    <span className="sig-signature">P. V. Chawla</span>
                  </div>
                  <div className="sig-title">Authorized Logistics Officer</div>
                  <div className="sig-sub">Cloud Verification: {cert.verificationHash.slice(0, 16)}...</div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
