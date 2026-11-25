import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const PORT = process.env.PORT || 5000;
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'requests.json');

// Middleware
app.use(cors());
app.use(express.json({ limit: '15mb' })); // Support base64 image payloads
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Initial seed demonstration records
const INITIAL_REQUESTS = [
  {
    id: "EW-90214",
    userId: "demo-user-1",
    userName: "Rahul Sharma",
    userContact: "+91 98765 43210",
    category: "Laptops & Computers",
    brandModel: "Dell Inspiron 15 (2018)",
    quantity: 1,
    weightKg: 2.4,
    condition: "Defective (Motherboard issue, does not turn on)",
    pickupAddress: "Flat 402, Green Meadows, Sector 14, Bengaluru",
    photoUrl: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80",
    status: "Accepted",
    scheduledDate: "Tomorrow, 11:00 AM",
    collectorNotes: "Collector assigned: TechRecycle Team Alpha. Will verify serial numbers on site.",
    statusHistory: [
      { status: "Pending", timestamp: new Date(Date.now() - 86400000 * 2).toISOString() },
      { status: "Accepted", timestamp: new Date(Date.now() - 86400000).toISOString() }
    ],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: "EW-90215",
    userId: "demo-user-1",
    userName: "Rahul Sharma",
    userContact: "+91 98765 43210",
    category: "Mobile Phones & Tablets",
    brandModel: "Redmi Note 7 Pro",
    quantity: 2,
    weightKg: 0.4,
    condition: "Scrap / Broken Screen",
    pickupAddress: "Flat 402, Green Meadows, Sector 14, Bengaluru",
    photoUrl: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80",
    status: "Completed",
    scheduledDate: "Yesterday, 3:00 PM",
    collectorNotes: "Received safely. Transferred to R2 Certified E-Waste Dismantler for precious metal extraction.",
    statusHistory: [
      { status: "Pending", timestamp: new Date(Date.now() - 86400000 * 4).toISOString() },
      { status: "Accepted", timestamp: new Date(Date.now() - 86400000 * 3).toISOString() },
      { status: "Collected", timestamp: new Date(Date.now() - 86400000 * 2).toISOString() },
      { status: "Completed", timestamp: new Date(Date.now() - 86400000 * 1).toISOString() }
    ],
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: "EW-90216",
    userId: "demo-user-2",
    userName: "Priya Nair",
    userContact: "+91 98111 22334",
    category: "Batteries & Power Supplies",
    brandModel: "Lithium Ion Laptop Battery + 4 Power Banks",
    quantity: 5,
    weightKg: 1.8,
    condition: "Swollen / Dead battery cells",
    pickupAddress: "Villa 12, Palm Residency, Whitefield, Bengaluru",
    photoUrl: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&auto=format&fit=crop&q=80",
    status: "Pending",
    scheduledDate: "",
    collectorNotes: "",
    statusHistory: [
      { status: "Pending", timestamp: new Date().toISOString() }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const USERS_FILE = path.join(DATA_DIR, 'users.json');

const INITIAL_USERS = [
  {
    id: "usr-admin-0",
    name: "Admin Officer (Facility Chief)",
    email: "admin@ewaste.gov",
    password: "admin123",
    role: "admin",
    createdAt: new Date().toISOString()
  },
  {
    id: "demo-user-1",
    name: "Rahul Sharma",
    email: "rahul@ewaste.in",
    password: "user123",
    role: "citizen",
    createdAt: new Date().toISOString()
  }
];

// Helper to ensure data directory and file exist
function readData() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_REQUESTS, null, 2), 'utf-8');
      return INITIAL_REQUESTS;
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading data file:", err);
    return INITIAL_REQUESTS;
  }
}

function writeData(data) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error("Error writing data file:", err);
  }
}

function readUsers() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(USERS_FILE)) {
      fs.writeFileSync(USERS_FILE, JSON.stringify(INITIAL_USERS, null, 2), 'utf-8');
      return INITIAL_USERS;
    }
    const raw = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading users file:", err);
    return INITIAL_USERS;
  }
}

function writeUsers(users) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (err) {
    console.error("Error writing users file:", err);
  }
}

// Notifications Store (AWS SNS / SES alerts simulation)
const NOTIFICATIONS_FILE = path.join(DATA_DIR, 'notifications.json');

const INITIAL_NOTIFICATIONS = [
  {
    id: "notif-1",
    userId: "demo-user-1",
    requestId: "EW-90214",
    title: "Pickup Scheduled",
    message: "Collector TechRecycle Alpha assigned. Scheduled for Tomorrow, 11:00 AM.",
    channel: "Amazon SNS (SMS to +91 98765 43210)",
    status: "Accepted",
    isRead: false,
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: "notif-2",
    userId: "demo-user-1",
    requestId: "EW-90215",
    title: "E-Waste Recycled & Green Certificate Ready",
    message: "Redmi Note 7 Pro safely recycled. Certificate CERT-EW-90215-2026 issued and emailed.",
    channel: "Amazon SES (Email to rahul@ewaste.in) & In-App",
    status: "Completed",
    isRead: true,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

function readNotifications() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(NOTIFICATIONS_FILE)) {
      fs.writeFileSync(NOTIFICATIONS_FILE, JSON.stringify(INITIAL_NOTIFICATIONS, null, 2), 'utf-8');
      return INITIAL_NOTIFICATIONS;
    }
    const raw = fs.readFileSync(NOTIFICATIONS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading notifications file:", err);
    return INITIAL_NOTIFICATIONS;
  }
}

function writeNotifications(data) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(NOTIFICATIONS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error("Error writing notifications file:", err);
  }
}



// -------------------------------------------------------------
// FRONTEND STATIC SERVING (For Unified AWS Hosting)
// -------------------------------------------------------------
const DIST_DIR = path.join(__dirname, '../dist');

if (fs.existsSync(DIST_DIR)) {
  console.log(`[Express] Serving static React frontend from: ${DIST_DIR}`);
  app.use(express.static(DIST_DIR));
} else {
  // Fallback API overview if frontend hasn't been built yet
  app.get('/', (req, res) => {
    const records = readData().length;
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>E-Waste Tracker - Backend Server</title>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; background: #0f172a; color: #f8fafc; padding: 40px 20px; display: flex; justify-content: center; }
          .card { background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 32px; max-width: 650px; width: 100%; box-shadow: 0 10px 25px rgba(0,0,0,0.3); }
          .badge { background: #064e3b; color: #34d399; padding: 4px 12px; border-radius: 9999px; font-weight: 700; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 6px; }
          h1 { margin: 16px 0 8px 0; font-size: 1.6rem; color: #ffffff; }
          p { color: #94a3b8; font-size: 0.95rem; line-height: 1.5; }
        </style>
      </head>
      <body>
        <div class="card">
          <span class="badge">● Online & Ready</span>
          <h1>🚀 E-Waste Collection Tracker Backend</h1>
          <p>Running on port <code>${PORT}</code> with <strong>${records}</strong> active records.</p>
          <p>Run <code>npm run build</code> to bundle the frontend for production.</p>
        </div>
      </body>
      </html>
    `);
  });
}


// -------------------------------------------------------------
// AUTHENTICATION ROUTES (Citizen & Admin Access Control)
// -------------------------------------------------------------

// Register new account
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role, adminCode } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "Name, email, and password are required." });
  }

  const targetRole = role === 'admin' ? 'admin' : 'citizen';

  // Admin access validation
  if (targetRole === 'admin' && adminCode !== 'ADMIN2026') {
    return res.status(403).json({
      success: false,
      message: "Invalid Administrator Passcode. Enter 'ADMIN2026' for testing."
    });
  }

  const users = readUsers();
  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  if (existing) {
    return res.status(409).json({ success: false, message: "An account with this email already exists." });
  }

  const newUser = {
    id: targetRole === 'admin' ? `adm-${Date.now()}` : `usr-${Date.now()}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password: password,
    role: targetRole,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  writeUsers(users);

  console.log(`[Express Auth] Registered new ${targetRole}: ${newUser.email}`);
  res.status(201).json({
    success: true,
    message: "Registration successful!",
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    },
    token: `token_${newUser.id}`
  });
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required." });
  }

  const users = readUsers();
  let user = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password);

  if (!user) {
    if (!email.toLowerCase().includes("admin")) {
      user = {
        id: `usr-${Date.now()}`,
        name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
        email: email.toLowerCase().trim(),
        password: password,
        role: "citizen",
        createdAt: new Date().toISOString()
      };
      users.push(user);
      writeUsers(users);
      console.log(`[Express Auth] Auto-registered citizen account: ${user.email}`);
    } else {
      return res.status(401).json({ success: false, message: "Invalid email or password for Admin. Demo password is admin123" });
    }
  }

  console.log(`[Express Auth] User logged in: ${user.email} (${user.role})`);
  res.json({
    success: true,
    message: "Login successful!",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    token: `token_${user.id}`
  });
});

// List users for audit review
app.get('/api/auth/users', (req, res) => {
  const users = readUsers().map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    createdAt: u.createdAt
  }));
  res.json({ success: true, count: users.length, data: users });
});

// 1. Health Check
app.get('/api/health', (req, res) => {


  res.json({
    status: "online",
    system: "E-Waste Collection Tracker - Node.js Express Backend",
    port: PORT,
    timestamp: new Date().toISOString(),
    recordsCount: readData().length
  });
});

// 2. GET all requests (with optional filters)
app.get('/api/requests', (req, res) => {
  const { userId, status, category } = req.query;
  let list = readData();

  if (userId) {
    list = list.filter(r => r.userId === userId);
  }
  if (status && status !== 'All') {
    list = list.filter(r => r.status === status);
  }
  if (category && category !== 'All') {
    list = list.filter(r => r.category === category);
  }

  res.json({
    success: true,
    count: list.length,
    data: list
  });
});

// 3. GET single request by ID
app.get('/api/requests/:id', (req, res) => {
  const list = readData();
  const found = list.find(r => r.id === req.params.id);
  if (!found) {
    return res.status(404).json({ success: false, message: "Request not found" });
  }
  res.json({ success: true, data: found });
});

// 4. POST: Create a new e-waste pickup request
app.post('/api/requests', (req, res) => {
  const {
    userId,
    userName,
    userContact,
    category,
    brandModel,
    quantity,
    weightKg,
    condition,
    pickupAddress,
    photoUrl
  } = req.body;

  if (!brandModel || !pickupAddress) {
    return res.status(400).json({
      success: false,
      message: "Device model/description and pickup address are required."
    });
  }

  const now = new Date().toISOString();
  const newId = `EW-${Math.floor(10000 + Math.random() * 90000)}`;

  const newRequest = {
    id: newId,
    userId: userId || "demo-user-1",
    userName: userName || "Rahul Sharma",
    userContact: userContact || "+91 98765 43210",
    category: category || "Other Electronic Waste",
    brandModel: brandModel.trim(),
    quantity: Number(quantity) || 1,
    weightKg: Number(weightKg) || 1.0,
    condition: condition || "Non-Working / Scrap",
    pickupAddress: pickupAddress.trim(),
    photoUrl: photoUrl || "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600&auto=format&fit=crop&q=80",
    s3Storage: {
      bucket: "s3://ewaste-tracker-assets-prod",
      objectKey: `devices/${newId}_inspection.jpg`,
      provider: "Amazon Simple Storage Service (Amazon S3)",
      region: "us-east-1"
    },
    status: "Pending", // Pending -> Accepted -> Collected -> Completed
    scheduledDate: "",
    collectorNotes: "",
    statusHistory: [
      { status: "Pending", timestamp: now }
    ],
    createdAt: now,
    updatedAt: now
  };

  const list = readData();
  list.unshift(newRequest);
  writeData(list);

  // Trigger Amazon SNS (SMS) & In-App Notification
  const notifs = readNotifications();
  notifs.unshift({
    id: `notif-${Date.now()}`,
    userId: newRequest.userId,
    requestId: newId,
    title: "Pickup Request Received",
    message: `Your request for ${newRequest.brandModel} has been logged in the cloud registry.`,
    channel: `Amazon SNS (SMS to ${newRequest.userContact}) & In-App`,
    status: "Pending",
    isRead: false,
    createdAt: now
  });
  writeNotifications(notifs);

  console.log(`[Express Backend] New request created: ${newId} - ${brandModel} (Stored in S3 metadata)`);
  res.status(201).json({ success: true, data: newRequest });
});

// 5. PUT: Update request status (State Machine Transition & Alert Dispatch)
app.put('/api/requests/:id/status', (req, res) => {
  const { status, collectorNotes, scheduledDate } = req.body;
  const validStatuses = ['Pending', 'Accepted', 'Collected', 'Completed'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
    });
  }

  const list = readData();
  const target = list.find(r => r.id === req.params.id);

  if (!target) {
    return res.status(404).json({ success: false, message: "Request not found" });
  }

  const now = new Date().toISOString();
  target.status = status;
  target.updatedAt = now;
  if (collectorNotes) target.collectorNotes = collectorNotes;
  if (scheduledDate) target.scheduledDate = scheduledDate;

  target.statusHistory.push({
    status: status,
    timestamp: now,
    notes: collectorNotes || undefined
  });

  writeData(list);

  // Trigger AWS Notification (Amazon SNS / SES Simulation)
  let alertTitle = "Status Update";
  let alertMessage = `Request ${target.id} transitioned to ${status}.`;
  let alertChannel = `Amazon SNS (SMS to ${target.userContact})`;

  if (status === 'Accepted') {
    alertTitle = "Pickup Scheduled & Collector Assigned";
    alertMessage = `Your pickup is scheduled for ${scheduledDate || 'Tomorrow'}. Driver note: ${collectorNotes || 'Assigned'}`;
    alertChannel = `Amazon SNS (SMS to ${target.userContact})`;
  } else if (status === 'Collected') {
    alertTitle = "Device Retrieved from Doorstep";
    alertMessage = `Collector retrieved ${target.brandModel}. In transit to authorized recycling unit.`;
    alertChannel = `Amazon SNS (SMS to ${target.userContact})`;
  } else if (status === 'Completed') {
    alertTitle = "E-Waste Safely Recycled!";
    alertMessage = `Your ${target.brandModel} has been dismantled. Official Green Certificate issued and sent to your email.`;
    alertChannel = `Amazon SES (Email to citizen) & Amazon SNS`;
  }

  const notifs = readNotifications();
  notifs.unshift({
    id: `notif-${Date.now()}`,
    userId: target.userId,
    requestId: target.id,
    title: alertTitle,
    message: alertMessage,
    channel: alertChannel,
    status: status,
    isRead: false,
    createdAt: now
  });
  writeNotifications(notifs);

  console.log(`[Express Backend] Alert dispatched via ${alertChannel}: ${alertTitle}`);
  console.log(`[Express Backend] Request ${req.params.id} transitioned to: ${status}`);
  res.json({ success: true, data: target });
});

// Notifications Endpoints
app.get('/api/notifications', (req, res) => {
  const { userId } = req.query;
  let list = readNotifications();
  if (userId) {
    list = list.filter(n => n.userId === userId || n.userId === "all");
  }
  res.json({ success: true, count: list.length, data: list });
});

app.put('/api/notifications/read', (req, res) => {
  const list = readNotifications().map(n => ({ ...n, isRead: true }));
  writeNotifications(list);
  res.json({ success: true, message: "All notifications marked as read" });
});


// 6. GET: Analytics & Aggregated KPIs
app.get('/api/analytics', (req, res) => {
  const list = readData();
  const totalRequests = list.length;
  const totalKg = list.reduce((acc, curr) => acc + (curr.weightKg || 1), 0);
  const completedCount = list.filter(r => r.status === "Completed").length;
  const pendingCount = list.filter(r => r.status === "Pending").length;
  const acceptedCount = list.filter(r => r.status === "Accepted").length;
  const collectedCount = list.filter(r => r.status === "Collected").length;

  const categoryCounts = {};
  list.forEach(r => {
    categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1;
  });

  res.json({
    success: true,
    data: {
      totalRequests,
      totalKg: Number(totalKg.toFixed(1)),
      completedCount,
      pendingCount,
      acceptedCount,
      collectedCount,
      categoryCounts,
      recyclingRate: totalRequests > 0 ? Math.round(((completedCount + collectedCount) / totalRequests) * 100) : 0,
      totalCo2SavedKg: Number((totalKg * 1.44).toFixed(1))
    }
  });
});

// 7. GET: Official Green Certificate metadata
app.get('/api/requests/:id/certificate', (req, res) => {
  const list = readData();
  const request = list.find(r => r.id === req.params.id);

  if (!request) {
    return res.status(404).json({ success: false, message: "Request not found" });
  }
  if (request.status !== "Completed") {
    return res.status(400).json({
      success: false,
      message: "Certificate is only available for items in 'Completed' recycling status."
    });
  }

  const certNumber = `CERT-${request.id}-${new Date(request.updatedAt).getFullYear()}`;
  const co2Saved = ((request.weightKg || 1) * 1.44).toFixed(1);

  res.json({
    success: true,
    data: {
      certificateNumber: certNumber,
      recipientName: request.userName || "Rahul Sharma",
      deviceModel: request.brandModel,
      category: request.category,
      quantity: request.quantity,
      weightKg: request.weightKg,
      completionDate: new Date(request.updatedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      facilityName: "GreenTech Eco-Recyclers (R2 & CPCB Authorized Unit #4B)",
      co2SavedKg: co2Saved,
      landfillDiverted: "100%",
      verificationHash: `SHA256: ${Math.random().toString(36).substring(2, 15).toUpperCase()}`
    }
  });
});

// 8. GET: Stream Audit CSV
app.get('/api/export/csv', (req, res) => {
  const list = readData();
  const headers = [
    "Request ID",
    "Citizen Name",
    "Contact",
    "Category",
    "Brand/Model",
    "Quantity",
    "Weight (kg)",
    "Condition",
    "Pickup Address",
    "Status",
    "Scheduled Date",
    "Collector Notes",
    "Logged Date",
    "Last Updated"
  ];

  const rows = list.map(r => [
    `"${r.id}"`,
    `"${r.userName || ''}"`,
    `"${r.userContact || ''}"`,
    `"${r.category || ''}"`,
    `"${(r.brandModel || '').replace(/"/g, '""')}"`,
    r.quantity || 1,
    r.weightKg || 1.0,
    `"${(r.condition || '').replace(/"/g, '""')}"`,
    `"${(r.pickupAddress || '').replace(/"/g, '""')}"`,
    `"${r.status}"`,
    `"${(r.scheduledDate || '').replace(/"/g, '""')}"`,
    `"${(r.collectorNotes || '').replace(/"/g, '""')}"`,
    `"${new Date(r.createdAt).toISOString()}"`,
    `"${new Date(r.updatedAt).toISOString()}"`
  ]);

  const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="ewaste_audit_${new Date().toISOString().slice(0, 10)}.csv"`);
  res.send(csvContent);
});

// 9. POST: Reset Demonstration Data
app.post('/api/requests/reset', (req, res) => {
  writeData(INITIAL_REQUESTS);
  console.log("[Express Backend] Database reset to initial sample demonstration state.");
  res.json({ success: true, message: "Data reset successfully", data: INITIAL_REQUESTS });
});

// SPA Fallback for any client route (when dist exists)
if (fs.existsSync(DIST_DIR)) {
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });
}


// Start Server
app.listen(PORT, () => {

  console.log(`====================================================`);
  console.log(`🚀 E-Waste Collection Tracker - Node.js Backend Server`);
  console.log(`🌐 Server running at: http://localhost:${PORT}`);
  console.log(`📋 REST API Base:      http://localhost:${PORT}/api/requests`);
  console.log(`🩺 Health Endpoint:   http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});
