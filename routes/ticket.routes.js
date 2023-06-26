const {authJwt,verifyTicketRequestBody}=require('../middlewares');
const ticketController=require('../controllers/ticket.controller')

module.exports=function(app)
{
    app.post('/crm/api/v1/tickets',[authJwt.verifyToken,verifyTicketRequestBody.validateTicketRequestBody],ticketController.createTicket);
    app.put('/crm/api/v1/tickets/:id',[authJwt.verifyToken,verifyTicketRequestBody.validateTicketStatus],ticketController.updateTicket);
    app.get('/crm/api/v1/tickets',[authJwt.verifyToken],ticketController.getAllTickets);
    app.get('/crm/api/v1/tickets/:id',[authJwt.verifyToken],ticketController.getOneTicket);
}