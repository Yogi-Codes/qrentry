module.exports = (app) => {
    app.use((req, res, next) => {
      res.header(
        "Access-Control-Allow-Headers",
        "Content-Type", "Origin", "Accept"
      );
      next();
    });

    const usersController = require('../controllers/users.controller.js');
  
    app.get('/users', usersController.findAll);
    app.get('/users/:id', usersController.findOne);
};  