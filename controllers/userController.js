//import models
const {
    userModel,
    contactusModel,
    aboutusModel,
    scratchModel,
    couponModel,
    usescratchModel,
    buyCouponModel,
    sliderModel,
    offerModel,
    claimModel,
    scratchOfferModel,

}=require("./../models/schemaModels.js");


require("dotenv").config()
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');


const securect_key=process.env.securect_key;

// user login api
const userLogin=async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(404).json({result:false,message:"required fields are email and password"})
        }
        const user=await userModel.findOne({email});
        if(!user){
            return res.status(404).json({result:false,message:"Invalid email address"})
        }
        const matchPassword=await bcrypt.compare(password,user.password);
        if(!matchPassword){
            return res.status(404).json({result:false,message:"Please enter correct password"})
        }
        //generate token
        const token=jwt.sign({user},securect_key,{expiresIn:'365d'});
        res.status(200).json({result:false,message:"You are logined successfully",data:user,token})
        
    }catch(err){
        res.status(500).json({result:false,message:err.message})
    }
};

const userGetData=async(req,res)=>{
    try{
        const {userId}=req.body;
        if(!userId){
            return res.status(404).json({result:false,message:"userId is required"})
        }
        const user=await userModel.findById({_id:userId});
        if(!user){
            return res.status(404).json({result:false,message:"Invalid userId"})
        }
        res.status(200).json({result:true,message:"User data is..",data:user})

        
    }catch(err){
        res.status(500).json({result:false,message:err.message})
    }

};


const updateUserProfile=async(req,res)=>{
    try{
        const {userId,dob,phone,personName,email}=req.body;
        if(!userId){
            return res.status(404).json({result:false,message:"Required fields are userId and optionals are personName,userProfile,dob,email,phone"})
        }
        const updatedObject={
            dob,
            personName,
            email,
            phone
        }
        if(req.file){
            updatedObject.userProfile=req.file.filename;
        }
        await userModel.findByIdAndUpdate({_id:userId},updatedObject,{new:true});
        res.status(200).json({result:true,message:"User Profile updated successfully"})

        
    }catch(err){
        res.status(500).json({result:false,message:err.message})
    }

};



const contactusList=async(req,res)=>{
    try{

        const data=await contactusModel.findOne({});
        if(!data){
            return res.status(404).json ({result:false,message:"Record not found"})
        }
        res.status(200).json({result:true,message:"Contactus list is",data:data})

        
    }catch(err){
        res.status(500).json({result:false,message:err.message})
    }

};

const aboutusList=async(req,res)=>{
    try{
        const data=await aboutusModel.findOne({});
        if(!data){
            return res.status(404).json ({result:false,message:"Record not found"})
        }
        res.status(200).json({result:true,message:"Contactus list is",data:data})


        
    }catch(err){
        res.status(500).json({result:false,message:err.message})
    }

};



const scratchList=async(req,res)=>{
    try{
        const {userId}=req.body;
        if(!userId){
            return res.status(404).json({result:false,message:"userId is required"});
        }
        const today_date=new Date();
        const date = today_date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
        const data=await scratchModel.findOne({date});
        if(!data || data.length===0){
            return res.status(500).json({result:false,message:"Record not found"})
        }
        const check=await usescratchModel.findOne({userId,date});
        data.status = !!check;
        res.status(200).json({result:true,message:"Data got successfully",data:data});

    }catch(err){
        res.status(500).json({result:false,message:err.message})
    }

};



const couponList=async(req,res)=>{
    try{
        const {userId}=req.body;
        if(!userId){
            return res.status(404).json({result:false,message:"userId is required"});
        }

        const today_date=new Date();
    
        const data=await couponModel.find({});
        if(!data || data.length===0){
            return res.status(404).json({result:false,message:"Record not found"})
        }
        const filterData=data.filter(item=>{
            const expire_date=new Date(item.expire_date);
            return expire_date>=today_date;
            
        })
        if(filterData.length===0){
            return res.status(404).json({result:false,message:"Record not found"})
        }

        const buyCoupons=await buyCouponModel.find({userId});
        const ID=buyCoupons.map(item=>item.couponId.toString());
        const filterbuyData=data.filter(co => !ID.includes(co._id.toString()));

        if(filterbuyData.length===0){
            return res.status(404).json({result:false,message:"Record not found"})
        }
    
        res.status(200).json({result:true,message:"Data got successfully",data:data});

    }catch(err){
        res.status(500).json({result:false,message:err.message})
    }

};




const scratchCard=async(req,res)=>{
    try{
        const {userId,coins,cardId}=req.body;
        const today=new Date();
        const date=today.toLocaleDateString('en-GB',{
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
        if(!userId || !cardId){
            return res.status(404).json({result:false,message:"userId,coins,and cardId"});
        }
        const insert=new usescratchModel({userId,cardId,coins,date});
        await insert.save();
        //update coins
        const users=await userModel.findById({_id:userId});
        let t_coins=Number(Number(users.coins) + Number(coins));
        await userModel.findByIdAndUpdate({_id:userId},{coins:t_coins},{new:true});
        res.status(200).json({result:true,message:"Scratched successfully"})

    }catch(err){
        res.status(500).json({result:false,message:err.message});
    }

};


const buycoupon=async(req,res)=>{
    try{
        const {userId,couponId,coins}=req.body;
    if(!userId || !couponId || !coins){
        return res.status(404).json({result:false,message:"Required fields are userId,couponId,coins"})
    }
    const users=await userModel.findById({_id:userId});
    if(!(users.coins>=coins)){
        return res.status(404).json({result:false,message:"You have not sufficient coins"})
    }
    const insertData=new buyCouponModel({userId,couponId,coins});
    await insertData.save();
    let reedum=Number(Number(users.coins) - Number(coins));
    await userModel.findByIdAndUpdate({_id:userId},{coins:reedum},{new:true});
    res.status(200).json({result:true,message:"Coupon buy successfully"})

    }catch(err){
        res.status(500).json({result:false,message:err.message})
    }
    
};


const redeemCoinsList=async(req,res)=>{
    try{
        const {userId}=req.body;
        if(!userId ){
            return res.status(404).json({result:false,message:"Required fields are userId"})
        }
        const data=await buyCouponModel.find({userId}).populate('couponId').sort({createdAt:-1});
        if(!data || data.length===0){
            return res.status(404).json({result:false,message:"Records not found"})
        }
        // const dinu=data.map(item=>({

        // }));
        res.status(200).json({result:true,message:"Data got successfully",data:data})

    }catch(err){
        res.status(500).json({result:false,message:err.message})  
    }

};



const sliderImages_list=async(req,res)=>{
    try{
        const data=await sliderModel.find({});
        if(!data || data.length===0){
            return res.status(404).json({result:false,message:"Record not found"})
        }
        res.status(200).json({result:true,message:"Slider got successfully",data:data})

    }catch(err){
        res.status(500).json({result:false,message:err.message})
    }
};



const offerList = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(401).json({ result: false, message: "userId is required" });
        }

        const today_date = new Date();

        // Fetch all offers
        const data = await offerModel.find({});
        if (!data || data.length === 0) {
            return res.status(404).json({ result: false, message: "Record not found" });
        }

        // Filter out expired offers
        const filterData = data.filter(item => {
            const expire_date = new Date(item.expire_date);
            return expire_date >= today_date;
        });

        if (filterData.length === 0) {
            return res.status(404).json({ result: false, message: "No active offers found" });
        }

        // Get all claimed offers by the user
        const claims = await claimModel.find({ userId });
        const claimedOfferIds = claims.map(claim => claim.offerId.toString());

        
        // Get all scratch offers by the user
        const scratch = await scratchOfferModel.find({ userId });
        const scratchOfferIds = scratch.map(claim => claim.offerId.toString());

        // Add a status field indicating if the offer has been claimed
        const offersWithStatus = filterData.map(item => {
            return {
                ...item._doc,
                status: !claimedOfferIds.includes(item._id.toString()),
                scratch_status:!scratchOfferIds.includes(item._id.toString()) // true if not claimed, false if claimed
            };
        });

        res.status(200).json({ result: true, message: "Data retrieved successfully", data: offersWithStatus });

    } catch (err) {
        res.status(500).json({ result: false, message: err.message });
    }
};




const offerClaim=async(req,res)=>{
    try{
        const {userId,offerId}=req.body;
        if(!userId || !offerId){
            return res.status(401).json({result:false,message:"userId and offerId  are required"})
        }

        const insert=new claimModel({userId,offerId});
        await insert.save();
        res.status(200).json({result:true,message:"Offer claim added successfully"});

    }catch(err){
        res.status(500).json({result:false,message:err.message})
    }

};



const offerClaimList=async(req,res)=>{
    try{
        const {userId}=req.body;
        if(!userId){
            return res.status(401).json({result:false,message:"userId is required"})
        }

        const data=await claimModel.find({userId}).populate('userId offerId').sort({createdAt:-1});
        if(!data || data.length===0){
            return res.status(404).json({result:false,message:"Record not found"})
        }
   
        res.status(200).json({result:true,message:"Offer claim list got successfully",data:data});

    }catch(err){
        res.status(500).json({result:false,message:err.message})
    }

};



const scratchOffer=async(req,res)=>{
    try{
        const {userId,offerId}=req.body;
      
        if(!userId || !offerId){
            return res.status(404).json({result:false,message:"userId,offerId"});
        }
        const insert=new scratchOfferModel({userId,offerId});
        await insert.save();
        res.status(200).json({result:true,message:"Scratched successfully"})

    }catch(err){
        res.status(500).json({result:false,message:err.message});
    }

};





module.exports={
    userLogin,
    userGetData,
    updateUserProfile,
    contactusList,
    aboutusList,   
    scratchList,
    couponList,
    scratchCard,
    buycoupon,
    redeemCoinsList,
    sliderImages_list,
    offerList,
    offerClaim,
    offerClaimList,
    scratchOffer,
    

};