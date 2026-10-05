exports.success=(res,status,message,data,meta)=>res.status(status).json({success:true,message,data,...(meta?{meta}:{})});
exports.failure=(res,status,message,errors)=>res.status(status).json({success:false,message,...(errors?{errors}:{})});
