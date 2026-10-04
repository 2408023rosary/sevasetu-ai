import express from 'express';
import multer from 'multer';
import path from 'path';
import pool from '../db.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${Date.now()}-${safe}`);
  }
});

const upload = multer({ storage });

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const { search = '', status = '', category = '', severity = '' } = req.query;

    let sql = `
      SELECT c.*, d.name AS department_name, e.name AS employee_name
      FROM complaints c
      LEFT JOIN departments d ON c.department_id = d.id
      LEFT JOIN employees e ON c.employee_id = e.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      sql += ` AND (c.title LIKE ? OR c.citizen_name LIKE ? OR c.location LIKE ? OR c.id LIKE ?)`;
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    if (status) {
      sql += ` AND c.status = ?`;
      params.push(status);
    }

    if (category) {
      sql += ` AND c.category = ?`;
      params.push(category);
    }

    if (severity) {
      sql += ` AND c.severity = ?`;
      params.push(severity);
    }

    sql += ' ORDER BY c.created_at DESC';

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not load complaints.' });
  }
});

router.get('/meta', async (req, res) => {
  try {
    const [[departments], [employees]] = await Promise.all([
      pool.query('SELECT * FROM departments ORDER BY name'),
      pool.query(`
        SELECT e.id, e.name, e.email, e.department_id, d.name AS department_name
        FROM employees e
        LEFT JOIN departments d ON e.department_id = d.id
        ORDER BY e.name
      `)
    ]);

    res.json({ departments, employees });
  } catch (error) {
    res.status(500).json({ message: 'Could not load assignment data.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT c.*, d.name AS department_name, e.name AS employee_name
      FROM complaints c
      LEFT JOIN departments d ON c.department_id = d.id
      LEFT JOIN employees e ON c.employee_id = e.id
      WHERE c.id = ?
    `, [req.params.id]);

    if (!rows.length) return res.status(404).json({ message: 'Complaint not found.' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Could not load complaint.' });
  }
});

router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['Pending','In Progress','Resolved','Rejected','Reopened'];

    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status.' });
    }

    if (status === 'Resolved') {
      await pool.query(
        'UPDATE complaints SET status = ?, resolved_at = NOW() WHERE id = ?',
        [status, req.params.id]
      );
    } else {
      await pool.query(
        'UPDATE complaints SET status = ?, resolved_at = NULL WHERE id = ?',
        [status, req.params.id]
      );
    }

    res.json({ message: 'Status updated successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Could not update status.' });
  }
});

router.put('/:id/assign', async (req, res) => {
  try {
    const { department_id, employee_id } = req.body;

    await pool.query(
      'UPDATE complaints SET department_id = ?, employee_id = ? WHERE id = ?',
      [department_id || null, employee_id || null, req.params.id]
    );

    res.json({ message: 'Complaint assigned successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Could not assign complaint.' });
  }
});

router.post('/demo-create', upload.single('image'), async (req, res) => {
  try {
    const {
      citizen_name, citizen_email, title, description,
      category, severity, priority_score, location
    } = req.body;

    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const [result] = await pool.query(`
      INSERT INTO complaints
      (citizen_name,citizen_email,title,description,category,ai_category,severity,priority_score,location,image)
      VALUES (?,?,?,?,?,?,?,?,?,?)
    `, [
      citizen_name, citizen_email, title, description, category,
      category, severity || 'Medium', priority_score || 50, location, image
    ]);

    res.status(201).json({ message: 'Complaint created.', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not create complaint.' });
  }
});

export default router;
