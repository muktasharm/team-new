
const jwt=require('jsonwebtoken');

require("dotenv").config()
const securect_key=process.env.securect_key;
const userVerifyToken=async(req,res,next)=>{
    try{
        const token=req.header('Authorization')?.replace('Bearer ','');
        if(!token){
            return res.status(404).json({result:false,message:"token is missing in header"})
        }
        const decoded=jwt.verify(token,securect_key);
        req.user=decoded;
        next();

    }catch(err){
        res.status(500).json({result:false,message:err.message});
    }

};
module.exports=userVerifyToken;