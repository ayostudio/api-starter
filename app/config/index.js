module.exports = {
  env: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/node-api',
  secret: process.env.SECRET || 'node-api-secret',
  sendgridKey:
    process.env.SENDGRID_KEY
    || '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',
  port: process.env.PORT || '4000',
  adminKey: process.env.ADMIN_KEY || 'adminKey',
};
