const constants=require('../utils/constatnts')

const validateTicketRequestBody=(req,res,next)=>
{
    if(!req.body.title)return res.status(400).json('Failed!Title is not provided');
    if(!req.body.description)return res.status(400).json('Failed!Description is not provided');
    next();
}

const validateTicketStatus=(req,res,next)=>
{
    const status=req.body.status;
    const statusTypes=[constants.ticketStatus.open,constants.ticketStatus.inProgress,constants.ticketStatus.closed,constants.ticketStatus.blocked];

    if(status&&!statusTypes.includes(status))return res.status(400).json('Failed! Status provided is invalid');
    next();
}

module.exports={validateTicketRequestBody,validateTicketStatus}