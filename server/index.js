import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './db.js';
import { processComplaintWithAI, classifyLocally } from './aiService.js';
import { detectDuplicate } from './duplicateService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '20mb' })); // Support base64 image uploads

// Serve static frontend build if present
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDist = path.join(__dirname, '../client/dist');
app.use(express.static(clientDist));


// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[API] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'CivicLens AI Triage Engine',
    timestamp: new Date().toISOString(),
    geminiKeyConfigured: !!process.env.GEMINI_API_KEY
  });
});

// GET /api/tickets - Priority sorted tickets with filters
app.get('/api/tickets', (req, res) => {
  try {
    const { search, category, severity, department, ward, status, sortBy } = req.query;
    const tickets = db.getAllTickets({ search, category, severity, department, ward, status, sortBy });
    res.json({
      success: true,
      count: tickets.length,
      tickets
    });
  } catch (err) {
    console.error('Error fetching tickets:', err);
    res.status(500).json({ success: false, error: 'Failed to retrieve tickets.' });
  }
});

// GET /api/tickets/:id - Single ticket details with audit log
app.get('/api/tickets/:id', (req, res) => {
  try {
    const ticket = db.getTicketById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, error: 'Ticket not found.' });
    }
    res.json({ success: true, ticket });
  } catch (err) {
    console.error('Error fetching ticket:', err);
    res.status(500).json({ success: false, error: 'Failed to retrieve ticket details.' });
  }
});

// POST /api/ai/preview - Instant AI analysis preview without saving
app.post('/api/ai/preview', async (req, res) => {
  try {
    const { text, location = '', apiKey } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, error: 'Complaint text is required.' });
    }
    const aiResult = await processComplaintWithAI(text.trim(), null, location, apiKey);
    res.json({ success: true, aiResult });
  } catch (err) {
    console.error('AI preview error:', err);
    res.status(500).json({ success: false, error: 'AI preview analysis failed.' });
  }
});

// POST /api/complaints - Citizen submits complaint
app.post('/api/complaints', async (req, res) => {
  try {
    const { originalText, language, photoUrl, location, ward, apiKey } = req.body;

    if (!originalText || !originalText.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Complaint description cannot be empty.'
      });
    }

    if (originalText.trim().length < 5) {
      return res.status(400).json({
        success: false,
        error: 'Complaint description is too short. Please provide meaningful details.'
      });
    }

    // 1. Run AI analysis
    const aiResult = await processComplaintWithAI(
      originalText.trim(),
      photoUrl,
      location || '',
      apiKey
    );

    // 2. Check for duplicate complaints among active tickets
    const existingTickets = db.getAllTickets();
    const duplicateInfo = detectDuplicate(
      originalText.trim(),
      ward,
      location || '',
      existingTickets
    );

    // 3. Save to database
    const result = db.createComplaintAndTicket({
      originalText,
      language,
      photoUrl,
      location,
      ward,
      aiResult,
      duplicateInfo
    });

    res.status(201).json({
      success: true,
      message: 'Complaint submitted and triaged successfully.',
      ...result
    });
  } catch (err) {
    console.error('Error processing complaint submission:', err);
    res.status(500).json({
      success: false,
      error: 'Internal server error while processing complaint.'
    });
  }
});

// PATCH /api/tickets/:id - Officer status / department / severity update
app.patch('/api/tickets/:id', (req, res) => {
  try {
    const { status, department, severity, officerNotes, performedBy } = req.body;
    const updated = db.updateTicket(req.params.id, {
      status,
      department,
      severity,
      officerNotes,
      performedBy
    });

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Ticket not found.' });
    }

    res.json({
      success: true,
      message: 'Ticket updated successfully.',
      ticket: updated
    });
  } catch (err) {
    console.error('Error updating ticket:', err);
    res.status(500).json({ success: false, error: 'Failed to update ticket.' });
  }
});

// GET /api/analytics - High-level metrics, charts, ward distribution
app.get('/api/analytics', (req, res) => {
  try {
    const analytics = db.getAnalytics();
    res.json({ success: true, analytics });
  } catch (err) {
    console.error('Error getting analytics:', err);
    res.status(500).json({ success: false, error: 'Failed to retrieve analytics.' });
  }
});

// GET /api/duplicate-groups - View all duplicate clusters
app.get('/api/duplicate-groups', (req, res) => {
  try {
    const groups = db.getDuplicateGroups();
    res.json({ success: true, duplicateGroups: groups });
  } catch (err) {
    console.error('Error getting duplicate groups:', err);
    res.status(500).json({ success: false, error: 'Failed to retrieve duplicate groups.' });
  }
});

// POST /api/seed/reset - Reset to factory demo data
app.post('/api/seed/reset', (req, res) => {
  try {
    db.seed();
    res.json({ success: true, message: 'Database reset to default seed state.' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to reset seed data.' });
  }
});

// Fallback for SPA
app.get('*', (req, res) => {
  const indexPath = path.join(clientDist, 'index.html');
  res.sendFile(indexPath);
});

app.listen(PORT, () => {
  console.log(`[CivicLens Backend] Server running on port ${PORT}`);
  console.log(`[CivicLens Backend] AI Engine initialized. Ready for triage.`);
});
