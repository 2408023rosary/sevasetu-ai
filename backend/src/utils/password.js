const bcrypt=require('bcryptjs'); exports.hashPassword=(p)=>bcrypt.hash(p,12); exports.comparePassword=(p,h)=>bcrypt.compare(p,h);
