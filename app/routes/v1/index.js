module.exports = (app) => {
  app.get('/', (req, res) => res.json({
    message: 'Welcome to the Node Starter API 🖐',
    data: {
      enviroment: process.env.NODE_ENV,
    },
  }));
};
