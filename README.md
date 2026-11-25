# ♻️ E-Waste Collection Tracker: Cloud-Based Electronic Waste Management System

A cloud-based electronic waste management and tracking web application designed to facilitate responsible disposal, collection, and recycling of unwanted electronic devices.

---

## 🌟 Key Features

### 👤 Citizen / Donor Portal
* **E-Waste Categorization:** Select from Mobile Devices, Laptops, Batteries, Chargers/Cables, Circuit Boards, and Home Appliances.
* **Smart Details & Photo Upload:** Upload or capture device inspection photos stored directly in Cloud Storage.
* **Real-Time Visual Stepper Tracking:** Live status lifecycle:
  `[1] Pending Review` ➔ `[2] Accepted & Scheduled` ➔ `[3] Collected` ➔ `[4] Recycled / Completed`.
* **Personal Impact Metrics:** Displays total e-waste weight diverted from hazardous landfill leaching.

### 🛡️ Collector / Logistics & Admin Portal
* **Central Cloud Registry:** Real-time visibility into all city-wide e-waste collection requests.
* **Dynamic Status Workflow:** Schedule pickups with custom date/time slots and assign driver instructions with one click.
* **Cloud Analytics:** Live breakdown charts by e-waste category and diversion statistics.

### ☁️ Cloud Architecture & Viva Helper
* Built-in interactive modal demonstrating how each component maps to Cloud Computing models (**PaaS, DBaaS, Object Storage, FaaS, and IDaaS**).

---

## 🚀 Getting Started

### 1. Launch the Development Server
```bash
npm run dev
```
Open the local URL (e.g. `http://localhost:5173`) in your web browser.

### 2. Dual Operation Modes
1. **Cloud Sandbox Mode (Default):** Runs immediately with zero configuration! Uses local cloud simulation with pre-populated demo requests for immediate presentation and testing.
2. **Live Firebase Mode:** Copy `.env.example` to `.env` and fill in your Firebase project credentials to connect directly to live Google Cloud Firestore and Cloud Storage.

---

## ☁️ Cloud Computing Service Model Mapping

| Service Model | Implementation in Project | Academic Purpose |
| :--- | :--- | :--- |
| **PaaS** (Platform as a Service) | Firebase Hosting / Vercel Edge | Global CDN distribution, automated SSL, zero server maintenance |
| **DBaaS** (Database as a Service) | Cloud Firestore | Serverless NoSQL document store with real-time change listeners |
| **STaaS** (Storage as a Service) | Cloud Storage Buckets | Binary object storage for device inspection photos |
| **FaaS** (Function as a Service) | Cloud Functions (Node.js) | Event-driven serverless compute triggered on submission/status updates |
| **IDaaS** (Identity as a Service) | Firebase Authentication | Role-based token issuance for Citizens and Collectors |

---

## 🛠️ Tech Stack
* **Frontend:** React 19, Vite 8, Lucide Icons, Custom CSS Design System
* **Cloud Backend:** Firebase / Google Cloud Platform (Auth, Firestore, Cloud Storage, Functions)
* **Language:** JavaScript / Modern ES6+
