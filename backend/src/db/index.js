import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB=async()=>{
    try{ 
      const mongodbInstance= await mongoose.connect(`${process.env.MONGODB_URI}/seyon`);
       console.log("MongoDB connected ",mongodbInstance.connection.host);
       
    }catch(err){
         console.log("Mongodb connection failed",err);
         process.exit(1);
         
    }
};

export {connectDB}