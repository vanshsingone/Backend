//require('dotenv').config({path:'/env'})
import dotenv from "dotenv"
import connetDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path: './.env'
})


connetDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () =>{
        console.log(`Server is running at port : ${process.env.PORT}`);
        
    }) 
})
.catch((error) => {
    console.log("MONGO db connection failed !!!",error);
    
})



/*
import express from "express"
const app = express()


( async () => {
    try {
       await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
       app.on("error", (error)=> {
        console.log("ERROR:",error);
        throw error
        
       })

       app.listen(process.env.PORT, () => {
        console.log(`Appp is listening on port ${process.env.PORT}`);
        
       })
    } catch (error) {
        console.log("ERROR",error);
        throw error
        
    }
})()
    */