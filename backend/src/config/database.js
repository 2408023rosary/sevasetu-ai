const {Sequelize}=require('sequelize'); const env=require('./environment');
const sequelize=new Sequelize(env.DB_NAME,env.DB_USER,env.DB_PASSWORD,{host:env.DB_HOST,port:env.DB_PORT,dialect:env.DB_DIALECT,logging:env.DB_LOGGING?console.log:false,pool:{max:10,min:0,idle:10000},define:{underscored:true,timestamps:true}});
module.exports=sequelize;
