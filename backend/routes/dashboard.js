import express from 'express';
import pool from '../db.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.use(auth);

router.get('/stats', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        COUNT(*) AS total,
        SUM(status = 'Pending') AS pending,
        SUM(status = 'In Progress') AS inProgress,
        SUM(status = 'Resolved') AS resolved,
        SUM(status = 'Rejected') AS rejected,
        SUM(severity IN ('High','Critical')) AS highPriority,
        SUM(created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)) AS recent
      FROM complaints
    `);

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not load dashboard statistics.' });
  }
});

router.get('/analytics', async (req, res) => {
  try {
    const [[category], [status], [priority], [monthly], [department], [location], [resolution]] =
      await Promise.all([
        pool.query(`SELECT category AS name, COUNT(*) AS value FROM complaints GROUP BY category ORDER BY value DESC`),
        pool.query(`SELECT status AS name, COUNT(*) AS value FROM complaints GROUP BY status`),
        pool.query(`SELECT severity AS name, COUNT(*) AS value FROM complaints GROUP BY severity`),
        pool.query(`
          SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, COUNT(*) AS value
          FROM complaints
          GROUP BY DATE_FORMAT(created_at, '%Y-%m')
          ORDER BY month
        `),
        pool.query(`
          SELECT d.name, COUNT(c.id) AS value
          FROM departments d
          LEFT JOIN complaints c ON c.department_id = d.id
          GROUP BY d.id, d.name
          ORDER BY value DESC
        `),
        pool.query(`
          SELECT location AS name, COUNT(*) AS value
          FROM complaints
          WHERE location IS NOT NULL AND location <> ''
          GROUP BY location
          ORDER BY value DESC
          LIMIT 10
        `),
        pool.query(`
          SELECT
            ROUND(AVG(TIMESTAMPDIFF(HOUR, created_at, resolved_at)), 1) AS averageHours
          FROM complaints
          WHERE resolved_at IS NOT NULL
        `)
      ]);

    res.json({
      category,
      status,
      priority,
      monthly,
      department,
      location,
      resolution: resolution[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not load analytics.' });
  }
});

export default router;
