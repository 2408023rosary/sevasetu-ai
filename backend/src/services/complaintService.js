const {Op}=require('sequelize'); const {Complaint,ComplaintStatusHistory,ComplaintImage,Notification,User,Department}=require('../models'); const {classifyComplaint}=require('./aiService'); const {departmentForCategory,validateOfficer}=require('./assignmentService'); const {STATUSES,ROLES}=require('../utils/constants');
async function number(t){const y=new Date().getFullYear(); const prefix=`SS-${y}-`; const last=await Complaint.findOne({where:{complaintNumber:{[Op.like]:`${prefix}%`}},order:[['createdAt','DESC']],transaction:t,lock:t? t.LOCK.UPDATE:undefined}); const n=last?Number(last.complaintNumber.split('-').pop())+1:1; return `${prefix}${String(n).padStart(6,'0')}`;}
function canView(u,c){return ['ADMIN','SUPER_ADMIN'].includes(u.role)||c.citizenId===u.id||c.assignedOfficerId===u.id;}
exports.create=async(user,data)=>{const ai=await classifyComplaint(data).catch(()=>null); const t=await Complaint.sequelize.transaction(); try{let category=data.category||({'Road Damage':'ROADS','Garbage':'GARBAGE','Water Supply':'WATER','Streetlight':'STREET_LIGHT','Drainage':'DRAINAGE','Electricity':'ELECTRICITY','Other':'OTHER'}[ai?.category]||'OTHER'); if(!STATUSES.includes(data.status||'SUBMITTED')) data.status='SUBMITTED'; const dept=await departmentForCategory(category,t); const c=await Complaint.create({complaintNumber:await number(t),citizenId:user.id,title:data.title,description:data.description,category,subcategory:data.subcategory,latitude:data.latitude,longitude:data.longitude,address:data.address,city:data.city,state:data.state,pincode:data.pincode,severity:data.severity||ai?.severity||'MEDIUM',priority:data.priority||ai?.priority||'MEDIUM',status:'SUBMITTED',departmentId:dept?.id,aiCategory:ai?.category,aiConfidence:ai?.confidence,aiPriority:ai?.priority,aiSummary:ai?.summary},{transaction:t}); await ComplaintStatusHistory.create({complaintId:c.id,newStatus:'SUBMITTED',changedBy:user.id,remarks:'Complaint submitted'},{transaction:t}); await Notification.create({userId:user.id,complaintId:c.id,title:'Complaint submitted',message:`Complaint ${c.complaintNumber} was submitted successfully.`,type:'COMPLAINT_SUBMITTED'},{transaction:t}); await t.commit(); return Complaint.findByPk(c.id,{include:['department','images']});}catch(e){await t.rollback();throw e;}};
exports.getById=async(id,u)=>{const c=await Complaint.findByPk(id,{include:['department','images',{association:'history',order:[['createdAt','ASC']]},{association:'citizen',attributes:['id','fullName','email','phone']},{association:'assignedOfficer',attributes:['id','fullName','email']} ]}); if(!c){const e=new Error('Complaint not found');e.status=404;throw e;} if(!canView(u,c)){const e=new Error('You are not authorized to access this complaint');e.status=403;throw e;} return c;};
exports.list=async(u,q)=>{const where={}; if(u.role==='CITIZEN')where.citizenId=u.id; if(u.role==='OFFICER')where.assignedOfficerId=u.id; for(const k of ['status','category','priority','departmentId'])if(q[k])where[k]=q[k]; if(q.search)where[Op.or]=[{title:{[Op.like]:`%${q.search}%`}},{description:{[Op.like]:`%${q.search}%`}},{complaintNumber:{[Op.like]:`%${q.search}%`}}]; const page=Math.max(1,Number(q.page)||1),limit=Math.min(100,Math.max(1,Number(q.limit)||10)); const allowed=['createdAt','updatedAt','priority','status','title']; const sort=allowed.includes(q.sort)?q.sort:'createdAt'; const order=String(q.order).toUpperCase()==='ASC'?'ASC':'DESC'; const r=await Complaint.findAndCountAll({where,include:['department'],order:[[sort,order]],limit,offset:(page-1)*limit}); return {...r,page,limit,totalPages:Math.ceil(r.count/limit)};};
exports.update=async(id,u,data)=>{const c=await Complaint.findByPk(id);if(!c){const e=new Error('Complaint not found');e.status=404;throw e;} if(u.role==='CITIZEN'&&c.citizenId!==u.id){const e=new Error('Forbidden');e.status=403;throw e;} if(u.role==='CITIZEN'&&!['SUBMITTED','REOPENED'].includes(c.status)){const e=new Error('Complaint can no longer be edited');e.status=409;throw e;} if(u.role==='OFFICER'&&c.assignedOfficerId!==u.id){const e=new Error('Forbidden');e.status=403;throw e;} const allowed=u.role==='CITIZEN'?['title','description','address','city','state','pincode','latitude','longitude','subcategory']:['title','description','subcategory','address','city','state','pincode','latitude','longitude','severity','priority']; const patch={};for(const k of allowed)if(data[k]!==undefined)patch[k]=data[k];await c.update(patch);return c;};
exports.changeStatus = async (id, u, newStatus, remarks) => {
    const t = await Complaint.sequelize.transaction();

    try {
        const c = await Complaint.findByPk(id, {
            transaction: t,
            lock: t.LOCK.UPDATE
        });

        if (!c) {
            const e = new Error('Complaint not found');
            e.status = 404;
            throw e;
        }

        /*
         * Authorization must happen before exposing the complaint's
         * current status or validating the requested transition.
         */
        if (u.role === 'CITIZEN') {
            if (c.citizenId !== u.id) {
                const e = new Error('Forbidden');
                e.status = 403;
                throw e;
            }

            if (
                newStatus !== 'REOPENED' ||
                !['RESOLVED', 'REJECTED'].includes(c.status)
            ) {
                const e = new Error('Forbidden status transition');
                e.status = 403;
                throw e;
            }
        }

        if (u.role === 'OFFICER') {
            if (c.assignedOfficerId !== u.id) {
                const e = new Error('Forbidden');
                e.status = 403;
                throw e;
            }
        }

        if (!['CITIZEN', 'OFFICER', 'ADMIN', 'SUPER_ADMIN'].includes(u.role)) {
            const e = new Error('Forbidden');
            e.status = 403;
            throw e;
        }

        if (!STATUSES.includes(newStatus)) {
            const e = new Error('Invalid status');
            e.status = 400;
            throw e;
        }

        const transitions = {
            SUBMITTED: ['UNDER_REVIEW', 'ASSIGNED', 'REJECTED'],
            UNDER_REVIEW: ['ASSIGNED', 'REJECTED'],
            ASSIGNED: ['IN_PROGRESS', 'UNDER_REVIEW', 'REJECTED'],
            IN_PROGRESS: ['RESOLVED', 'REJECTED'],
            RESOLVED: ['REOPENED'],
            REJECTED: ['REOPENED'],
            REOPENED: ['UNDER_REVIEW', 'ASSIGNED']
        };

        if (!transitions[c.status]?.includes(newStatus)) {
            const e = new Error(
                `Invalid status transition: ${c.status} -> ${newStatus}`
            );
            e.status = 409;
            throw e;
        }

        const old = c.status;

        await c.update(
            {
                status: newStatus,
                resolvedAt:
                    newStatus === 'RESOLVED'
                        ? new Date()
                        : newStatus === 'REOPENED'
                            ? null
                            : c.resolvedAt
            },
            {
                transaction: t
            }
        );

        await ComplaintStatusHistory.create(
            {
                complaintId: c.id,
                oldStatus: old,
                newStatus,
                changedBy: u.id,
                remarks
            },
            {
                transaction: t
            }
        );

        await Notification.create(
            {
                userId: c.citizenId,
                complaintId: c.id,
                title: `Complaint ${newStatus.toLowerCase().replace('_', ' ')}`,
                message: `Your complaint ${c.complaintNumber} is now ${newStatus}.`,
                type: `STATUS_${newStatus}`
            },
            {
                transaction: t
            }
        );

        await t.commit();

        return c;

    } catch (e) {
        await t.rollback();
        throw e;
    }
};exports.assign=async(id,u,officerId)=>{const t=await Complaint.sequelize.transaction();try{const c=await Complaint.findByPk(id,{transaction:t,lock:t.LOCK.UPDATE});if(!c){const e=new Error('Complaint not found');e.status=404;throw e;}const officer=await validateOfficer(officerId,t);const oldStatus=c.status;const newStatus=oldStatus==='SUBMITTED'||oldStatus==='UNDER_REVIEW'?'ASSIGNED':oldStatus;await c.update({assignedOfficerId:officer.id,status:newStatus},{transaction:t});if(oldStatus!==newStatus)await ComplaintStatusHistory.create({complaintId:c.id,oldStatus,newStatus,changedBy:u.id,remarks:`Assigned to ${officer.fullName}`},{transaction:t});await Notification.create({userId:officer.id,complaintId:c.id,title:'Complaint assigned',message:`Complaint ${c.complaintNumber} has been assigned to you.`,type:'COMPLAINT_ASSIGNED'},{transaction:t});await Notification.create({userId:c.citizenId,complaintId:c.id,title:'Complaint assigned',message:`Complaint ${c.complaintNumber} has been assigned for action.`,type:'COMPLAINT_ASSIGNED'},{transaction:t});await t.commit();return c;}catch(e){await t.rollback();throw e;}};
exports.reopen=(id,u,remarks)=>exports.changeStatus(id,u,'REOPENED',remarks||'Complaint reopened');
exports.history=async(id,u)=>{await exports.getById(id,u);return ComplaintStatusHistory.findAll({where:{complaintId:id},order:[['createdAt','ASC']],include:[{association:'changer',attributes:['id','fullName','role']} ]});};
exports.addImage=async(id,u,file)=>{const c=await Complaint.findByPk(id);if(!c){const e=new Error('Complaint not found');e.status=404;throw e;}if(c.citizenId!==u.id&&!['ADMIN','SUPER_ADMIN'].includes(u.role)){const e=new Error('Forbidden');e.status=403;throw e;}return ComplaintImage.create({complaintId:id,fileName:file.filename,filePath:file.path,mimeType:file.mimetype,fileSize:file.size});};
exports.remove=async(id)=>{const c=await Complaint.findByPk(id);if(!c){const e=new Error('Complaint not found');e.status=404;throw e;}await c.destroy();};
exports.canView=canView;




