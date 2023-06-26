const User=require('../models/user.model');
const constants=require('../utils/constatnts')

validateSignupRequest=async(req,res,next)=>
{
    if(!req.body.name)
    {
        res.status(400).send(
            {
                message:'Failed! Name is not provided'
            }
        )
        return;
    }
    if(!req.body.userId)
    {
        res.status(400).send({
            message:'Failed! UserId is not provided'
        })
        return;
    }
    const user=await User.findOne({userId:req.body.userId});
    if(user){res.status(400).send({message:'Failed! UserId already exists'});return;}
    //Validate email=>Regular Expression

    const email=await User.findOne({emial:req.body.email});
    if(email){res.status(400).send({message:'Failed! Email already exists'});return;}

    const userType=req.body.userType;
    const userTypes=[constants.userTypes.engineer,constants.userTypes.customer,constants.userTypes.admin];
    if(userType&&!userTypes.includes(userType))
    {
        res.status(400).send({
            message:'UserType provided is invalid'
        })
        return;
    }
    next();
}
const verifySignup={validateSignupRequest};
module.exports=verifySignup;