const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.log('Database connection failed:', err.message);
  } else {
    console.log('Connected to MySQL database!');
  }
});

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Gym App Backend is running!' });
});

// ─── DASHBOARD ROUTES ──────────────────────────────────────

// Get detailed records for dashboard cards: total, present, absent, unpaid, alerts
app.get('/api/dashboard/details', (req, res) => {
  const { type } = req.query;

  let query = '';
  const params = [];

  switch (type) {
    case 'total':
      query = `
        SELECT m.id, m.name, m.phone, m.email, m.plan_type, m.join_date
        FROM members m
        ORDER BY m.name ASC
      `;
      break;

    case 'present':
      query = `
        SELECT m.id, m.name, m.phone, m.email, m.plan_type, a.status AS attendance_status
        FROM members m
        JOIN attendance a ON m.id = a.member_id AND a.date = CURDATE()
        WHERE a.status = 'present'
        ORDER BY m.name ASC
      `;
      break;

    case 'absent':
      query = `
        SELECT m.id, m.name, m.phone, m.email, m.plan_type,
               CASE 
                 WHEN a.status = 'absent' THEN 'marked absent'
                 ELSE 'not marked'
               END AS attendance_status
        FROM members m
        LEFT JOIN attendance a ON m.id = a.member_id AND a.date = CURDATE()
        WHERE a.status IS NULL OR a.status != 'present'
        ORDER BY m.name ASC
      `;
      break;

    case 'unpaid':
      query = `
        SELECT f.id AS fee_id, m.id AS member_id, m.name, m.phone, m.plan_type, f.amount, f.due_date,
               CASE WHEN f.due_date < CURDATE() THEN 1 ELSE 0 END AS is_overdue
        FROM fees f
        JOIN members m ON f.member_id = m.id
        WHERE f.status = 'unpaid'
        ORDER BY f.due_date ASC, m.name ASC
      `;
      break;

    case 'alerts':
      query = `
        SELECT f.id AS fee_id, m.id AS member_id, m.name, m.phone, m.plan_type, f.amount, f.due_date,
               CASE WHEN f.due_date < CURDATE() THEN 1 ELSE 0 END AS is_overdue
        FROM fees f
        JOIN members m ON f.member_id = m.id
        WHERE f.status = 'unpaid'
          AND f.due_date <= DATE_ADD(CURDATE(), INTERVAL 3 DAY)
        ORDER BY f.due_date ASC, m.name ASC
      `;
      break;

    default:
      return res.status(400).json({ error: 'Invalid type parameter. Expected total, present, absent, unpaid, or alerts.' });
  }

  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ─── MEMBERS ROUTES ───────────────────────────────────────

// Get all members
app.get('/api/members', (req, res) => {
  db.query('SELECT * FROM members', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Add new member
app.post('/api/members', (req, res) => {
  const { name, phone, email, plan_type } = req.body;
  const query = 'INSERT INTO members (name, phone, email, plan_type, join_date) VALUES (?, ?, ?, ?, CURDATE())';
  db.query(query, [name, phone, email, plan_type], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Member added!', id: result.insertId });
  });
});

// Update member
app.put('/api/members/:id', (req, res) => {
  const { name, phone, email, plan_type } = req.body;
  const query = 'UPDATE members SET name=?, phone=?, email=?, plan_type=? WHERE id=?';
  db.query(query, [name, phone, email, plan_type, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Member updated!' });
  });
});

// Delete member
app.delete('/api/members/:id', (req, res) => {
  db.query('DELETE FROM members WHERE id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Member deleted!' });
  });
});

// ─── ATTENDANCE ROUTES ────────────────────────────────────

// Get attendance by date
app.get('/api/attendance/:date', (req, res) => {
  const query = `
    SELECT m.id, m.name, a.status 
    FROM members m
    LEFT JOIN attendance a 
      ON m.id = a.member_id AND a.date = ?
    ORDER BY m.name
  `;
  db.query(query, [req.params.date], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Mark attendance
app.post('/api/attendance', (req, res) => {
  const { member_id, date, status } = req.body;
  const query = `
    INSERT INTO attendance (member_id, date, status)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE status = ?
  `;
  db.query(query, [member_id, date, status, status], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Attendance marked!' });
  });
});

// ─── FEES ROUTES ──────────────────────────────────────────

// Get overdue/upcoming fees (within 3 days)
app.get('/api/fees/overdue', (req, res) => {
  const query = `
    SELECT m.name, m.phone, f.amount, f.due_date, f.id as fee_id
    FROM fees f
    JOIN members m ON f.member_id = m.id
    WHERE f.status = 'unpaid'
      AND f.due_date <= DATE_ADD(CURDATE(), INTERVAL 3 DAY)
    ORDER BY f.due_date ASC
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Get all fees
app.get('/api/fees', (req, res) => {
  const query = `
    SELECT f.*, m.name as member_name 
    FROM fees f
    JOIN members m ON f.member_id = m.id
    ORDER BY f.due_date DESC
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Mark fee as paid
app.put('/api/fees/pay/:id', (req, res) => {
  const query = "UPDATE fees SET status='paid', paid_date=CURDATE() WHERE id=?";
  db.query(query, [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Fee marked as paid!' });
  });
});

// Add fee record
app.post('/api/fees', (req, res) => {
  const { member_id, amount, due_date } = req.body;
  const query = "INSERT INTO fees (member_id, amount, due_date, status) VALUES (?, ?, ?, 'unpaid')";
  db.query(query, [member_id, amount, due_date], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Fee added!', id: result.insertId });
  });
});

// ─── WORKOUTS ROUTE ───────────────────────────────────────

const workoutsData = require('./data/workouts.json');

app.get('/api/workouts', (req, res) => {
  res.json(workoutsData);
});

// ─── AI CHAT ROUTE (Deterministic Code Engine + Fallback) ──

const queryAsync = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });

app.post('/api/ai/chat', async (req, res) => {
  const rawMsg = (req.body.message || '').trim();
  const lowerMsg = rawMsg.toLowerCase();

  if (!rawMsg) {
    return res.json({ reply: 'Please enter a question or choose an option above.' });
  }

  // Helper date formatter
  const formatDate = (d) => {
    if (!d) return '—';
    try {
      return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return String(d);
    }
  };

  try {
    // ══════════════════════════════════════════════════════════
    // 1. GUIDED WORKOUT PLAN INTENTS
    // ══════════════════════════════════════════════════════════

    const workoutPromptRegex = /\b(workout|workouts|train today|what should i train|exercise|exercises|workout plan|routine)\b/i;
    const isInitialWorkoutAsk =
      workoutPromptRegex.test(lowerMsg) &&
      !lowerMsg.includes('push') &&
      !lowerMsg.includes('pull') &&
      !lowerMsg.includes('leg') &&
      !lowerMsg.includes('muscle') &&
      !Object.keys(workoutsData.muscles).some(m => lowerMsg.includes(m.toLowerCase()));

    if (isInitialWorkoutAsk || lowerMsg === 'workout plan' || lowerMsg === 'workout plans' || lowerMsg === 'today workout plan') {
      return res.json({
        reply: "Which workout variation would you like?",
        options: ["Individual Muscle", "Push Variation", "Pull Variation", "Leg Variation"],
        type: "workout_root"
      });
    }

    // A. User selected "Individual Muscle"
    if (lowerMsg === 'individual muscle' || lowerMsg.includes('individual muscle') || lowerMsg === 'muscles' || lowerMsg === 'by muscle') {
      return res.json({
        reply: "Select a muscle group to view its 6 targeted exercise variations:",
        options: [
          "Chest", "Back", "Shoulders", "Biceps", "Triceps", "Forearms",
          "Quadriceps", "Hamstrings", "Glutes", "Calves", "Abs & Core", "Traps"
        ],
        type: "muscle_selection"
      });
    }

    // B. User selected a specific muscle group
    const muscleMap = {
      'chest': 'Chest',
      'back': 'Back',
      'lats': 'Back',
      'shoulders': 'Shoulders',
      'shoulder': 'Shoulders',
      'delts': 'Shoulders',
      'biceps': 'Biceps',
      'bicep': 'Biceps',
      'triceps': 'Triceps',
      'tricep': 'Triceps',
      'forearms': 'Forearms',
      'forearm': 'Forearms',
      'quadriceps': 'Quadriceps',
      'quads': 'Quadriceps',
      'quad': 'Quadriceps',
      'hamstrings': 'Hamstrings',
      'hamstring': 'Hamstrings',
      'hams': 'Hamstrings',
      'glutes': 'Glutes',
      'glute': 'Glutes',
      'calves': 'Calves',
      'calf': 'Calves',
      'abs & core': 'Abs & Core',
      'abs': 'Abs & Core',
      'core': 'Abs & Core',
      'traps': 'Traps',
      'trap': 'Traps'
    };

    for (const [key, muscleName] of Object.entries(muscleMap)) {
      const regex = new RegExp(`\\b${key}\\b`, 'i');
      if (regex.test(lowerMsg)) {
        const exercises = workoutsData.muscles[muscleName];
        if (exercises) {
          const listText = exercises.map((ex, i) => `${i + 1}. **${ex}**`).join('\n');
          const reply = [
            `💪 **REFORM PHASE — ${muscleName} Workout Library**`,
            `6 targeted exercise variations for optimal hyper-trophy & strength:\n`,
            listText,
            `\n**General Training Guidelines:**`,
            `• **Beginner**: 2–3 sets of 10–15 reps`,
            `• **Intermediate**: 3–4 sets of 8–12 reps`,
            `• **Advanced**: 3–5 sets of 6–12 reps`,
            `\n*Note: Workout plans should be adjusted based on individual member goals, fitness levels, and recovery capacity.*`
          ].join('\n');

          return res.json({
            reply,
            options: ["Individual Muscle", "Push Variation", "Pull Variation", "Leg Variation"],
            type: "muscle_detail"
          });
        }
      }
    }

    // C. User selected Push, Pull, or Leg Variation
    if (lowerMsg.includes('push') && (lowerMsg.includes('variation') || lowerMsg.includes('day') || lowerMsg.includes('workout') || lowerMsg.trim() === 'push')) {
      const split = workoutsData.splits["Push Variation"];
      const mainList = split.main.map((m, i) => `${i + 1}. **${m.exercise}** *(${m.target})*`).join('\n');
      const altList = split.alternatives.map(a => `• **${a.exercise}** *(${a.target})*`).join('\n');

      const reply = [
        `🔥 **REFORM PHASE — Push Variation**`,
        `Focus: Chest, Anterior/Lateral Delts & Triceps\n`,
        `**Main Variation (6 Exercises):**`,
        mainList,
        `\n**Alternative Exercises:**`,
        altList,
        `\n**General Training Guidelines:**`,
        `• **Beginner**: 2–3 sets of 10–15 reps`,
        `• **Intermediate**: 3–4 sets of 8–12 reps`,
        `• **Advanced**: 3–5 sets of 6–12 reps`,
        `\n*Note: Workout plans should be adjusted based on individual member goals, fitness levels, and recovery capacity.*`
      ].join('\n');

      return res.json({
        reply,
        options: ["Pull Variation", "Leg Variation", "Individual Muscle"],
        type: "split_detail"
      });
    }

    if (lowerMsg.includes('pull') && (lowerMsg.includes('variation') || lowerMsg.includes('day') || lowerMsg.includes('workout') || lowerMsg.trim() === 'pull')) {
      const split = workoutsData.splits["Pull Variation"];
      const mainList = split.main.map((m, i) => `${i + 1}. **${m.exercise}** *(${m.target})*`).join('\n');
      const altList = split.alternatives.map(a => `• **${a.exercise}** *(${a.target})*`).join('\n');

      const reply = [
        `⚡ **REFORM PHASE — Pull Variation**`,
        `Focus: Back, Biceps, Traps & Rear Delts\n`,
        `**Main Variation (6 Exercises):**`,
        mainList,
        `\n**Alternative Exercises:**`,
        altList,
        `\n**General Training Guidelines:**`,
        `• **Beginner**: 2–3 sets of 10–15 reps`,
        `• **Intermediate**: 3–4 sets of 8–12 reps`,
        `• **Advanced**: 3–5 sets of 6–12 reps`,
        `\n*Note: Workout plans should be adjusted based on individual member goals, fitness levels, and recovery capacity.*`
      ].join('\n');

      return res.json({
        reply,
        options: ["Push Variation", "Leg Variation", "Individual Muscle"],
        type: "split_detail"
      });
    }

    if ((lowerMsg.includes('leg') || lowerMsg.includes('legs')) && (lowerMsg.includes('variation') || lowerMsg.includes('day') || lowerMsg.includes('workout') || lowerMsg.trim() === 'leg' || lowerMsg.trim() === 'legs')) {
      const split = workoutsData.splits["Leg Variation"];
      const mainList = split.main.map((m, i) => `${i + 1}. **${m.exercise}** *(${m.target})*`).join('\n');
      const altList = split.alternatives.map(a => `• **${a.exercise}** *(${a.target})*`).join('\n');

      const reply = [
        `🏋️ **REFORM PHASE — Leg Variation**`,
        `Focus: Quadriceps, Hamstrings, Glutes & Calves\n`,
        `**Main Variation (6 Exercises):**`,
        mainList,
        `\n**Alternative Exercises:**`,
        altList,
        `\n**General Training Guidelines:**`,
        `• **Beginner**: 2–3 sets of 10–15 reps`,
        `• **Intermediate**: 3–4 sets of 8–12 reps`,
        `• **Advanced**: 3–5 sets of 6–12 reps`,
        `\n*Note: Workout plans should be adjusted based on individual member goals, fitness levels, and recovery capacity.*`
      ].join('\n');

      return res.json({
        reply,
        options: ["Push Variation", "Pull Variation", "Individual Muscle"],
        type: "split_detail"
      });
    }

    // ══════════════════════════════════════════════════════════
    // 2. DETERMINISTIC SQL DATABASE INTENTS
    // ══════════════════════════════════════════════════════════

    // A. Members on Annual Plan
    if (lowerMsg.includes('annual plan') || lowerMsg.includes('annual member') || lowerMsg.includes('on annual') || (lowerMsg.includes('annual') && lowerMsg.includes('plan'))) {
      const rows = await queryAsync("SELECT name, phone, email, join_date FROM members WHERE LOWER(plan_type) = 'annual' ORDER BY name ASC");
      const list = rows.map((m, i) => `${i + 1}. **${m.name}** — 📞 ${m.phone || 'N/A'} | ${m.email || 'N/A'} *(Joined: ${formatDate(m.join_date)})*`).join('\n');
      const reply = `👑 **REFORM PHASE — Athletes on Annual Plan (${rows.length} Members)**\n\n${list}`;
      return res.json({ reply });
    }

    // B. Members on Monthly Plan
    if (lowerMsg.includes('monthly plan') || lowerMsg.includes('monthly member') || lowerMsg.includes('on monthly') || (lowerMsg.includes('monthly') && lowerMsg.includes('plan'))) {
      const rows = await queryAsync("SELECT name, phone, email, join_date FROM members WHERE LOWER(plan_type) = 'monthly' ORDER BY name ASC");
      const list = rows.map((m, i) => `${i + 1}. **${m.name}** — 📞 ${m.phone || 'N/A'} | ${m.email || 'N/A'} *(Joined: ${formatDate(m.join_date)})*`).join('\n');
      const reply = `📅 **REFORM PHASE — Athletes on Monthly Plan (${rows.length} Members)**\n\n${list}`;
      return res.json({ reply });
    }

    // C. Members on Quarterly Plan
    if (lowerMsg.includes('quarterly plan') || lowerMsg.includes('quarterly member') || lowerMsg.includes('on quarterly') || (lowerMsg.includes('quarterly') && lowerMsg.includes('plan'))) {
      const rows = await queryAsync("SELECT name, phone, email, join_date FROM members WHERE LOWER(plan_type) = 'quarterly' ORDER BY name ASC");
      const list = rows.map((m, i) => `${i + 1}. **${m.name}** — 📞 ${m.phone || 'N/A'} | ${m.email || 'N/A'} *(Joined: ${formatDate(m.join_date)})*`).join('\n');
      const reply = `⭐ **REFORM PHASE — Athletes on Quarterly Plan (${rows.length} Members)**\n\n${list}`;
      return res.json({ reply });
    }

    // D. Total Member Count / Overview / All Members
    if (
      lowerMsg.includes('how many members') ||
      lowerMsg.includes('total member') ||
      lowerMsg.includes('member count') ||
      lowerMsg.includes('all member') ||
      lowerMsg.includes('list member') ||
      lowerMsg.includes('show member') ||
      lowerMsg === 'members'
    ) {
      const counts = await queryAsync("SELECT plan_type, COUNT(*) as count FROM members GROUP BY plan_type");
      const totalRow = await queryAsync("SELECT COUNT(*) as total FROM members");
      const total = totalRow[0]?.total || 0;
      const breakdown = counts.map(c => `• **${c.plan_type}**: ${c.count} members`).join('\n');

      const reply = [
        `📊 **REFORM PHASE — Member Roster Overview**`,
        `Total registered athletes: **${total}**\n`,
        `**Membership Breakdown:**`,
        breakdown,
        `\n*Tip: You can ask "List members on annual plans" or "Who hasn't paid fees?" for specific lists.*`
      ].join('\n');

      return res.json({ reply });
    }

    // E. Who has not paid fees / unpaid fees
    if (
      lowerMsg.includes('not paid') ||
      lowerMsg.includes("hasn't paid") ||
      lowerMsg.includes('unpaid') ||
      lowerMsg.includes('pending fee') ||
      lowerMsg.includes('who owes') ||
      lowerMsg.includes('fee due')
    ) {
      const rows = await queryAsync(`
        SELECT m.name, m.phone, m.plan_type, f.amount, f.due_date,
               CASE WHEN f.due_date < CURDATE() THEN 1 ELSE 0 END AS is_overdue
        FROM fees f
        JOIN members m ON f.member_id = m.id
        WHERE f.status = 'unpaid'
        ORDER BY f.due_date ASC, m.name ASC
      `);

      if (rows.length === 0) {
        return res.json({ reply: '🎉 All membership fees are fully settled! No pending dues.' });
      }

      const list = rows.map((f, i) => {
        const badge = f.is_overdue ? '⚠️ **[OVERDUE]**' : '⏳ *[Pending]*';
        return `${i + 1}. **${f.name}** (${f.plan_type}) — ₹${Number(f.amount).toLocaleString('en-IN')} | Due: ${formatDate(f.due_date)} ${badge} — 📞 ${f.phone || 'N/A'}`;
      }).join('\n');

      const reply = `💳 **REFORM PHASE — Unpaid Fees Ledger (${rows.length} Pending Accounts)**\n\n${list}`;
      return res.json({ reply });
    }

    // F. Fees due soon / overdue / alerts
    if (
      lowerMsg.includes('due soon') ||
      lowerMsg.includes('overdue') ||
      lowerMsg.includes('fee alert') ||
      lowerMsg.includes('urgent fee') ||
      lowerMsg.includes('alerts')
    ) {
      const rows = await queryAsync(`
        SELECT m.name, m.phone, m.plan_type, f.amount, f.due_date,
               CASE WHEN f.due_date < CURDATE() THEN 1 ELSE 0 END AS is_overdue
        FROM fees f
        JOIN members m ON f.member_id = m.id
        WHERE f.status = 'unpaid'
          AND f.due_date <= DATE_ADD(CURDATE(), INTERVAL 3 DAY)
        ORDER BY f.due_date ASC, m.name ASC
      `);

      if (rows.length === 0) {
        return res.json({ reply: '✅ No fee alerts at this moment! All dues are settled or not yet within the 3-day notice window.' });
      }

      const list = rows.map((f, i) => {
        const statusText = f.is_overdue ? '🚨 **OVERDUE**' : '🔔 **DUE WITHIN 3 DAYS**';
        return `${i + 1}. **${f.name}** — ₹${Number(f.amount).toLocaleString('en-IN')} | Due: ${formatDate(f.due_date)} (${statusText}) — 📞 ${f.phone || 'N/A'}`;
      }).join('\n');

      const reply = `⚠️ **REFORM PHASE — Urgent Fee Payment Alerts (${rows.length} Accounts)**\n\n${list}`;
      return res.json({ reply });
    }

    // G. Who is present today
    if (
      lowerMsg.includes('present today') ||
      lowerMsg.includes('who is present') ||
      lowerMsg.includes('who attended today') ||
      lowerMsg.includes('who came today') ||
      lowerMsg.includes('attendance today') ||
      lowerMsg.includes('present members') ||
      lowerMsg.includes('checked in today')
    ) {
      const rows = await queryAsync(`
        SELECT m.name, m.phone, m.plan_type
        FROM members m
        JOIN attendance a ON m.id = a.member_id AND a.date = CURDATE()
        WHERE a.status = 'present'
        ORDER BY m.name ASC
      `);

      if (rows.length === 0) {
        return res.json({ reply: "📋 No athletes have checked in on the studio floor yet today." });
      }

      const list = rows.map((m, i) => `${i + 1}. **${m.name}** (${m.plan_type}) — 📞 ${m.phone || 'N/A'}`).join('\n');
      const reply = `✅ **REFORM PHASE — Athletes Present Today (${rows.length} Checked In)**\n\n${list}`;
      return res.json({ reply });
    }

    // H. Who is absent today
    if (
      lowerMsg.includes('absent today') ||
      lowerMsg.includes('who is absent') ||
      lowerMsg.includes('who missed today') ||
      lowerMsg.includes('absentees') ||
      lowerMsg.includes('not attended today')
    ) {
      const rows = await queryAsync(`
        SELECT m.name, m.phone, m.plan_type,
               CASE WHEN a.status = 'absent' THEN 'Marked Absent' ELSE 'Not Marked' END AS attendance_status
        FROM members m
        LEFT JOIN attendance a ON m.id = a.member_id AND a.date = CURDATE()
        WHERE a.status IS NULL OR a.status != 'present'
        ORDER BY m.name ASC
      `);

      const list = rows.map((m, i) => {
        const badge = m.attendance_status === 'Marked Absent' ? '❌ *Marked Absent*' : '⚪ *Not Checked In*';
        return `${i + 1}. **${m.name}** (${m.plan_type}) — ${badge} | 📞 ${m.phone || 'N/A'}`;
      }).join('\n');

      const reply = `❌ **REFORM PHASE — Absent / Unmarked Athletes Today (${rows.length} Members)**\n\n${list}`;
      return res.json({ reply });
    }

    // I. Member Details by Name (e.g. "Details of Aarav", "Who is Sneha", "Tell me about Arjun")
    const memberNameQueryMatch = lowerMsg.match(/(?:details of|tell me about|info on|who is|member)\s+([a-zA-Z\s]+)/i);
    let targetName = memberNameQueryMatch ? memberNameQueryMatch[1].trim() : null;

    if (!targetName && lowerMsg.split(' ').length <= 3) {
      targetName = lowerMsg.replace(/[^a-zA-Z\s]/g, '').trim();
    }

    if (targetName && targetName.length >= 3) {
      const memberMatch = await queryAsync(
        "SELECT * FROM members WHERE LOWER(name) LIKE ? OR LOWER(name) LIKE ? LIMIT 1",
        [`%${targetName}%`, `${targetName}%`]
      );

      if (memberMatch.length > 0) {
        const mem = memberMatch[0];
        const feeRows = await queryAsync("SELECT * FROM fees WHERE member_id = ? ORDER BY due_date DESC LIMIT 1", [mem.id]);
        const attRows = await queryAsync("SELECT * FROM attendance WHERE member_id = ? AND date = CURDATE() LIMIT 1", [mem.id]);

        const latestFee = feeRows[0];
        const todayAttRecord = attRows[0];

        let feeStatusText = 'No record';
        if (latestFee) {
          if (latestFee.status === 'paid') {
            feeStatusText = `Paid (₹${Number(latestFee.amount).toLocaleString('en-IN')})`;
          } else {
            const isOverdue = new Date(latestFee.due_date) < new Date();
            feeStatusText = `Unpaid: ₹${Number(latestFee.amount).toLocaleString('en-IN')} (Due: ${formatDate(latestFee.due_date)}) ${isOverdue ? '⚠️ Overdue' : ''}`;
          }
        }

        let attStatusText = 'Not checked in yet';
        if (todayAttRecord) {
          attStatusText = todayAttRecord.status === 'present' ? 'Present ✓' : 'Marked Absent ✗';
        }

        const reply = [
          `👤 **REFORM PHASE — Athlete Profile**`,
          `• **Full Name**: **${mem.name}**`,
          `• **Membership Plan**: **${mem.plan_type}** Plan`,
          `• **Contact Phone**: 📞 ${mem.phone || 'N/A'}`,
          `• **Email**: ${mem.email || 'N/A'}`,
          `• **Enrollment Date**: ${formatDate(mem.join_date)}`,
          `• **Fee Status**: ${feeStatusText}`,
          `• **Today's Attendance**: ${attStatusText}`
        ].join('\n');

        return res.json({ reply });
      }
    }

    // ══════════════════════════════════════════════════════════
    // 3. FALLBACK TO OLLAMA (For general chat only)
    // ══════════════════════════════════════════════════════════

    const [allMembers, allFees, todayPresent] = await Promise.all([
      queryAsync("SELECT name, plan_type FROM members ORDER BY name ASC"),
      queryAsync("SELECT m.name, f.amount, f.due_date, f.status FROM fees f JOIN members m ON f.member_id = m.id WHERE f.status = 'unpaid'"),
      queryAsync("SELECT m.name FROM members m JOIN attendance a ON m.id = a.member_id WHERE a.date = CURDATE() AND a.status = 'present'")
    ]);

    const context = `
REFORM PHASE Studio Database Verified Summary:
Total Members: ${allMembers.length}
Members by Plan: ${JSON.stringify(allMembers.slice(0, 40))}
Unpaid Fees (${allFees.length}): ${JSON.stringify(allFees)}
Present Today (${todayPresent.length}): ${JSON.stringify(todayPresent.map(p => p.name))}
`.trim();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const ollamaRes = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          model: 'gemma3:1b',
          prompt: `You are the official Virtual Assistant for REFORM PHASE Fitness Studio.
Verified Studio Context:
${context}

Instructions:
- Answer the user's question politely and accurately.
- Use ONLY the verified data provided above.
- NEVER invent, hallucinate, or assume member names or numbers.
- If unsure or if the request asks for specific lists, recommend asking directly (e.g. "List members on annual plans" or "Who hasn't paid fees?").

User Question: ${rawMsg}`,
          stream: false
        })
      });

      clearTimeout(timeoutId);
      const data = await ollamaRes.json();
      return res.json({ reply: data.response });
    } catch {
      // Friendly fallback if Ollama is offline or times out
      return res.json({
        reply: [
          `👋 I am your **REFORM PHASE Virtual Assistant**!`,
          `I can instantly help you with verified studio records and guided routines:\n`,
          `• **Workout Plans**: Try asking *"Workout plan for today"*`,
          `• **Plan Members**: *"List members on annual plans"* or *"Monthly members"*`,
          `• **Attendance**: *"Who is present today?"* or *"Who is absent today?"*`,
          `• **Fee Invoices**: *"Who hasn't paid fees?"* or *"Fees due soon"*`,
          `• **Athlete Profiles**: *"Details of Aarav Sharma"*`
        ].join('\n'),
        options: ["Today's workout plan", "List members on annual plans", "Who hasn't paid fees?"]
      });
    }
  } catch (err) {
    console.error('AI chat error:', err);
    return res.status(500).json({ error: 'Internal server error processing request.' });
  }
});

// ─── START SERVER ─────────────────────────────────────────

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});