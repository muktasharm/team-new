
const {
    userModel,
    contactusModel,
    aboutusModel,
    scratchModel,
    couponModel,
    buyCouponModel,
    sliderModel,
    offerModel,
    claimModel,


}=require("./../models/schemaModels");
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
require('dotenv').config()
const securect_key=process.env.securect_key;


//make reuseable function
function generateOfferCode(length=8){
    let randomNumber='0123456789 ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let offerCode='';

//for loop
for (let i=0; i<length; i++){
   const  offercodeIndex= Math.floor(Math.random() * (randomNumber.length));
   offerCode += randomNumber[offercodeIndex];

}
return offerCode;

};



//user register
const userRegister=async(req,res)=>{
    try{
        const {email,password,personName,phone,dob}=req.body;
        if(!email || !password){
            return res.status(404).json({result:false,message:"required fields are email,password,personName,phone,dob"})
        }
        if(!req.file){
            return res.status(404).json({result:false,message:"required field is userProfile"}) 
        }
        const data=await userModel.findOne({email});
        if(data){
            return res.status(404).json({result:false,message:"Email is already exists"})
        }
        //hashing password
        const hashPassword=await bcrypt.hash(password,10);
        const  insertUser=new userModel({email,password:hashPassword,personName,phone,dob,userProfile:req.file.filename})
         const user=await insertUser.save();
         res.status(200).json({result:true,message:"User registered successfullly",data:user})
    }catch(err){
        res.status(500).json({result:false,message:err.message});
    }

};


const userList=async(req,res)=>{
    try{
        const userData=await userModel.find({}).sort({createdAt:-1});
        if(!userData || userData.length===0){
            return res.status(404).json({result:false,message:"Records not found"});
        }
        res.status(200).json({result:false,message:"User list got successfully",data:userData})

    }catch(err){
        res.status(500).json({result:false,message:err.message});
    }

};

const adminLogin=async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(404).json({result:false,message:"Required parameters are email and password"})
        }
        const user=await userModel.findOne({email});
        if(!user || !(user.type==="Admin")){
            return res.status(400).json({result:false,message:"Please enter correct email"})
        }
        const matchPassword=await bcrypt.compare(password,user.password);
        if(!matchPassword){
            return res.status({result:false,message:"Incorrect password"})
        }
        //generate token
        const token =jwt.sign({user},securect_key,{expiresIn:'1h'});
        res.status(200).json({result:true,message:"Admin logined successfully",data:user,token})
        

    }catch(err){
        res.status(500).json({result:false,message:err.message})
    }

};


const addContactus=async(req,res)=>{
    try{
        const{clientName,
            phone,
            email,
            whatsappNumber}=req.body;
            if(!phone || !clientName || !email || !whatsappNumber){
                return res.status(404).json({result:false,message:"Required fields are phone,email,whatsappNumber,clientName"})
            }
            const data=await contactusModel.findOne({});
            if(data){
                await contactusModel.findOneAndUpdate({},req.body,{new:true});
                res.status(200).json({result:true,message:"Data updated successfully"})
            }else{
                const insertData= new contactusModel(req.body);
                await insertData.save();
                res.status(200).json({result:true,message:"Data added successfully"})
            }

    }catch(err){
        res.status(500).json({result:false,message:err.message})
    }

};


const addAboutus=async(req,res)=>{
    try{
        const{title,text}=req.body;
            if(!title || !text){
                return res.status(404).json({result:false,message:"Required fields are title,text"})
            }
            const data=await aboutusModel.findOne({});
            if(data){
                await aboutusModel.findOneAndUpdate({},req.body,{new:true});
                res.status(200).json({result:true,message:"Data updated successfully"})
            }else{
                const insertData= new aboutusModel(req.body);
                await insertData.save();
                res.status(200).json({result:true,message:"Data added successfully"})
            }

    }catch(err){
        res.status(500).json({result:false,message:err.message})
    }

};




const contactusList=async(req,res)=>{
    try{
        const data=await contactusModel.findOne({});
        if(!data || !data.length===0){
return res.status(404).json({result:false,message:"Data not found"})
        }else{
            res.status(200).json({result:true,message:"Record got successfully",data:data})
        }

    }catch(err){
        res.status(500).json({result:false,message:err.message})
    }
}


const aboutusList=async(req,res)=>{
    try{
        const data=await aboutusModel.findOne({});
        if(!data || !data.length===0){
return res.status(404).json({result:false,message:"Data not found"})
        }else{
            res.status(200).json({result:true,message:"Record got successfully",data:data})
        }

    }catch(err){
        res.status(500).json({result:false,message:err.message})
    }
}


// create scratch
const addScratch=async(req,res)=>{
    try{
        const {coins,date}=req.body;
        if(!coins || !date){
            return res.status(404).json({result:false,message:"required fields are coins and date"})
        }
        const validation=await scratchModel.findOne({date});
        if(validation){
            return res.status(404).json({result:false,message:"Already data exists of this date"})
        }
        const insert_data=new scratchModel({coins,date});
        await insert_data.save();
        res.status(200).json({result:true,message:"Data added successfully"})

    }catch(err){
        res.status(500).json({result:false,message:err.message});
    }
};


const  addCoupon=async(req,res)=>{
    try{
        const {title,description,mrpCoins,saleCoins,expire_date}=req.body;
        if(!title || !expire_date){
            return res.status(404).json({result:false,message:"required fields are title,description,mrpCoins,saleCoins,expire_date,image"})
        }
        if(!req.file){
            return res.status(404).json({result:false,message:"image is required"})
        }
        const discountPercantage=Number(Number(Number(mrpCoins - saleCoins)*100)/mrpCoins)
        const insert_data=new couponModel({
            title,
            description,
            mrpCoins,
            saleCoins,
            expire_date,
            image:req.file.filename,
            discountPercantage
        });
        await insert_data.save();
        res.status(200).json({result:true,message:"Data added successfully"})

    }catch(err){
        res.status(500).json({result:false,message:err.message});
    }

};


const scratchList=async(req,res)=>{
    try{
        const data =await scratchModel.find({}).sort({createdAt:-1});
        if(!data || data.length===0){
            return res.status(404).json({result:false,message:"Record is not found"})
        }
        res.status(200).json({result:true,message:"Record got successfully",data:data})

    }catch(err){
        res.status(500).json({result:false,message:err.message});
    }
};



const couponList=async(req,res)=>{
    try{
        const data =await couponModel.find({}).sort({createdAt:-1});
        if(!data || data.length===0){
            return res.status(404).json({result:false,message:"Record is not found"})
        }
        res.status(200).json({result:true,message:"Record got successfully",data:data})

    }catch(err){
        res.status(500).json({result:false,message:err.message});
    }
};




const orderCouponList=async(req,res)=>{
    try{
        
        const data=await buyCouponModel.find({}).populate('userId couponId').sort({createdAt:-1});
        if(!data || data.length===0){
            return res.status(404).json({result:false,message:"Records not found"})
        }
      
        res.status(200).json({result:true,message:"Data got successfully",data:data})

    }catch(err){
        res.status(500).json({result:false,message:err.message})  
    }

};


const dashboard_data=async(req,res)=>{
    try{
        const [users,coupons,orders]=await Promise.all([
           userModel.countDocuments(),
            couponModel.countDocuments(),
           buyCouponModel.countDocuments()
        ])
        const data={
            users:users || 0,
            coupons:coupons || 0,
            orders:orders || 0
        }
        res.status(200).json({result:true,message:"Data got successfully",data:data})

    }catch(err){
        res.status(500).json({result:false,message:err.message});
    }

};



const addSliderImages=async(req,res)=>{
    try{
        const {title}=req.body;
        if(!req.file){
            return res.status(404).json({result:false,message:"image is required and title is opetional"})
        }
        const insert_data=new sliderModel({image:req.file.filename,title});
        await insert_data.save();
        res.status(200).json({result:true,message:"Slider add successfully"})

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



const updateSliderImages=async(req,res)=>{
    try{
        const {ID,title}=req.body;
        if(!ID){
            return res.status(404).json({result:false,message:"ID is required "})
        }
        if(!req.file){
            return res.status(404).json({result:false,message:"image is required and title is opetional"})
        }
       await  sliderModel.findByIdAndUpdate({_id:ID},{image:req.file.filename,title},{new:true});
        res.status(200).json({result:true,message:"Slider updated  successfully"})

    }catch(err){
     res.status(500).json({result:false,message:err.message})
    }
};


const deleteSliderImages=async(req,res)=>{
    try{
        const {ID}=req.body;
        if(!ID){
            return res.status(404).json({result:false,message:"ID is required "})
        }
       
        await  sliderModel.findByIdAndDelete({_id:ID});
        res.status(200).json({result:true,message:"Slider deleted  successfully"})

    }catch(err){
     res.status(500).json({result:false,message:err.message})
    }
};




const updateCoupon=async(req,res)=>{
    try{
        const {couponId,title,image,description,mrpCoins,saleCoins,expire_date}=req.body;
        if(!couponId){
            return res.status(404).json({result:false,message:"required field is couponId and optional are ,title,description,mrpCoins,saleCoins,expire_date"})
        }
       
        const discountPercantage=Number(Number(Number(mrpCoins - saleCoins)*100)/mrpCoins)
        const updatedObject={
            title,
            description,
            mrpCoins,
            saleCoins,
            expire_date,
            image,
            discountPercantage
        };
        if(req.file){
            updatedObject.image=req.file.filename;
        }
        await couponModel.findByIdAndUpdate({_id:couponId},updatedObject,{new:true});
        res.status(200).json({result:true,message:"Data updated successfully"})

    }catch(err){
        res.status(500).json({result:false,message:err.message});
    }

};


const deleteCoupon=async(req,res)=>{
    try{
        const {couponId}=req.body;
        if(!couponId){
            return res.status(404).json({result:false,message:"couponId is required "})
        }
       
        await  couponModel.findByIdAndDelete({_id:couponId});
        res.status(200).json({result:true,message:"Coupon deleted  successfully"})

    }catch(err){
     res.status(500).json({result:false,message:err.message})
    }
};



const deleteScratch=async(req,res)=>{
    try{
        const {ID}=req.body;
        if(!ID){
            return res.status(404).json({result:false,message:"ID is required "})
        }
       
        await  scratchModel.findByIdAndDelete({_id:ID});
        res.status(200).json({result:true,message:"Data deleted  successfully"})

    }catch(err){
     res.status(500).json({result:false,message:err.message})
    }
};



const getCoupon=async(req,res)=>{
    try{
        const {couponId}=req.body;
        if(!couponId){
            return res.status(404).json({result:false,message:"couponId is required "})
        }
       
        const data =await  couponModel.findById({_id:couponId});
        res.status(200).json({result:true,message:"Coupon got  successfully",data:data})

    }catch(err){
     res.status(500).json({result:false,message:err.message})
    }
};



const getSliderImages=async(req,res)=>{
    try{
        const {ID}=req.body;
        if(!ID){
            return res.status(404).json({result:false,message:"ID is required "})
        }
       
        const data=await  sliderModel.findById({_id:ID});
        res.status(200).json({result:true,message:"Slider got successfully",data:data})

    }catch(err){
     res.status(500).json({result:false,message:err.message})
    }
};





const addOffer=async(req,res)=>{
    try{
        const {title,expire_date,description}=req.body;
        if(!title || !expire_date){
            return res.status(404).json({result:false,message:"title,description,expire_date,offerImage"})
        }
        
        if(!req.file){
            return res.status(404).json({result:false,message:"offerImage is  required and title is opetional"})
        }
        let code=generateOfferCode(8);

        const insert_data=new offerModel({code,expire_date,description,offerImage:req.file.filename,title});
        await insert_data.save();
        res.status(200).json({result:true,message:"Offer added successfully"})

    }catch(err){
     res.status(500).json({result:false,message:err.message})
    }
};




const offerList=async(req,res)=>{
    try{
        const data=await offerModel.find({}).sort({createdAt: -1});
        if(!data || data.length===0){
            return res.status(404).json({result:false,message:"Record not found"})
        }
        res.status(200).json({result:true,message:"Offer got successfully",data:data})

    }catch(err){
     res.status(500).json({result:false,message:err.message})
    }
};


const getOffer=async(req,res)=>{
    try{
        const {offerId}=req.body;
        if(!offerId){
            return res.status(404).json({result:false,message:"offerId is required"})
        }
        const data=await offerModel.findById({_id:offerId});
        if(!data || data.length===0){
            return res.status(404).json({result:false,message:"Record not found"})
        }
        res.status(200).json({result:true,message:"Offer got successfully",data:data})

    }catch(err){
     res.status(500).json({result:false,message:err.message})
    }
};


const deleteOffer=async(req,res)=>{
    try{
        const {offerId}=req.body;
        if(!offerId){
            return res.status(404).json({result:false,message:"offerId is required"})
        }
        await offerModel.findByIdAndDelete({_id:offerId});
        res.status(200).json({result:true,message:"Offer deleted successfully"})

    }catch(err){
     res.status(500).json({result:false,message:err.message})
    }
};




const updateOffer=async(req,res)=>{
    try{
        const {offerId,title,expire_date,description}=req.body;
        if(!offerId ){
            return res.status(404).json({result:false,message:"offerId is required and optional are title,description,expire_date,offerImage "})
        }
        
       const objects={
        title,
        expire_date,
        description,

       };
       if(req.file){
        objects.offerImage=req.file.filename;
       }

      await offerModel.findByIdAndUpdate({_id:offerId},objects,{new:true});
       
        res.status(200).json({result:true,message:"Offer updated successfully"})

    }catch(err){
     res.status(500).json({result:false,message:err.message})
    }
};



const claimOfferList=async(req,res)=>{
    try{ 
     const data=await claimModel.find({}).populate('userId offerId').sort({createdAt:-1});
     if(!data || data.length===0){
        return res.status(401).json({result:false,message:"Record not found"})
     }
        res.status(200).json({result:true,message:"Offer updated successfully",data:data})

    }catch(err){
     res.status(500).json({result:false,message:err.message})
    }
};




module.exports={
    userRegister,
    userList,
    adminLogin,
    addContactus,
    addAboutus,
    contactusList,
    aboutusList,
    addScratch,
    addCoupon,
    scratchList,
    couponList,
    orderCouponList,
    dashboard_data,
    addSliderImages,
    sliderImages_list,
    updateSliderImages,
    deleteSliderImages,
    updateCoupon,
    deleteCoupon,
    deleteScratch, 
    getCoupon,
    getSliderImages,
    addOffer,
    offerList,
    getOffer,
    deleteOffer,
    updateOffer,
    claimOfferList,

}