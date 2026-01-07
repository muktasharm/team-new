const mongoose=require('mongoose');

// user schema
const userSchema=new mongoose.Schema({
    email:String,
    password:String,
    userProfile:String,
    personName:String,
    dob:String,
    phone:Number,
    wallet:Number,
    coins:{
        type:Number,
        default:0
    },
    type:{
        type:String,
        default:'User'
    },
    userStatus:{
        type:Boolean,
        default:false,

    },
    userActStatus:{
        type:Boolean,
        default:true
    }

},{timestamps:true});

//contactus schema
const contactusSchema=new mongoose.Schema({
    clientName:String,
    phone:Number,
    email:String,
    whatsappNumber:Number

});

const aboutusSchema=new mongoose.Schema({
    title:String,
    text:String

});

const scratchSchema=new mongoose.Schema({
    coins:Number,
    date:String,
    status:Boolean,

},{timestamps:true});

const couponSchema=new mongoose.Schema({
    title:String,
    description:String,
    image:String,
    mrpCoins:Number,
    saleCoins:Number,
    discountPercantage:Number,
    expire_date:String,

},{timestamps:true});


const usescratchSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    cardId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'scratch'
    },
    coins:Number,
    date:String

},{timestamps:true});


const couponBuySchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
    },
        couponId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"coupon"
        },
        coins:Number,
},{timestamps:true});


const sliderSchema=new mongoose.Schema({
   title:String,
   image:String,
});

const offerSchema=new mongoose.Schema({
    title:String,
    offerImage:String,
    code:String,
    expire_date:String,
    description:String,

},{timestamps:true});


const claimSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    offerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'offer'
    },
    status:{
        type:Boolean,
        default:true
    },
  
},{timestamps:true});


const scratchOfferSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    offerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'offer'
    },
    

},{timestamps:true});




//models
const userModel=mongoose.model('user',userSchema);
const contactusModel=mongoose.model('contactus',contactusSchema);
const aboutusModel=mongoose.model('aboutus',aboutusSchema);
const scratchModel=mongoose.model('scratch',scratchSchema);
const couponModel=mongoose.model('coupon',couponSchema);
const usescratchModel=mongoose.model('usescratch',usescratchSchema);
const buyCouponModel=mongoose.model("buycoupon",couponBuySchema);
const sliderModel=mongoose.model("slider",sliderSchema);
const offerModel=mongoose.model("offer",offerSchema);
const claimModel=mongoose.model("offerclaim",claimSchema);
const scratchOfferModel=mongoose.model('scratchOffer',scratchOfferSchema);


module.exports={
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

}