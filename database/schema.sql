-- CitizenCare Database Schema
-- Member 4: Database
-- Target DBMS: MySQL 8+

CREATE DATABASE IF NOT EXISTS citizen_complaints;
USE citizen_complaints;

CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE,
  password VARCHAR(255) NOT NULL DEFAULT 'worker123',
  department_id INT NULL,
  CONSTRAINT fk_employee_department
    FOREIGN KEY (department_id) REFERENCES departments(id)
    ON DELETE SET NULL ON UPDATE CASCADE
);

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
  department_id INT NULL,
  employee_id INT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  resolved_at DATETIME NULL,
  CONSTRAINT fk_complaint_department
    FOREIGN KEY (department_id) REFERENCES departments(id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_complaint_employee
    FOREIGN KEY (employee_id) REFERENCES employees(id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT chk_priority_score CHECK (priority_score BETWEEN 0 AND 100)
);

CREATE INDEX idx_complaints_status ON complaints(status);
CREATE INDEX idx_complaints_department ON complaints(department_id);
CREATE INDEX idx_complaints_employee ON complaints(employee_id);
CREATE INDEX idx_complaints_created_at ON complaints(created_at);
