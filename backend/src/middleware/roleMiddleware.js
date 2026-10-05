const {failure}=require('../utils/response'); module.exports=(...roles)=>(req,res,next)=>roles.includes(req.user?.role)?next():failure(res,403,'Insufficient permissions');
