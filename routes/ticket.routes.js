module.exports = (app) => {
    app.use((req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "Content-Type", "Origin", "Accept"
        );
        next();
    });

    const controller = require('../controllers/ticket.controller');
    const middleware = require('../middlewares/ticket.middleware');

    app.post('/generate', [
        middleware.isAdmin
    ], controller.createQr);
    app.post('/approve', [
        middleware.isBouncer
    ], controller.approveEntry);
    app.post('/generateMultiple/:count', [
        middleware.isAdmin
    ], controller.createMultipleQr);
    app.get('/tickets', [
        middleware.isBouncer
    ], controller.getAllTickets)
    app.post('/reset', [
        middleware.isAdmin
    ], controller.resetTickets)
    app.get('/ticket/:id', [
        middleware.isAdmin
    ], controller.getTicketById);
}