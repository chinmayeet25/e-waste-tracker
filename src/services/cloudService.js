// Cloud Service Client (Optimized for AWS and Local Deployment)
const API_BASE = (typeof window !== 'undefined' && window.location.port === '5173')
  ? 'http://localhost:5000/api'
  : '/api';

const STORAGE_KEYS = {
  REQUESTS: 'ewaste_cloud_requests_v1',
  USER: 'ewaste_authenticated_user_v2'
};

const INITIAL_SEED_REQUESTS = [
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

function getSimulatedRequests() {
  const raw = localStorage.getItem(STORAGE_KEYS.REQUESTS);
  if (!raw) {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(INITIAL_SEED_REQUESTS));
    return INITIAL_SEED_REQUESTS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_SEED_REQUESTS;
  }
}

function saveSimulatedRequests(reqs) {
  localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(reqs));
}

// -----------------------------------------------------------------
// PUBLIC CLOUD SERVICE API
// -----------------------------------------------------------------
export const cloudService = {
  isCloudConnected() {
    return true;
  },

  getCurrentUser() {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        return null;
      }
    }
    return null;
  },

  async login(email, password) {
    // 1. Try Express Backend on AWS / Localhost
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        signal: AbortSignal.timeout(2000)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          const userObj = {
            uid: data.user.id,
            displayName: data.user.name,
            email: data.user.email,
            role: data.user.role
          };
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userObj));
          return userObj;
        }
      } else {
        const errData = await res.json();
        throw new Error(errData.message || "Invalid credentials");
      }
    } catch (err) {
      if (err.message && err.message !== "Failed to fetch" && !err.message.includes("timeout")) {
        throw err;
      }
    }

    // 2. Offline / Simulation fallback
    const trimmedEmail = email.toLowerCase().trim();
    let role = "citizen";
    let name = email.split('@')[0];
    name = name.charAt(0).toUpperCase() + name.slice(1);

    if (trimmedEmail.includes("admin")) {
      if (password !== "admin123") {
        throw new Error("Invalid password for Admin. Demo password is: admin123");
      }
      role = "admin";
      name = "Admin Officer (Facility Chief)";
    } else {
      if (password !== "user123" && password.length < 4) {
        throw new Error("Password must be at least 4 characters.");
      }
    }

    const userObj = {
      uid: role === "admin" ? "usr-admin-0" : `usr-${Date.now()}`,
      displayName: name,
      email: email,
      role: role
    };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userObj));
    return userObj;
  },

  async signup(name, email, password, role = "citizen", adminCode = "") {
    if (role === "admin" && adminCode !== "ADMIN2026") {
      throw new Error("Invalid Administrator Authorization Passcode. Enter 'ADMIN2026'.");
    }

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role, adminCode }),
        signal: AbortSignal.timeout(2000)
      });
      if (res.ok) {
        const data = await res.json();
        const userObj = {
          uid: data.user.id,
          displayName: data.user.name,
          email: data.user.email,
          role: data.user.role
        };
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userObj));
        return userObj;
      } else {
        const errData = await res.json();
        throw new Error(errData.message || "Registration failed");
      }
    } catch (err) {
      if (err.message && err.message !== "Failed to fetch" && !err.message.includes("timeout")) {
        throw err;
      }
    }

    const userObj = {
      uid: role === "admin" ? `adm-${Date.now()}` : `usr-${Date.now()}`,
      displayName: name.trim(),
      email: email.trim(),
      role: role
    };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userObj));
    return userObj;
  },

  async logout() {
    localStorage.removeItem(STORAGE_KEYS.USER);
    return null;
  },

  async switchRole(newRole) {
    let user = this.getCurrentUser();
    if (!user) {
      user = {
        uid: newRole === 'admin' ? "usr-admin-0" : "demo-user-1",
        displayName: newRole === 'admin' ? "Admin Officer (Facility Chief)" : "Rahul Sharma",
        email: newRole === 'admin' ? "admin@ewaste.gov" : "rahul@ewaste.in",
        role: newRole
      };
    } else {
      user.role = newRole;
      if (newRole === 'admin') {
        user.displayName = user.displayName?.includes("Admin") ? user.displayName : "Admin Officer (Facility Chief)";
        user.email = user.email?.includes("admin") ? user.email : "admin@ewaste.gov";
        user.uid = "usr-admin-0";
      } else {
        user.displayName = user.displayName?.includes("Admin") ? "Rahul Sharma" : user.displayName;
        user.email = user.email?.includes("admin") ? "rahul@ewaste.in" : user.email;
        user.uid = "demo-user-1";
      }
    }
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    return user;
  },

  async uploadPhoto(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  },

  async createRequest(formData, imageFile) {
    let photoUrl = "";
    if (imageFile) {
      photoUrl = await this.uploadPhoto(imageFile);
    } else {
      photoUrl = "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600&auto=format&fit=crop&q=80";
    }

    const user = this.getCurrentUser() || { uid: `usr-${Date.now()}`, displayName: formData.userName || "Citizen Donor" };
    const newId = `EW-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date().toISOString();

    const requestItem = {
      id: newId,
      userId: user.uid,
      userName: formData.userName || user.displayName || "Citizen Donor",
      userContact: formData.userContact,
      category: formData.category,
      brandModel: formData.brandModel,
      quantity: Number(formData.quantity) || 1,
      weightKg: Number(formData.weightKg) || 1.0,
      condition: formData.condition,
      pickupAddress: formData.pickupAddress,
      photoUrl: photoUrl,
      status: "Pending",
      scheduledDate: "",
      collectorNotes: "",
      statusHistory: [
        { status: "Pending", timestamp: now }
      ],
      createdAt: now,
      updatedAt: now
    };

    try {
      await fetch(`${API_BASE}/requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestItem),
        signal: AbortSignal.timeout(2000)
      });
    } catch {
      // Backend offline, fallback to local storage
    }

    const currentList = getSimulatedRequests();
    currentList.unshift(requestItem);
    saveSimulatedRequests(currentList);

    return requestItem;
  },

  async getRequests(filterUserId = null) {
    try {
      const url = filterUserId 
        ? `${API_BASE}/requests?userId=${filterUserId}` 
        : `${API_BASE}/requests`;
      const res = await fetch(url, { signal: AbortSignal.timeout(1500) });
      if (res.ok) {
        const json = await res.json();
        if (json.data) return json.data;
      }
    } catch {
      // Fallback to local storage
    }

    let list = getSimulatedRequests();
    if (filterUserId) {
      list = list.filter((r) => r.userId === filterUserId);
    }
    return list;
  },

  async updateStatus(requestId, newStatus, notes = "", scheduledDate = "") {
    try {
      await fetch(`${API_BASE}/requests/${requestId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, collectorNotes: notes, scheduledDate }),
        signal: AbortSignal.timeout(2000)
      });
    } catch {
      // Fallback
    }

    const list = getSimulatedRequests();
    const target = list.find((r) => r.id === requestId);
    if (!target) throw new Error("Request not found");

    const now = new Date().toISOString();
    target.status = newStatus;
    target.updatedAt = now;
    if (notes) target.collectorNotes = notes;
    if (scheduledDate) target.scheduledDate = scheduledDate;

    target.statusHistory.push({
      status: newStatus,
      timestamp: now,
      notes: notes || undefined
    });

    saveSimulatedRequests(list);
    return target;
  },

  async getAnalytics() {
    try {
      const res = await fetch(`${API_BASE}/analytics`, { signal: AbortSignal.timeout(1500) });
      if (res.ok) {
        const json = await res.json();
        if (json.data) return json.data;
      }
    } catch {
      // Fallback
    }

    const list = getSimulatedRequests();
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

    return {
      totalRequests,
      totalKg: totalKg.toFixed(1),
      completedCount,
      pendingCount,
      acceptedCount,
      collectedCount,
      categoryCounts,
      recyclingRate: totalRequests > 0 ? Math.round(((completedCount + collectedCount) / totalRequests) * 100) : 0
    };
  },

  async getUserEcoStats(userId) {
    const list = getSimulatedRequests().filter(r => r.userId === userId && r.status === "Completed");
    const totalRecycledKg = list.reduce((acc, r) => acc + (r.weightKg || 0), 0);
    const points = (list.length * 50) + Math.round(totalRecycledKg * 25);
    
    let tier = "Eco Scout";
    if (points >= 500) tier = "Planet Guardian";
    else if (points >= 250) tier = "Green Champion";
    else if (points >= 100) tier = "Eco Warrior";

    return {
      points,
      tier,
      completedItemsCount: list.length,
      co2OffsetKg: (totalRecycledKg * 1.44).toFixed(1),
      toxicLeadPreventedGrams: (totalRecycledKg * 12).toFixed(0)
    };
  },

  getCertificate(request) {
    if (request.status !== "Completed") return null;
    const certNumber = `CERT-${request.id}-${new Date(request.updatedAt).getFullYear()}`;
    const co2Saved = ((request.weightKg || 1) * 1.44).toFixed(1);
    
    return {
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
      facilityName: "GreenTech Eco-Recyclers (AWS Cloud Operations Unit #4B)",
      co2SavedKg: co2Saved,
      landfillDiverted: "100%",
      verificationHash: `SHA256: ${Math.random().toString(36).substring(2, 15).toUpperCase()}`
    };
  },

  exportToCSV(requests) {
    const headers = [
      "Request ID", "Citizen Name", "Contact", "Category", "Brand/Model",
      "Quantity", "Weight (kg)", "Condition", "Pickup Address", "Status",
      "Scheduled Date", "Collector Notes", "Logged Date", "Last Updated"
    ];

    const rows = requests.map(r => [
      `"${r.id}"`, `"${r.userName || ''}"`, `"${r.userContact || ''}"`,
      `"${r.category || ''}"`, `"${(r.brandModel || '').replace(/"/g, '""')}"`,
      r.quantity || 1, r.weightKg || 1.0, `"${(r.condition || '').replace(/"/g, '""')}"`,
      `"${(r.pickupAddress || '').replace(/"/g, '""')}"`, `"${r.status}"`,
      `"${(r.scheduledDate || '').replace(/"/g, '""')}"`, `"${(r.collectorNotes || '').replace(/"/g, '""')}"`,
      `"${new Date(r.createdAt).toISOString()}"`, `"${new Date(r.updatedAt).toISOString()}"`
    ]);

    return [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
  },

  async getNotifications(userId = null) {
    try {
      const url = userId ? `${API_BASE}/notifications?userId=${userId}` : `${API_BASE}/notifications`;
      const res = await fetch(url, { signal: AbortSignal.timeout(1500) });
      if (res.ok) {
        const json = await res.json();
        if (json.data) return json.data;
      }
    } catch {
      // Fallback
    }

    // Default simulated notifications if offline
    return [
      {
        id: "notif-1",
        userId: "demo-user-1",
        requestId: "EW-90214",
        title: "Pickup Scheduled & Assigned",
        message: "Collector Suresh scheduled pickup for Tomorrow at 11:00 AM.",
        channel: "Amazon SNS (SMS to +91 98765 43210)",
        status: "Accepted",
        isRead: false,
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
      },
      {
        id: "notif-2",
        userId: "demo-user-1",
        requestId: "EW-90215",
        title: "E-Waste Safely Recycled & Certified",
        message: "Redmi Note 7 Pro safely recycled. Green Certificate CERT-EW-90215-2026 emailed.",
        channel: "Amazon SES (Email to rahul@ewaste.in)",
        status: "Completed",
        isRead: true,
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ];
  },

  async markNotificationsRead() {
    try {
      await fetch(`${API_BASE}/notifications/read`, { method: "PUT" });
    } catch {
      // Fallback
    }
    return true;
  },

  resetDemoData() {
    fetch(`${API_BASE}/requests/reset`, { method: 'POST' }).catch(() => {});
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(INITIAL_SEED_REQUESTS));
    return INITIAL_SEED_REQUESTS;
  }
};

