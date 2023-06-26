const Ticket = require("../models/ticket.model");
const User = require("../models/user.model");
const constants = require("../utils/constatnts");
const sendEmail = require("../utils/notificationClient");

exports.createTicket = async (req, res) => {
  const ticketObject = {
    title: req.body.title,
    ticketPriority: req.body.ticketPriority,
    description: req.body.description,
    status: req.body.status,
    reporter: req.userId,
  };
  const engineer = await User.findOne({
    userType: constants.userTypes.engineer,
    userStatus: constants.userStatus.approved,
  });

  ticketObject.assignee = engineer.userId;

  try {
    const ticket = await Ticket.create(ticketObject);

    if (ticket) {
      const user = await User.findOne({ userId: req.userId });

      user.ticketsCreated.push(ticket._id);
      await user.save();

      if (engineer) {
        engineer.ticketsAssigned.push(ticket._id);
        await engineer.save();
      }
      sendEmail(
        ticket._id,
        `Ticket with ticketId ${ticket._id} updated and is in status ${ticket.status}`,
        ticket.description,
        //[user.email, engineer.email],
        ['diptya99@gmail.com'],
        ticket.reporter
      );


      return res.status(200).send(ticket);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json("Some internal server error occured");
  }
};

exports.updateTicket = async (req, res) => {
  const ticket = await Ticket.findOne({ _id: req.params.id });
  const user = await User.findOne({ userId: req.userId });

  if (
    ticket &&
    (ticket.reporter == req.userId ||
      ticket.assignee == req.userId ||
      user.userType == constants.userTypes.admin)
  ) {
    ticket.title = req.body.title ? req.body.title : ticket.title;
    ticket.description = req.body.description
      ? req.body.description
      : ticket.description;
    ticket.ticketPriority = req.body.ticketPriority
      ? req.body.ticketPriority
      : ticket.ticketPriority;
    ticket.status = req.body.status ? req.body.status : ticket.status;

    let updatedTicket = await ticket.save();

    return res.status(200).send(updatedTicket);
  } else
    res
      .status(401)
      .json("Ticket can only be updated by the customer who added it");
};

exports.getAllTickets = async (req, res) => {
  const user = await User.findOne({ userId: req.userId });
  let tickets;
  if (user.userType == constants.userTypes.admin) tickets = await Ticket.find();
  else if (user.userType == constants.userTypes.customer)
    tickets = await Ticket.find({ reporter: req.userId });
  else tickets = await Ticket.find({ assignee: req.userId });

  /* let queryObject = { reporter: req.userId };
  if (req.query.status) queryObject.status = req.query.status; */

  res.status(200).send(tickets);
};

exports.getOneTicket = async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.userId });
    const ticket = await Ticket.findOne({
      _id: req.params.id,
    });
    if (!ticket) return res.status(404).json("Ticket Does Not Exist");
    if (
      ticket.reporter == req.userId ||
      ticket.assignee == req.userId ||
      user.userType == constants.userTypes.admin
    )
      return res.status(200).send(ticket);
    else return res.status(403).json("Forbidden");
  } catch (e) {
    return res.status(500).json("Internal Error");
  }
};
