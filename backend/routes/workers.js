import express from 'express';
import pool from '../db.js';
import { auth, requireWorker } from '../middleware/auth.js';

const router = express.Router();
router.use(auth, requireWorker);

router.get('/me', async (req, res) => {
  try {
    const [[worker]] = await pool.query(`
      SELECT e.id, e.name, e.email, e.department_id, d.name AS department_name
      FROM employees e LEFT JOIN departments d ON e.department_id = d.id
      WHERE e.id = ?
    `, [req.user.id]);
    if (!worker) return res.status(404).json({ message: 'Worker not found.' });
    res.json(worker);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not load worker profile.' });
  }
});

router.get('/complaints', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT c.*, d.name AS department_name
      FROM complaints c
      LEFT JOIN departments d ON c.department_id = d.id
      WHERE c.employee_id = ?
      ORDER BY FIELD(c.status, 'In Progress', 'Pending', 'Reopened', 'Resolved', 'Rejected'), c.created_at DESC
    `, [req.user.id]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not load assigned complaints.' });
  }
});

router.get('/complaints/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT c.*, d.name AS department_name
      FROM complaints c LEFT JOIN departments d ON c.department_id = d.id
      WHERE c.id = ? AND c.employee_id = ?
    `, [req.params.id, req.user.id]);
    if (!rows.length) return res.status(404).json({ message: 'Complaint is not assigned to you.' });
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not load complaint.' });
  }
});

router.put('/complaints/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['Pending', 'In Progress', 'Resolved', 'Reopened'];
    if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid worker status.' });

    const [result] = await pool.query(
      `UPDATE complaints SET status = ?, resolved_at = ${status === 'Resolved' ? 'NOW()' : 'NULL'} WHERE id = ? AND employee_id = ?`,
      [status, req.params.id, req.user.id]
    );
    if (!result.affectedRows) return res.status(404).json({ message: 'Complaint is not assigned to you.' });

    res.json({ message: status === 'Resolved' ? 'Work marked as completed.' : 'Work status updated.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not update work status.' });
  }
});

export default router;
