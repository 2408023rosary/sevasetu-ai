const jwt=require('jsonwebtoken'); const crypto=require('crypto'); const env=require('../config/environment');
exports.signAccessToken=(u)=>jwt.sign({sub:u.id,role:u.role,type:'access'},env.JWT_ACCESS_SECRET,{expiresIn:env.JWT_ACCESS_EXPIRES_IN});
exports.signRefreshToken=(u,jti)=>jwt.sign({sub:u.id,role:u.role,type:'refresh',jti},env.JWT_REFRESH_SECRET,{expiresIn:env.JWT_REFRESH_EXPIRES_IN});
exports.verifyAccessToken=(t)=>jwt.verify(t,env.JWT_ACCESS_SECRET); exports.verifyRefreshToken=(t)=>jwt.verify(t,env.JWT_REFRESH_SECRET); exports.randomTokenId=()=>crypto.randomUUID(); exports.hashToken=(t)=>crypto.createHash('sha256').update(t).digest('hex');
