const express=require("express");
const router = express(); 
const userController=require("./../controllers/userController");
const auth=require("./../middlewares/userAuth");
const multer=require('multer');

//user multer here
const storage=multer.diskStorage({
    destination:'uploads',
    filename:(req,file,cb)=>{
        cb(null,file.originalname);

    },

});

const upload=multer({
    storage:storage,
    fileFilter:((req,file,callback)=>{
        if(file.mimetype=='Image/png' ||
            file.mimetype == "image/jpg" ||
                 file.mimetype == "image/jpeg"||
                 file.mimetype == "text/csv"  ||
				 file.mimetype == "application/pdf" ||
				 file.mimetype == "audio/mpeg" || 
				 file.mimetype == "video/mp4" 

        ){
        callback(null,true)
}else{
    console.log("only png,jpeg,jpg,csv,pdf,mp4,mpeg file supported");
    callback(null,false)

}
    }),
    limits:{
        fileSize:100000000//100 mb
    }

});


//set url
router.post("/userLogin",userController.userLogin);
router.post("/userGetData",auth,userController.userGetData);
router.post("/updateUserProfile",upload.single('userProfile'),auth,userController.updateUserProfile);
router.get("/contactusList",auth,userController.contactusList);
router.get("/aboutusList",auth,userController.aboutusList);
router.post("/scratchList",auth,userController.scratchList);
router.post("/couponList",auth,userController.couponList);
router.post("/scratchCard",auth,userController.scratchCard);
router.post("/buycoupon",auth,userController.buycoupon);
router.post("/redeemCoinsList",auth,userController.redeemCoinsList);
router.get("/sliderImages_list",auth,userController.sliderImages_list);
router.post("/offerList",auth,userController.offerList);
router.post("/offerClaim",userController.offerClaim);
router.post("/offerClaimList",userController.offerClaimList);
router.post("/scratchOffer",userController.scratchOffer);



module.exports=router;