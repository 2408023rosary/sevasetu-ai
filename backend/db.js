import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  port: Number(process.env.DB_PORT || 3306)
};

const DB_NAME = process.env.DB_NAME || 'citizen_complaints';

let pool;

async function initializeDatabase() {
  // Connect first without selecting a database.
  const connection = await mysql.createConnection(config);

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
  await connection.end();

  pool = mysql.createPool({
    ...config,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10
  });

  // Create tables automatically.
  await pool.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS departments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS employees (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150),
      department_id INT,
      FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS complaints (
      id INT AUTO_INCREMENT PRIMARY KEY,
      citizen_name VARCHAR(100) NOT NULL,
      citizen_email VARCHAR(150),
      title VARCHAR(200) NOT NULL,
      description TEXT NOT NULL,
      category VARCHAR(100) NOT NULL,
      ai_category VARCHAR(100),
      severity ENUM('Low','Medium','High','Critical') DEFAULT 'Medium',
      priority_score INT DEFAULT 50,
      location VARCHAR(200),
      image VARCHAR(255),
      status ENUM('Pending','In Progress','Resolved','Rejected','Reopened') DEFAULT 'Pending',
      department_id INT,
      employee_id INT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      resolved_at DATETIME NULL,
      FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
      FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE SET NULL
    )
  `);

  // Seed only when the tables are empty.
  const [adminRows] = await pool.query('SELECT COUNT(*) AS count FROM admins');
  if (adminRows[0].count === 0) {
    await pool.query(
      'INSERT INTO admins (name,email,password) VALUES (?,?,?)',
      ['System Administrator', 'admin@gmail.com', 'admin123']
    );
  }

  const [departmentRows] = await pool.query('SELECT COUNT(*) AS count FROM departments');
  if (departmentRows[0].count === 0) {
    await pool.query(
      'INSERT INTO departments (name) VALUES ?',
      [[
        ['Roads & Infrastructure'],
        ['Sanitation'],
        ['Water Supply'],
        ['Electricity'],
        ['Public Safety']
      ]]
    );
  }

  const [employeeRows] = await pool.query('SELECT COUNT(*) AS count FROM employees');
  if (employeeRows[0].count === 0) {
    await pool.query(
      `INSERT INTO employees (name,email,department_id) VALUES
       ('Rahul Naik','rahul@example.com',1),
       ('Sneha Patil','sneha@example.com',2),
       ('Amit Sharma','amit@example.com',3),
       ('Priya Desai','priya@example.com',4),
       ('Vikram Rao','vikram@example.com',5)`
    );
  }

  const [complaintRows] = await pool.query('SELECT COUNT(*) AS count FROM complaints');
  if (complaintRows[0].count === 0) {
    await pool.query(`
      INSERT INTO complaints
      (citizen_name,citizen_email,title,description,category,ai_category,severity,priority_score,location,status,department_id,employee_id,created_at,resolved_at)
      VALUES
      ('John Dsouza','john@example.com','Pothole near main road','Large pothole causing traffic problems.','Roads','Road Damage','High',85,'Margao','Pending',1,1,DATE_SUB(NOW(), INTERVAL 2 DAY),NULL),
      ('Anita Sharma','anita@example.com','Garbage not collected','Garbage has not been collected for three days.','Sanitation','Garbage','Medium',60,'Navelim','In Progress',2,2,DATE_SUB(NOW(), INTERVAL 5 DAY),NULL),
      ('Rohan Naik','rohan@example.com','Street light not working','Street light is not working at night.','Electricity','Street Light','High',78,'Fatorda','Resolved',4,4,DATE_SUB(NOW(), INTERVAL 12 DAY),DATE_SUB(NOW(), INTERVAL 8 DAY)),
      ('Maria Fernandes','maria@example.com','Water leakage','Water is leaking continuously near the public tap.','Water Supply','Water Leakage','Critical',95,'Colva','Pending',3,3,DATE_SUB(NOW(), INTERVAL 1 DAY),NULL),
      ('Karan Mehta','karan@example.com','Broken footpath','Broken footpath is difficult for pedestrians.','Roads','Road Damage','Low',35,'Margao','Rejected',1,1,DATE_SUB(NOW(), INTERVAL 20 DAY),NULL),
      ('Neha Verma','neha@example.com','Overflowing garbage bin','Public garbage bin is overflowing.','Sanitation','Garbage','Medium',55,'Chinchinim','Resolved',2,2,DATE_SUB(NOW(), INTERVAL 25 DAY),DATE_SUB(NOW(), INTERVAL 22 DAY)),
      ('Sanjay Kumar','sanjay@example.com','Dangerous junction','Traffic visibility is poor at this junction.','Public Safety','Traffic Hazard','Critical',90,'Ponda','In Progress',5,5,DATE_SUB(NOW(), INTERVAL 7 DAY),NULL),
      ('Riya Shah','riya@example.com','Drainage blockage','Blocked drainage is causing water accumulation.','Sanitation','Drainage','High',82,'Margao','Reopened',2,2,DATE_SUB(NOW(), INTERVAL 15 DAY),NULL)
    `);
  }

  console.log(`Database "${DB_NAME}" is ready.`);
  console.log('Tables and demo data are ready.');
  console.log('Admin login: admin@gmail.com / admin123');

  return pool;
}

export { initializeDatabase };

export function getPool() {
  if (!pool) {
    throw new Error('Database has not been initialized yet.');
  }
  return pool;
}

export default {
  query: (...args) => getPool().query(...args)
};
