module.exports = {
  env: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/node-api',
  secret: process.env.SECRET || 'node-api-secret',
  sendgridKey: process.env.SENDGRID_KEY,
  port: process.env.PORT || '4000',
  adminKey: process.env.ADMIN_KEY || 'adminKey',
};
