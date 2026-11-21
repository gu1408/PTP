import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'civiclens_db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const OFFICIAL_DEPARTMENTS = [
  { id: 'dept_roads', name: 'Road Maintenance Department', category: 'Roads' },
  { id: 'dept_waste', name: 'Solid Waste Management Department', category: 'Waste' },
  { id: 'dept_water', name: 'Water Supply Department', category: 'Water' },
  { id: 'dept_elec', name: 'Electrical Department', category: 'Electricity' },
  { id: 'dept_trees', name: 'Parks and Horticulture Department', category: 'Trees' },
  { id: 'dept_drain', name: 'Stormwater Drainage Department', category: 'Drainage' }
];

const INITIAL_SEED_TICKETS = [
  {
    complaintId: "CMP-8801",
    originalText: "There is an exposed live electric wire hanging near the primary school gate on 4th cross. Sparks were seen this morning when it rained.",
    language: "English",
    location: "4th Cross, Near St. Joseph School",
    ward: "Ward 12 - Malleshwaram",
    category: "Electricity",
    severity: "CRITICAL",
    reason: "Exposed live electrical conductor poses immediate electrocution hazard adjacent to a school zone.",
    department: "Electrical Department",
    priorityScore: 98,
    status: "Pending",
    aiConfidence: 0.98,
    manualReviewRequired: false,
    photoUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80",
    summary: "Exposed live wire with sparking near primary school gate",
    submittedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString()
  },
  {
    complaintId: "CMP-8802",
    originalText: "Large dangerous pothole right in the middle of 100 Feet Road. Two two-wheelers skidded and fell yesterday night.",
    language: "English",
    location: "100 Feet Road, Near Metro Pillar 42",
    ward: "Ward 08 - Indiranagar",
    category: "Roads",
    severity: "HIGH",
    reason: "Deep arterial pothole has already caused multiple vehicular skidding incidents.",
    department: "Road Maintenance Department",
    priorityScore: 78,
    status: "In Progress",
    aiConfidence: 0.95,
    manualReviewRequired: false,
    photoUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80",
    summary: "Severe road crater causing commuter accidents on 100ft road",
    submittedAt: new Date(Date.now() - 1000 * 60 * 320).toISOString()
  },
  {
    complaintId: "CMP-8803",
    originalText: "ಕಳೆದ ಮೂರು ದಿನಗಳಿಂದ ತರಕಾರಿ ಮಾರುಕಟ್ಟೆಯ ಬಳಿ ಕಸದ ರಾಶಿ ಬಿದ್ದಿದೆ ಮತ್ತು ದುರ್ವಾಸನೆ ಬೀರುತ್ತಿದೆ. ನೊಣಗಳ ಕಾಟ ಹೆಚ್ಚಾಗಿದೆ.",
    language: "Kannada",
    location: "Gandhi Bazaar Market Road",
    ward: "Ward 04 - Basavanagudi",
    category: "Waste",
    severity: "MEDIUM",
    reason: "Accumulated uncollected organic municipal waste near high-traffic produce market creating sanitation issue.",
    department: "Solid Waste Management Department",
    priorityScore: 54,
    status: "Pending",
    aiConfidence: 0.93,
    manualReviewRequired: false,
    photoUrl: "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=600&q=80",
    summary: "[Translated: Garbage heap decaying near vegetable market for 3 days]",
    submittedAt: new Date(Date.now() - 1000 * 60 * 420).toISOString()
  },
  {
    complaintId: "CMP-8804",
    originalText: "Main drinking water pipeline has ruptured on 7th Main. Potable water is flooding the street for the past 6 hours.",
    language: "English",
    location: "7th Main, 3rd Block",
    ward: "Ward 15 - Koramangala",
    category: "Water",
    severity: "HIGH",
    reason: "Ruptured primary municipal supply pipeline causing massive potable water loss and street waterlogging.",
    department: "Water Supply Department",
    priorityScore: 74,
    status: "Pending",
    aiConfidence: 0.96,
    manualReviewRequired: false,
    photoUrl: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=600&q=80",
    summary: "Major drinking water pipeline breach flooding street",
    submittedAt: new Date(Date.now() - 1000 * 60 * 540).toISOString()
  },
  {
    complaintId: "CMP-8805",
    originalText: "Heavy storm brought down a massive gulmohar tree branch completely blocking vehicle movement towards the government hospital.",
    language: "English",
    location: "Hospital Road, Opposite Bus Stop",
    ward: "Ward 02 - Jayanagar",
    category: "Trees",
    severity: "HIGH",
    reason: "Fallen tree completely obstructs emergency vehicle access route to hospital.",
    department: "Parks and Horticulture Department",
    priorityScore: 79,
    status: "In Progress",
    aiConfidence: 0.97,
    manualReviewRequired: false,
    photoUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80",
    summary: "Large tree fallen across hospital approach road",
    submittedAt: new Date(Date.now() - 1000 * 60 * 680).toISOString()
  },
  {
    complaintId: "CMP-8806",
    originalText: "Stormwater drain is completely choked with plastic and silt. Rainwater entered 3 basement garages.",
    language: "English",
    location: "Silver Springs Layout, 2nd Cross",
    ward: "Ward 20 - Whitefield",
    category: "Drainage",
    severity: "HIGH",
    reason: "Blocked stormwater channel caused localized flash inundation into residential property basements.",
    department: "Stormwater Drainage Department",
    priorityScore: 76,
    status: "Pending",
    aiConfidence: 0.95,
    manualReviewRequired: false,
    photoUrl: "https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&w=600&q=80",
    summary: "Choked stormwater drain causing basement flooding in apartment layout",
    submittedAt: new Date(Date.now() - 1000 * 60 * 820).toISOString()
  },
  {
    complaintId: "CMP-8807",
    originalText: "Single LED street light blinking intermittently outside house #45. Night visibility is slightly reduced.",
    language: "English",
    location: "5th A Main, BTM 2nd Stage",
    ward: "Ward 18 - BTM Layout",
    category: "Electricity",
    severity: "LOW",
    reason: "Flickering localized residential street fixture with minimal public safety impact.",
    department: "Electrical Department",
    priorityScore: 28,
    status: "Resolved",
    aiConfidence: 0.92,
    manualReviewRequired: false,
    photoUrl: null,
    summary: "Intermittent LED streetlight blinking on residential lane",
    submittedAt: new Date(Date.now() - 1000 * 60 * 1440).toISOString()
  }
];

class CivicDB {
  constructor() {
    this.data = {
      complaints: [],
      tickets: [],
      departments: OFFICIAL_DEPARTMENTS,
      duplicateGroups: [],
      activityLogs: []
    };
    this.init();
  }

  init() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        // Ensure all arrays exist
        if (!this.data.complaints) this.data.complaints = [];
        if (!this.data.tickets) this.data.tickets = [];
        if (!this.data.departments || this.data.departments.length === 0) {
          this.data.departments = OFFICIAL_DEPARTMENTS;
        }
        if (!this.data.duplicateGroups) this.data.duplicateGroups = [];
        if (!this.data.activityLogs) this.data.activityLogs = [];
      } else {
        this.seed();
      }
    } catch (err) {
      console.error('Error loading database, resetting with seeds:', err);
      this.seed();
    }
  }

  save() {
    try {
      const tempFile = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempFile, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tempFile, DB_FILE);
    } catch (err) {
      console.error('Failed to save DB:', err);
    }
  }

  seed() {
    this.data = {
      complaints: [],
      tickets: [],
      departments: OFFICIAL_DEPARTMENTS,
      duplicateGroups: [],
      activityLogs: []
    };

    INITIAL_SEED_TICKETS.forEach((seed, index) => {
      const ticketId = `TKT-${1000 + index + 1}`;
      const complaint = {
        id: seed.complaintId,
        originalText: seed.originalText,
        language: seed.language,
        photoUrl: seed.photoUrl || null,
        location: seed.location,
        ward: seed.ward,
        submittedAt: seed.submittedAt
      };

      const ticket = {
        id: ticketId,
        complaintId: seed.complaintId,
        category: seed.category,
        severity: seed.severity,
        reason: seed.reason,
        department: seed.department,
        priorityScore: seed.priorityScore,
        status: seed.status,
        aiConfidence: seed.aiConfidence,
        manualReviewRequired: seed.manualReviewRequired || false,
        summary: seed.summary,
        createdAt: seed.submittedAt,
        updatedAt: seed.submittedAt,
        officerNotes: seed.status === 'Resolved' ? 'Verified by lineman and fixture replaced.' : '',
        duplicateGroupId: null
      };

      const log = {
        id: `LOG-${Date.now()}-${index}`,
        ticketId: ticketId,
        action: 'CREATED',
        previousStatus: null,
        newStatus: seed.status,
        timestamp: seed.submittedAt,
        performedBy: 'CivicLens AI System',
        details: 'Automated triage and department dispatch completed.'
      };

      this.data.complaints.push(complaint);
      this.data.tickets.push(ticket);
      this.data.activityLogs.push(log);
    });

    this.save();
    console.log(`[CivicLens DB] Seeded ${this.data.tickets.length} initial tickets successfully.`);
  }

  // Get full list of tickets joined with complaints
  getAllTickets({ search, category, severity, department, ward, status, sortBy = 'priority' } = {}) {
    let result = this.data.tickets.map(ticket => {
      const complaint = this.data.complaints.find(c => c.id === ticket.complaintId) || {};
      return {
        ...ticket,
        complaint: {
          originalText: complaint.originalText || '',
          language: complaint.language || 'English',
          location: complaint.location || '',
          ward: complaint.ward || '',
          photoUrl: complaint.photoUrl || null,
          submittedAt: complaint.submittedAt || ticket.createdAt
        }
      };
    });

    // Filtering
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(t =>
        t.id.toLowerCase().includes(q) ||
        t.complaintId.toLowerCase().includes(q) ||
        t.summary.toLowerCase().includes(q) ||
        t.complaint.originalText.toLowerCase().includes(q) ||
        t.complaint.location.toLowerCase().includes(q) ||
        t.complaint.ward.toLowerCase().includes(q) ||
        t.department.toLowerCase().includes(q)
      );
    }

    if (category && category !== 'ALL') {
      result = result.filter(t => t.category.toLowerCase() === category.toLowerCase());
    }

    if (severity && severity !== 'ALL') {
      result = result.filter(t => t.severity.toUpperCase() === severity.toUpperCase());
    }

    if (department && department !== 'ALL') {
      result = result.filter(t => t.department.toLowerCase() === department.toLowerCase());
    }

    if (ward && ward !== 'ALL') {
      result = result.filter(t => t.complaint.ward.toLowerCase() === ward.toLowerCase());
    }

    if (status && status !== 'ALL') {
      result = result.filter(t => t.status.toLowerCase() === status.toLowerCase());
    }

    // Default Priority Ordering:
    // CRITICAL (4) -> HIGH (3) -> MEDIUM (2) -> LOW (1)
    // Within each severity level, oldest unresolved complaint first (earliest createdAt)
    const severityWeight = {
      'CRITICAL': 4,
      'HIGH': 3,
      'MEDIUM': 2,
      'LOW': 1
    };

    result.sort((a, b) => {
      const weightA = severityWeight[a.severity] || 0;
      const weightB = severityWeight[b.severity] || 0;

      if (weightA !== weightB) {
        return weightB - weightA; // higher severity first
      }

      // If severities are equal:
      // If unresolved, oldest first (ascending createdAt timestamp)
      const isUnresolvedA = a.status !== 'Resolved';
      const isUnresolvedB = b.status !== 'Resolved';

      if (isUnresolvedA && !isUnresolvedB) return -1;
      if (!isUnresolvedA && isUnresolvedB) return 1;

      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

    return result;
  }

  getTicketById(ticketId) {
    const normalizedId = (ticketId || '').trim().toUpperCase();
    const ticket = this.data.tickets.find(t =>
      t.id.toUpperCase() === normalizedId ||
      t.complaintId.toUpperCase() === normalizedId
    );
    if (!ticket) return null;

    const complaint = this.data.complaints.find(c => c.id === ticket.complaintId) || {};
    const logs = this.data.activityLogs
      .filter(l => l.ticketId === ticket.id)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    let duplicateGroup = null;
    if (ticket.duplicateGroupId) {
      duplicateGroup = this.data.duplicateGroups.find(g => g.id === ticket.duplicateGroupId);
    }

    return {
      ...ticket,
      complaint,
      activityLogs: logs,
      duplicateGroup
    };
  }

  createComplaintAndTicket({
    originalText,
    language,
    photoUrl,
    location,
    ward,
    aiResult,
    duplicateInfo = null
  }) {
    const timestamp = new Date().toISOString();
    const complaintCount = this.data.complaints.length + 1;
    const complaintId = `CMP-${8800 + complaintCount}`;
    const ticketId = `TKT-${1000 + this.data.tickets.length + 1}`;

    const complaint = {
      id: complaintId,
      originalText: originalText.trim(),
      language: aiResult.detected_language || language || 'English',
      photoUrl: photoUrl || null,
      location: location || 'Location specified by citizen',
      ward: ward || 'Ward 01 - General',
      submittedAt: timestamp
    };

    let duplicateGroupId = null;
    if (duplicateInfo && duplicateInfo.isDuplicate && duplicateInfo.matchedTicketId) {
      // Find or create duplicate group
      let group = this.data.duplicateGroups.find(g =>
        g.primaryTicketId === duplicateInfo.matchedTicketId ||
        g.relatedTicketIds.includes(duplicateInfo.matchedTicketId)
      );

      if (!group) {
        group = {
          id: `DUP-${Date.now()}`,
          primaryTicketId: duplicateInfo.matchedTicketId,
          relatedTicketIds: [ticketId],
          similarityScore: duplicateInfo.similarityScore,
          detectedReason: duplicateInfo.reason,
          createdAt: timestamp
        };
        this.data.duplicateGroups.push(group);
      } else {
        if (!group.relatedTicketIds.includes(ticketId)) {
          group.relatedTicketIds.push(ticketId);
        }
      }
      duplicateGroupId = group.id;
    }

    const ticket = {
      id: ticketId,
      complaintId: complaintId,
      category: aiResult.category,
      severity: aiResult.severity,
      reason: aiResult.reason,
      department: aiResult.department,
      priorityScore: aiResult.priority_score || 50,
      status: 'Pending',
      aiConfidence: aiResult.confidence || 0.9,
      manualReviewRequired: aiResult.manual_review_required || (aiResult.confidence < 0.75),
      summary: aiResult.summary || originalText.slice(0, 80),
      createdAt: timestamp,
      updatedAt: timestamp,
      officerNotes: '',
      duplicateGroupId: duplicateGroupId
    };

    const log = {
      id: `LOG-${Date.now()}`,
      ticketId: ticketId,
      action: 'SUBMITTED',
      previousStatus: null,
      newStatus: 'Pending',
      timestamp: timestamp,
      performedBy: 'Citizen',
      details: `Citizen submitted complaint via portal. AI assigned ${ticket.category} with ${ticket.severity} severity.`
    };

    this.data.complaints.unshift(complaint);
    this.data.tickets.unshift(ticket);
    this.data.activityLogs.unshift(log);

    this.save();

    return {
      complaint,
      ticket,
      duplicateInfo
    };
  }

  updateTicket(ticketId, { status, department, severity, officerNotes, performedBy = 'Municipal Officer' }) {
    const ticket = this.data.tickets.find(t => t.id === ticketId);
    if (!ticket) return null;

    const previousStatus = ticket.status;
    const actionsTaken = [];

    if (status && status !== ticket.status) {
      ticket.status = status;
      actionsTaken.push(`Status changed to ${status}`);
    }

    if (department && department !== ticket.department) {
      actionsTaken.push(`Department re-routed: ${ticket.department} → ${department}`);
      ticket.department = department;
    }

    if (severity && severity !== ticket.severity) {
      actionsTaken.push(`Severity adjusted: ${ticket.severity} → ${severity}`);
      ticket.severity = severity;
    }

    if (officerNotes !== undefined) {
      ticket.officerNotes = officerNotes;
    }

    ticket.updatedAt = new Date().toISOString();

    if (actionsTaken.length > 0 || officerNotes) {
      const log = {
        id: `LOG-${Date.now()}`,
        ticketId: ticketId,
        action: 'UPDATED',
        previousStatus: previousStatus,
        newStatus: ticket.status,
        timestamp: ticket.updatedAt,
        performedBy: performedBy,
        details: actionsTaken.join('; ') + (officerNotes ? ` (Notes: ${officerNotes})` : '')
      };
      this.data.activityLogs.unshift(log);
    }

    this.save();
    return this.getTicketById(ticketId);
  }

  getAnalytics() {
    const tickets = this.data.tickets;
    const complaints = this.data.complaints;

    const total = tickets.length;
    const critical = tickets.filter(t => t.severity === 'CRITICAL').length;
    const high = tickets.filter(t => t.severity === 'HIGH').length;
    const medium = tickets.filter(t => t.severity === 'MEDIUM').length;
    const low = tickets.filter(t => t.severity === 'LOW').length;

    const pending = tickets.filter(t => t.status === 'Pending').length;
    const inProgress = tickets.filter(t => t.status === 'In Progress').length;
    const resolved = tickets.filter(t => t.status === 'Resolved').length;

    // Category breakdown
    const categoryMap = {};
    tickets.forEach(t => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + 1;
    });

    const categories = Object.keys(categoryMap).map(cat => ({
      name: cat,
      count: categoryMap[cat]
    }));

    // Ward breakdown
    const wardMap = {};
    tickets.forEach(t => {
      const complaint = complaints.find(c => c.id === t.complaintId);
      const ward = complaint ? complaint.ward : 'Unknown Ward';
      if (!wardMap[ward]) {
        wardMap[ward] = { total: 0, critical: 0, high: 0, pending: 0 };
      }
      wardMap[ward].total += 1;
      if (t.severity === 'CRITICAL') wardMap[ward].critical += 1;
      if (t.severity === 'HIGH') wardMap[ward].high += 1;
      if (t.status === 'Pending') wardMap[ward].pending += 1;
    });

    const wardStats = Object.keys(wardMap).map(w => ({
      ward: w,
      ...wardMap[w]
    })).sort((a, b) => b.total - a.total);

    // Department breakdown
    const deptMap = {};
    tickets.forEach(t => {
      deptMap[t.department] = (deptMap[t.department] || 0) + 1;
    });
    const departments = Object.keys(deptMap).map(d => ({
      name: d,
      count: deptMap[d]
    }));

    return {
      metrics: {
        total,
        critical,
        high,
        medium,
        low,
        pending,
        inProgress,
        resolved,
        resolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 0,
        duplicateCount: this.data.duplicateGroups.length
      },
      categoryDistribution: categories,
      wardAnalytics: wardStats,
      departmentDistribution: departments,
      duplicateGroups: this.data.duplicateGroups
    };
  }

  getDuplicateGroups() {
    return this.data.duplicateGroups.map(group => {
      const primaryTicket = this.getTicketById(group.primaryTicketId);
      const relatedTickets = group.relatedTicketIds.map(id => this.getTicketById(id)).filter(Boolean);
      return {
        ...group,
        primaryTicket,
        relatedTickets
      };
    });
  }
}

export const db = new CivicDB();
