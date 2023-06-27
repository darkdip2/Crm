const mongoose = require("mongoose");

const bodyParser=require('body-parser');
const express = require("express");
const app=express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

const dbConfig = require("./configs/db.config");
const serverConfig = require("./configs/server.config");
const User = require("./models/user.model");
const bcrypt = require("bcryptjs");

mongoose.connect(dbConfig.DB_URL);

const db = mongoose.connection;
db.on("error", () => {
  console.log("Error while connecting to db");
});

db.once("open", () => {
  console.log("Connected to mongo db");
  init();
});
async function init() {
  //await User.deleteMany({});
  var user = await User.findOne({ userType: "ADMIN" });
  if (user) {
    console.log("Admin user already present");
    console.log(user);
    return;
  }
  try {
    let user = await User.create({
      name: "Diptyajit Das",
      userId: 1,
      email: "diptya99@gmail.com",
      userType: "ADMIN",
      userStatus: "APPROVED",
      password: bcrypt.hashSync("#Password67", 8),
    });
    console.log(user);
  } catch (e) {
    console.log("Error while creating admin user " + e);
  }
}

require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
require('./routes/ticket.routes')(app);

app.listen(serverConfig.PORT, () => {
  console.log("Application started on port " + serverConfig.PORT);
});
