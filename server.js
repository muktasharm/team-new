//import dependancies
const http=require('http');
const app=require("./app");
const server=http.createServer(app);
require("dotenv").config();
const mongoose=require('mongoose');
const db_url=process.env.db_url;
const port=process.env.port;

//connect mongodb database
mongoose.connect(db_url,{

})
.then(()=>{
    console.log("MongoDB database conneted successfully")
})
.catch((err)=>{
    console.log("Database connection test failed",err.message)

});


//connect to server
server.listen(port,err=>{
    if(err){
        console.log(err.message)
    }else{
        console.log("The server is running on port no  number "+`${port}`);
    }

});



