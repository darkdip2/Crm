const jwt=require('jsonwebtoken');
const authConfig=require('../configs/auth.config');
const User=require('../models/user.model');
const constants=require('../utils/constatnts');

const verifyToken=(req,res,next)=>
{
    let token=req.headers['x-access-token'];
    if(!token)
    {
        return res.status(401).send({
            message:'No token has been provided'
        })
    }
    jwt.verify(token,authConfig.secretKey,(err,decoded)=>
    {
        if(err){
            return res.status(401).send({
                message:'Request cannot be authenticated.Token is invalid'
            })
        }
        req.userId=decoded.id;
        next();
    })
}

const isAdmin=async(req,res,next)=>
{
    const user=await User.findOne(
        {
            userId:req.userId
        }
    )
    if(user&&user.userType==constants.userTypes.admin)next();
    else
    {
        return res.status(403).send({
            message:'Only admins are allowed this operation'
        })
    }
}

const authJwt=
{
    verifyToken,
    isAdmin
}
module.exports=authJwt