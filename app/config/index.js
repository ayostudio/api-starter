module.exports = {
  env: process.env.NODE_ENV || 'development',
  mongodbUri:
    process.env.MONGODB_URI || 'mongodb://localhost:27017/node-api',
  secret: process.env.SECRET || 'node-api-secret',
  port: process.env.PORT || '2000',
};
