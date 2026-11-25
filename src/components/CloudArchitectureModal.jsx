import React from 'react';
import { X, Cloud, Layers, Database, HardDrive, Shield, Bell, Mail, Smartphone, Zap } from 'lucide-react';

export default function CloudArchitectureModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box cloud-arch-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-flex">
            <Cloud className="text-cyan" size={24} />
            <div>
              <h3>Amazon Web Services (AWS) Cloud Architecture</h3>
              <p className="text-muted">Technical mapping of AWS services, storage & notification pipelines for evaluation</p>
            </div>
          </div>
          <button type="button" className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="arch-content">
          {/* AWS Services Mapping */}
          <div className="service-pillars-grid">
            <div className="pillar-card">
              <div className="pillar-header">
                <HardDrive className="pillar-icon text-amber" size={20} />
                <strong>Amazon S3 (Image Storage)</strong>
              </div>
              <p>
                <strong>Where images are stored:</strong> Uploaded device inspection photos are stored as binary objects in an <strong>Amazon S3 Bucket</strong>. The database only stores the secure S3 URL & Object Key, completely decoupling heavy media from database queries.
              </p>
            </div>

            <div className="pillar-card">
              <div className="pillar-header">
                <Smartphone className="pillar-icon text-purple" size={20} />
                <strong>Amazon SNS (SMS Alerts)</strong>
              </div>
              <p>
                <strong>How notifications are sent (SMS):</strong> Amazon Simple Notification Service sends automated, instantaneous SMS text messages to the citizen's phone when a collector accepts or picks up their e-waste.
              </p>
            </div>

            <div className="pillar-card">
              <div className="pillar-header">
                <Mail className="pillar-icon text-emerald" size={20} />
                <strong>Amazon SES (Email Dispatch)</strong>
              </div>
              <p>
                <strong>How certificates are delivered (Email):</strong> Amazon Simple Email Service dispatches the formal <strong>Green Recycling Certificate</strong> and environmental carbon offset summary directly to the user's inbox upon completion.
              </p>
            </div>

            <div className="pillar-card">
              <div className="pillar-header">
                <Layers className="pillar-icon text-cyan" size={20} />
                <strong>AWS App Runner / Elastic Beanstalk</strong>
              </div>
              <p>
                <strong>PaaS Compute Layer:</strong> Runs the unified Node.js Express server and serves the React frontend via a high-performance, autoscaling container with automatic SSL certificate management.
              </p>
            </div>

            <div className="pillar-card">
              <div className="pillar-header">
                <Database className="pillar-icon text-emerald" size={20} />
                <strong>Amazon DynamoDB / JSON Store</strong>
              </div>
              <p>
                <strong>DBaaS Layer:</strong> High-throughput serverless NoSQL document store persisting collection requests, status transition histories, and citizen profiles.
              </p>
            </div>

            <div className="pillar-card">
              <div className="pillar-header">
                <Shield className="pillar-icon text-blue" size={20} />
                <strong>AWS IAM & Cognito (Security)</strong>
              </div>
              <p>
                <strong>IDaaS Layer:</strong> Role-based access control separating regular Citizen donors from Logistics Admins, with signed tokens and least-privilege policies.
              </p>
            </div>
          </div>

          {/* Academic Viva Q&A on Notifications & Storage */}
          <div className="viva-section">
            <h4>💡 Critical Viva Questions: Storage & Notification Pipeline</h4>
            <ul>
              <li>
                <strong>Q1: In what service are uploaded e-waste device images stored?</strong><br />
                <em>Answer:</em> Images are stored in <strong>Amazon S3 (Simple Storage Service)</strong> as binary object blobs. This decouples storage from compute, delivers 99.999999999% (11 9's) durability, and prevents database bloating.
              </li>
              <li>
                <strong>Q2: How are notifications dispatched to the user when status changes?</strong><br />
                <em>Answer:</em> Notifications are triggered by the backend through <strong>Amazon SNS (Simple Notification Service)</strong> for real-time SMS alerts to the user's mobile number, <strong>Amazon SES (Simple Email Service)</strong> for emailing Green Certificates, and rendered in the live <strong>In-App Notification Bell</strong>.
              </li>
              <li>
                <strong>Q3: How does the system scale if thousands of users upload photos simultaneously?</strong><br />
                <em>Answer:</em> Amazon S3 scales elastically to handle thousands of concurrent read/write requests per second automatically without needing any disk resizing or server provisioning.
              </li>
            </ul>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Close Architecture View
          </button>
        </div>
      </div>
    </div>
  );
}
