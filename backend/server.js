import http from 'node:http';
import { URL } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';

const PORT = Number(process.env.PORT || 5000);
const ROOT = path.resolve(process.cwd());
const DATA_DIR = path.join(ROOT, 'data');
const DB_FILE = path.join(DATA_DIR, 'citizencare.sqlite');
fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new DatabaseSync(DB_FILE);
db.exec(`
PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS departments (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE);
CREATE TABLE IF NOT EXISTS employees (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT UNIQUE, password TEXT NOT NULL DEFAULT 'worker123', department_id INTEGER, FOREIGN KEY(department_id) REFERENCES departments(id) ON DELETE SET NULL);
CREATE TABLE IF NOT EXISTS admins (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS complaints (
 id INTEGER PRIMARY KEY AUTOINCREMENT, citizen_name TEXT NOT NULL, citizen_email TEXT, title TEXT NOT NULL, description TEXT NOT NULL,
 category TEXT NOT NULL, ai_category TEXT, severity TEXT DEFAULT 'Medium', priority_score INTEGER DEFAULT 50, location TEXT,
 image TEXT, status TEXT DEFAULT 'Pending', department_id INTEGER, employee_id INTEGER, created_at TEXT DEFAULT CURRENT_TIMESTAMP,
 resolved_at TEXT, FOREIGN KEY(department_id) REFERENCES departments(id) ON DELETE SET NULL, FOREIGN KEY(employee_id) REFERENCES employees(id) ON DELETE SET NULL
);
`);

const count = (table) => db.prepare(`SELECT COUNT(*) AS count FROM ${table}`).get().count;
if (!count('admins')) db.prepare('INSERT INTO admins (name,email,password) VALUES (?,?,?)').run('System Administrator','admin@gmail.com','admin123');
if (!count('departments')) {
  const names=['Roads & Infrastructure','Sanitation','Water Supply','Electricity','Public Safety'];
  const s=db.prepare('INSERT INTO departments (name) VALUES (?)'); for(const n of names)s.run(n);
}
if (!count('employees')) {
  const s=db.prepare('INSERT INTO employees (name,email,password,department_id) VALUES (?,?,?,?)');
  [['Rahul Naik','rahul@example.com','worker123',1],['Sneha Patil','sneha@example.com','worker123',2],['Amit Sharma','amit@example.com','worker123',3],['Priya Desai','priya@example.com','worker123',4],['Vikram Rao','vikram@example.com','worker123',5]].forEach(x=>s.run(...x));
}
if (!count('complaints')) {
  const s=db.prepare(`INSERT INTO complaints (citizen_name,citizen_email,title,description,category,ai_category,severity,priority_score,location,status,department_id,employee_id,created_at,resolved_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`);
  const now=Date.now();
  const rows=[
   ['John Dsouza','john@example.com','Pothole near main road','Large pothole causing traffic problems.','Roads','Road Damage','High',85,'Margao','Pending',1,1,new Date(now-2*864e5).toISOString(),null],
   ['Anita Sharma','anita@example.com','Garbage not collected','Garbage has not been collected for three days.','Sanitation','Garbage','Medium',60,'Navelim','In Progress',2,2,new Date(now-5*864e5).toISOString(),null],
   ['Rohan Naik','rohan@example.com','Street light not working','Street light is not working at night.','Electricity','Street Light','High',78,'Fatorda','Resolved',4,4,new Date(now-12*864e5).toISOString(),new Date(now-8*864e5).toISOString()],
   ['Maria Fernandes','maria@example.com','Water leakage','Water is leaking continuously near the public tap.','Water Supply','Water Leakage','Critical',95,'Colva','Pending',3,3,new Date(now-864e5).toISOString(),null],
   ['Karan Mehta','karan@example.com','Broken footpath','Broken footpath is difficult for pedestrians.','Roads','Road Damage','Low',35,'Margao','Rejected',1,1,new Date(now-20*864e5).toISOString(),null],
   ['Neha Verma','neha@example.com','Overflowing garbage bin','Public garbage bin is overflowing.','Sanitation','Garbage','Medium',55,'Chinchinim','Resolved',2,2,new Date(now-25*864e5).toISOString(),new Date(now-22*864e5).toISOString()],
   ['Sanjay Kumar','sanjay@example.com','Dangerous junction','Traffic visibility is poor at this junction.','Public Safety','Traffic Hazard','Critical',90,'Ponda','In Progress',5,5,new Date(now-7*864e5).toISOString(),null],
   ['Riya Shah','riya@example.com','Drainage blockage','Blocked drainage is causing water accumulation.','Sanitation','Drainage','High',82,'Margao','Reopened',2,2,new Date(now-15*864e5).toISOString(),null]
  ]; for(const r of rows)s.run(...r);
}

const tokens = new Map();
const tokenFor = (type,id) => { const t=crypto.randomBytes(24).toString('hex'); tokens.set(t,{type,id,expires:Date.now()+8*3600e3}); return t; };
function user(req, requiredType='admin') { const h=req.headers.authorization||''; const t=h.startsWith('Bearer ')?h.slice(7):''; const u=tokens.get(t); if(!u||u.expires<Date.now()||(requiredType&&u.type!==requiredType)) return null; return u; }
function json(res,status,data){ const body=JSON.stringify(data); res.writeHead(status,{'Content-Type':'application/json','Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'Content-Type, Authorization','Access-Control-Allow-Methods':'GET,POST,PUT,OPTIONS'}); res.end(body); }
function notFound(res){json(res,404,{message:'Not found.'});}
async function body(req){let s=''; for await(const c of req)s+=c; if(!s)return {}; try{return JSON.parse(s)}catch{return Object.fromEntries(new URLSearchParams(s));}}
function complaintRows(where='',params=[]){return db.prepare(`SELECT c.*, d.name department_name, e.name employee_name FROM complaints c LEFT JOIN departments d ON c.department_id=d.id LEFT JOIN employees e ON c.employee_id=e.id ${where} ORDER BY datetime(c.created_at) DESC`).all(...params);}

const server=http.createServer(async(req,res)=>{
 if(req.method==='OPTIONS'){res.writeHead(204,{'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'Content-Type, Authorization','Access-Control-Allow-Methods':'GET,POST,PUT,OPTIONS'});return res.end();}
 const u=new URL(req.url,`http://localhost:${PORT}`); const p=u.pathname;
 try {
  if(p==='/'&&req.method==='GET') return json(res,200,{message:'Citizen Complaint API is running.',database:'SQLite',databaseFile:'backend/data/citizencare.sqlite'});
  if(p==='/api/auth/login'&&req.method==='POST'){const b=await body(req);const a=db.prepare('SELECT id,name,email,password FROM admins WHERE email=?').get(b.email);if(!a||a.password!==b.password)return json(res,401,{message:'Invalid login details.'});return json(res,200,{token:tokenFor('admin',a.id),admin:{id:a.id,name:a.name,email:a.email}});}
  if(p==='/api/auth/worker-login'&&req.method==='POST'){const b=await body(req);const w=db.prepare('SELECT e.id,e.name,e.email,e.password,e.department_id,d.name department_name FROM employees e LEFT JOIN departments d ON d.id=e.department_id WHERE e.email=?').get(b.email);if(!w||w.password!==b.password)return json(res,401,{message:'Invalid worker login details.'});return json(res,200,{token:tokenFor('worker',w.id),user:{id:w.id,name:w.name,email:w.email,department_id:w.department_id,department_name:w.department_name}});}
  if(p==='/api/dashboard/stats'&&req.method==='GET'){if(!user(req))return json(res,401,{message:'Authentication required.'});const x=db.prepare(`SELECT COUNT(*) total, SUM(status='Pending') pending, SUM(status='In Progress') inProgress, SUM(status='Resolved') resolved, SUM(status='Rejected') rejected, SUM(severity IN ('High','Critical')) highPriority, SUM(datetime(created_at)>=datetime('now','-7 day')) recent FROM complaints`).get();return json(res,200,x);}
  if(p==='/api/dashboard/analytics'&&req.method==='GET'){if(!user(req))return json(res,401,{message:'Authentication required.'});const category=db.prepare('SELECT category name,COUNT(*) value FROM complaints GROUP BY category ORDER BY value DESC').all();const status=db.prepare('SELECT status name,COUNT(*) value FROM complaints GROUP BY status').all();const priority=db.prepare('SELECT severity name,COUNT(*) value FROM complaints GROUP BY severity').all();const monthly=db.prepare("SELECT substr(created_at,1,7) month,COUNT(*) value FROM complaints GROUP BY substr(created_at,1,7) ORDER BY month").all();const department=db.prepare('SELECT d.name,COUNT(c.id) value FROM departments d LEFT JOIN complaints c ON c.department_id=d.id GROUP BY d.id,d.name ORDER BY value DESC').all();const location=db.prepare("SELECT location name,COUNT(*) value FROM complaints WHERE location IS NOT NULL AND location<>'' GROUP BY location ORDER BY value DESC LIMIT 10").all();const resolution=db.prepare("SELECT ROUND(AVG((julianday(resolved_at)-julianday(created_at))*24),1) averageHours FROM complaints WHERE resolved_at IS NOT NULL").get();return json(res,200,{category,status,priority,monthly,department,location,resolution});}
  if(p==='/api/complaints'&&req.method==='GET'){if(!user(req))return json(res,401,{message:'Authentication required.'});let rows=complaintRows();const q=u.searchParams;const search=(q.get('search')||'').toLowerCase();if(search)rows=rows.filter(x=>`${x.id} ${x.title} ${x.citizen_name} ${x.location}`.toLowerCase().includes(search));if(q.get('status'))rows=rows.filter(x=>x.status===q.get('status'));if(q.get('category'))rows=rows.filter(x=>x.category===q.get('category'));if(q.get('severity'))rows=rows.filter(x=>x.severity===q.get('severity'));return json(res,200,rows);}
  if(p==='/api/complaints/meta'&&req.method==='GET'){if(!user(req))return json(res,401,{message:'Authentication required.'});return json(res,200,{departments:db.prepare('SELECT * FROM departments ORDER BY name').all(),employees:db.prepare('SELECT e.id,e.name,e.email,e.department_id,d.name department_name FROM employees e LEFT JOIN departments d ON d.id=e.department_id ORDER BY e.name').all()});}
  const cm=p.match(/^\/api\/complaints\/(\d+)$/); if(cm&&req.method==='GET'){if(!user(req))return json(res,401,{message:'Authentication required.'});const row=complaintRows('WHERE c.id=?',[cm[1]])[0];return row?json(res,200,row):json(res,404,{message:'Complaint not found.'});}
  const cs=p.match(/^\/api\/complaints\/(\d+)\/status$/); if(cs&&req.method==='PUT'){if(!user(req))return json(res,401,{message:'Authentication required.'});const b=await body(req);if(!['Pending','In Progress','Resolved','Rejected','Reopened'].includes(b.status))return json(res,400,{message:'Invalid status.'});db.prepare('UPDATE complaints SET status=?,resolved_at=? WHERE id=?').run(b.status,b.status==='Resolved'?new Date().toISOString():null,cs[1]);return json(res,200,{message:'Status updated successfully.'});}
  const ca=p.match(/^\/api\/complaints\/(\d+)\/assign$/); if(ca&&req.method==='PUT'){if(!user(req))return json(res,401,{message:'Authentication required.'});const b=await body(req);db.prepare('UPDATE complaints SET department_id=?,employee_id=? WHERE id=?').run(b.department_id||null,b.employee_id||null,ca[1]);return json(res,200,{message:'Complaint assigned successfully.'});}
  if(p==='/api/worker/me'&&req.method==='GET'){const w=user(req,'worker');if(!w)return json(res,401,{message:'Authentication required.'});return json(res,200,db.prepare('SELECT e.id,e.name,e.email,e.department_id,d.name department_name FROM employees e LEFT JOIN departments d ON d.id=e.department_id WHERE e.id=?').get(w.id));}
  if(p==='/api/worker/complaints'&&req.method==='GET'){const w=user(req,'worker');if(!w)return json(res,401,{message:'Authentication required.'});return json(res,200,complaintRows('WHERE c.employee_id=?',[w.id]));}
  const wc=p.match(/^\/api\/worker\/complaints\/(\d+)$/); if(wc&&req.method==='GET'){const w=user(req,'worker');if(!w)return json(res,401,{message:'Authentication required.'});const row=complaintRows('WHERE c.id=? AND c.employee_id=?',[wc[1],w.id])[0];return row?json(res,200,row):json(res,404,{message:'Complaint is not assigned to you.'});}
  const ws=p.match(/^\/api\/worker\/complaints\/(\d+)\/status$/); if(ws&&req.method==='PUT'){const w=user(req,'worker');if(!w)return json(res,401,{message:'Authentication required.'});const b=await body(req);if(!['Pending','In Progress','Resolved','Reopened'].includes(b.status))return json(res,400,{message:'Invalid worker status.'});const r=db.prepare('UPDATE complaints SET status=?,resolved_at=? WHERE id=? AND employee_id=?').run(b.status,b.status==='Resolved'?new Date().toISOString():null,ws[1],w.id);if(!r.changes)return json(res,404,{message:'Complaint is not assigned to you.'});return json(res,200,{message:b.status==='Resolved'?'Work marked as completed.':'Work status updated.'});}
  return notFound(res);
 } catch(e){ console.error(e); return json(res,500,{message:e.message||'Server error.'}); }
});

server.on('error', (err) => { console.error(`Backend could not start: ${err.message}`); process.exit(1); });
server.listen(PORT,()=>{console.log('\n=== CitizenCare Backend ===');console.log('✓ SQLite database created automatically.');console.log(`✓ Database file: ${DB_FILE}`);console.log(`✓ API server: http://localhost:${PORT}`);console.log('✓ No MySQL, XAMPP, Express, or npm backend packages required.');console.log('✓ Admin: admin@gmail.com / admin123');console.log('✓ Worker: rahul@example.com / worker123\n');});
