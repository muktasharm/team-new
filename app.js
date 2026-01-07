//import dependancies
const express=require("express");
const app= express();
require('dotenv').config();
const userRouter=require("./routers/userRouter");
const adminRouter=require("./routers/adminRouter");
const ejs=require('ejs');
const path=require('path');
const cors=require('cors');


// middlewere setup
app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));
const filePath = path.join(__dirname, '/uploads');
app.set(path.join(__dirname, '/uploads'));
app.engine('html', require('ejs').renderFile);


//declear middleware
app.use(express.json());
app.use("/laxmi/api",userRouter);
app.use("/laxmi/admin",adminRouter);
//use cors
app.use(cors());




//module exprots
module.exports=app;