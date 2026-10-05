-- CitizenCare Demo / Seed Data
-- Run after schema.sql
USE citizen_complaints;

INSERT INTO admins (name, email, password)
SELECT 'System Administrator', 'admin@gmail.com', 'admin123'
WHERE NOT EXISTS (SELECT 1 FROM admins WHERE email = 'admin@gmail.com');

INSERT INTO departments (name)
SELECT 'Roads & Infrastructure' WHERE NOT EXISTS (SELECT 1 FROM departments WHERE name='Roads & Infrastructure');
INSERT INTO departments (name)
SELECT 'Sanitation' WHERE NOT EXISTS (SELECT 1 FROM departments WHERE name='Sanitation');
INSERT INTO departments (name)
SELECT 'Water Supply' WHERE NOT EXISTS (SELECT 1 FROM departments WHERE name='Water Supply');
INSERT INTO departments (name)
SELECT 'Electricity' WHERE NOT EXISTS (SELECT 1 FROM departments WHERE name='Electricity');
INSERT INTO departments (name)
SELECT 'Public Safety' WHERE NOT EXISTS (SELECT 1 FROM departments WHERE name='Public Safety');

INSERT INTO employees (name,email,password,department_id)
SELECT 'Rahul Naik','rahul@example.com','worker123',d.id FROM departments d WHERE d.name='Roads & Infrastructure'
AND NOT EXISTS (SELECT 1 FROM employees WHERE email='rahul@example.com');
INSERT INTO employees (name,email,password,department_id)
SELECT 'Sneha Patil','sneha@example.com','worker123',d.id FROM departments d WHERE d.name='Sanitation'
AND NOT EXISTS (SELECT 1 FROM employees WHERE email='sneha@example.com');
INSERT INTO employees (name,email,password,department_id)
SELECT 'Amit Sharma','amit@example.com','worker123',d.id FROM departments d WHERE d.name='Water Supply'
AND NOT EXISTS (SELECT 1 FROM employees WHERE email='amit@example.com');
INSERT INTO employees (name,email,password,department_id)
SELECT 'Priya Desai','priya@example.com','worker123',d.id FROM departments d WHERE d.name='Electricity'
AND NOT EXISTS (SELECT 1 FROM employees WHERE email='priya@example.com');
INSERT INTO employees (name,email,password,department_id)
SELECT 'Vikram Rao','vikram@example.com','worker123',d.id FROM departments d WHERE d.name='Public Safety'
AND NOT EXISTS (SELECT 1 FROM employees WHERE email='vikram@example.com');

-- Demo complaints. IDs are resolved through department/employee names so this seed does not depend on fixed IDs.
INSERT INTO complaints
(citizen_name,citizen_email,title,description,category,ai_category,severity,priority_score,location,status,department_id,employee_id,created_at,resolved_at)
SELECT 'John Dsouza','john@example.com','Pothole near main road','Large pothole causing traffic problems.','Roads','Road Damage','High',85,'Margao','Pending',d.id,e.id,DATE_SUB(NOW(), INTERVAL 2 DAY),NULL
FROM departments d JOIN employees e ON e.email='rahul@example.com'
WHERE d.name='Roads & Infrastructure'
AND NOT EXISTS (SELECT 1 FROM complaints WHERE title='Pothole near main road');

INSERT INTO complaints
(citizen_name,citizen_email,title,description,category,ai_category,severity,priority_score,location,status,department_id,employee_id,created_at,resolved_at)
SELECT 'Anita Sharma','anita@example.com','Garbage not collected','Garbage has not been collected for three days.','Sanitation','Garbage','Medium',60,'Navelim','In Progress',d.id,e.id,DATE_SUB(NOW(), INTERVAL 5 DAY),NULL
FROM departments d JOIN employees e ON e.email='sneha@example.com'
WHERE d.name='Sanitation'
AND NOT EXISTS (SELECT 1 FROM complaints WHERE title='Garbage not collected');

INSERT INTO complaints
(citizen_name,citizen_email,title,description,category,ai_category,severity,priority_score,location,status,department_id,employee_id,created_at,resolved_at)
SELECT 'Rohan Naik','rohan@example.com','Street light not working','Street light is not working at night.','Electricity','Street Light','High',78,'Fatorda','Resolved',d.id,e.id,DATE_SUB(NOW(), INTERVAL 12 DAY),DATE_SUB(NOW(), INTERVAL 8 DAY)
FROM departments d JOIN employees e ON e.email='priya@example.com'
WHERE d.name='Electricity'
AND NOT EXISTS (SELECT 1 FROM complaints WHERE title='Street light not working');

INSERT INTO complaints
(citizen_name,citizen_email,title,description,category,ai_category,severity,priority_score,location,status,department_id,employee_id,created_at,resolved_at)
SELECT 'Maria Fernandes','maria@example.com','Water leakage','Water is leaking continuously near the public tap.','Water Supply','Water Leakage','Critical',95,'Colva','Pending',d.id,e.id,DATE_SUB(NOW(), INTERVAL 1 DAY),NULL
FROM departments d JOIN employees e ON e.email='amit@example.com'
WHERE d.name='Water Supply'
AND NOT EXISTS (SELECT 1 FROM complaints WHERE title='Water leakage');

INSERT INTO complaints
(citizen_name,citizen_email,title,description,category,ai_category,severity,priority_score,location,status,department_id,employee_id,created_at,resolved_at)
SELECT 'Karan Mehta','karan@example.com','Broken footpath','Broken footpath is difficult for pedestrians.','Roads','Road Damage','Low',35,'Margao','Rejected',d.id,e.id,DATE_SUB(NOW(), INTERVAL 20 DAY),NULL
FROM departments d JOIN employees e ON e.email='rahul@example.com'
WHERE d.name='Roads & Infrastructure'
AND NOT EXISTS (SELECT 1 FROM complaints WHERE title='Broken footpath');

INSERT INTO complaints
(citizen_name,citizen_email,title,description,category,ai_category,severity,priority_score,location,status,department_id,employee_id,created_at,resolved_at)
SELECT 'Neha Verma','neha@example.com','Overflowing garbage bin','Public garbage bin is overflowing.','Sanitation','Garbage','Medium',55,'Chinchinim','Resolved',d.id,e.id,DATE_SUB(NOW(), INTERVAL 25 DAY),DATE_SUB(NOW(), INTERVAL 22 DAY)
FROM departments d JOIN employees e ON e.email='sneha@example.com'
WHERE d.name='Sanitation'
AND NOT EXISTS (SELECT 1 FROM complaints WHERE title='Overflowing garbage bin');

INSERT INTO complaints
(citizen_name,citizen_email,title,description,category,ai_category,severity,priority_score,location,status,department_id,employee_id,created_at,resolved_at)
SELECT 'Sanjay Kumar','sanjay@example.com','Dangerous junction','Traffic visibility is poor at this junction.','Public Safety','Traffic Hazard','Critical',90,'Ponda','In Progress',d.id,e.id,DATE_SUB(NOW(), INTERVAL 7 DAY),NULL
FROM departments d JOIN employees e ON e.email='vikram@example.com'
WHERE d.name='Public Safety'
AND NOT EXISTS (SELECT 1 FROM complaints WHERE title='Dangerous junction');

INSERT INTO complaints
(citizen_name,citizen_email,title,description,category,ai_category,severity,priority_score,location,status,department_id,employee_id,created_at,resolved_at)
SELECT 'Riya Shah','riya@example.com','Drainage blockage','Blocked drainage is causing water accumulation.','Sanitation','Drainage','High',82,'Margao','Reopened',d.id,e.id,DATE_SUB(NOW(), INTERVAL 15 DAY),NULL
FROM departments d JOIN employees e ON e.email='sneha@example.com'
WHERE d.name='Sanitation'
AND NOT EXISTS (SELECT 1 FROM complaints WHERE title='Drainage blockage');
