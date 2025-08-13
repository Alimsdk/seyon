import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
     name:{
        type:String,
        required:[true,"Name is Required"],
        minLength:[3,"Name Should be at least 3 letters"]
     },
     phone:{
        type:String,
        required:[true,"Phone Number is Required"],
         match: [/^(?:\+8801[0-9]{9}|01[0-9]{9})$/, 'Please enter a valid Bangladeshi phone number'],
         unique:[true,"Phone number already exists"]
     },
     email:{
        type:String,
     },
     role:{
      type:String,
      enum:["user","admin"],
      default:"user"
     },
     address:{
        division:{
            type:String,
            required:true,
             enum: ['Dhaka', 'Chattogram', 'Khulna', 'Rajshahi', 'Barishal', 'Sylhet', 'Rangpur', 'Mymensingh']
        },
        district:{
            type:String,
            required:true
        },
        exactAddress:{
            type:String,
            required:true,
            trim:true
        }
     },
     password:{
      type:String,
      required:[true,"Password field is Required"]
     },
     avatar:{
      type:String,
      default:null
     },
     refreshToken:{
      type:String
     }
},{timestamps:true});

// methods & functionalities

userSchema.pre("save",async function(next){
   if(!this.isModified("password")){
      return next();
   }

  try{

   this.password = await bcrypt.hash(this.password,10);

  next();

  }catch(err){
    next(err);
  }
});

userSchema.methods.isPasswordCorrect=async function(password){
   console.log(password);
   
   return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken=function(){
   return jwt.sign({
      _id:this._id,
      name:this.name,
      phone:this.phone,
      
   },
   process.env.ACCESS_TOKEN_SECRET,
   {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
   }
    );
}

userSchema.methods.generateRefreshToken=function(){
   return jwt.sign({
      _id:this._id
   },
   process.env.REFRESH_TOKEN_SECRET,
   {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
   }
   );
}

export const User = mongoose.model("user",userSchema) ;