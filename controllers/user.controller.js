const User = require("../models/user.model");
const convertObject = require("../utils/convertUserObject");

exports.findAll = async (req, res) => {
  try {
    let userStatus=req.params.userStatus,userType=req.params.userType;
    let users;
    if(userStatus&&!userType)users = await User.find({userStatus:userStatus});
    else if(userType&&!userStatus)users=await User.find({userType:userType});
    else if(userStatus&&userType)users = await User.find({userStatus:userStatus,userType:userType});
    else users = await User.find();
    if (users) return res.status(200).send(convertObject.userResponse(users));
  } catch (err) {
    res.status(500).send({
      message: "Some internal error occured",
    });
  }
};
exports.findById = async (req, res) => {
  const userIdRequest = req.params.userId;
  const user = await User.find({ userId: userIdRequest });

  if (user.length)
    return res.status(200).send(convertObject.userResponse(user));
  else
    return res
      .status(200)
      .send({ message: `User with id ${userIdRequest} is not present` });
};
exports.update = async (req, res) => {
  const userIdRequest = req.params.userId;
  try {
    const user = await User.findOneAndUpdate(
      {
        userId: userIdRequest,
      },
      {
        name: req.body.name,
        userStatus: req.body.userStatus,
        userType: req.body.userType,
      }
    ).exec();
    if (user) {
      return res.status(200).send({ message: "User updated successfully" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: "Some internal server error occured" });
  }
};
