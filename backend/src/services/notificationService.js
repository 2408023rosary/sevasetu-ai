const {Notification}=require('../models'); exports.create=async(userId,complaintId,title,message,type,transaction)=>Notification.create({userId,complaintId,title,message,type},{transaction}); exports.list=async(userId,opts)=>Notification.findAndCountAll({where:{userId},order:[['created_at','DESC']],limit:opts.limit,offset:opts.offset});

