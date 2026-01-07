const express=require('express');
const router=express();
const adminController=require("./../controllers/adminController");
const multer=require('multer');
const auth=require("./../middlewares/userAuth");

//use multer
const storage=multer.diskStorage({
    destination:"uploads",
    filename:(req,file,cb)=>{
        cb(null,file.originalname)

    },

});

const upload=multer({
    storage:storage,
    fileFilter:((req,file,callback)=>{
        if(file.mimetype=='image/png' ||
            file.mimetype == "image/jpg" ||
                 file.mimetype == "image/jpeg"||
                 file.mimetype == "text/csv"  ||
				 file.mimetype == "application/pdf" ||
				 file.mimetype == "audio/mpeg" || 
				 file.mimetype == "video/mp4" 

        ){
            callback(null,true)
        }else{
            console.log("Only supported formates are pdf,mp4,png,jpeg,jpg,mpeg,csv")
            callback(null,false)
        }

    }),
    limits:{
        fileSize:100000000//1000000 bytes=1mb
    }

});


// set url
router.post("/userRegister",upload.single('userProfile'),auth,adminController.userRegister);
router.post("/userList",auth,adminController.userList);
router.post("/adminLogin",adminController.adminLogin);
router.post("/addContactus",auth,adminController.addContactus);
router.post("/addAboutus",auth,adminController.addAboutus);
router.get("/contactusList",auth,adminController.contactusList);
router.get("/aboutusList",auth,adminController.aboutusList);
router.post("/addScratch",auth,adminController.addScratch);
router.post("/addCoupon",upload.single('image'),auth,adminController.addCoupon);
router.get("/scratchList",auth,adminController.scratchList);
router.get("/couponList",auth,adminController.couponList);
router.get("/orderCouponList",auth,adminController.orderCouponList);
router.get("/dashboard_data",auth,adminController.dashboard_data);
router.post("/addSliderImages",upload.single('image'),auth,adminController.addSliderImages);
router.get("/sliderImages_list",auth,adminController.sliderImages_list);
router.post("/updateSliderImages",upload.single('image'),auth,adminController.updateSliderImages);
router.post("/deleteSliderImages",auth,adminController.deleteSliderImages);
router.post("/updateCoupon",upload.single('image'),auth,adminController.updateCoupon);
router.post("/deleteCoupon",auth,adminController.deleteCoupon);
router.post("/deleteScratch",auth,adminController.deleteScratch);
router.post("/getCoupon",auth,adminController.getCoupon);
router.post("/getSliderImages",auth,adminController.getSliderImages);
router.post("/addOffer",upload.single('offerImage'),auth,adminController.addOffer);
router.get("/offerList",auth,adminController.offerList);
router.post("/getOffer",auth,adminController.getOffer);
router.post("/deleteOffer",auth,adminController.deleteOffer);
router.post("/updateOffer",upload.single('offerImage'),auth,adminController.updateOffer);
router.get("/claimOfferList",auth,adminController.claimOfferList);


module.exports=router;