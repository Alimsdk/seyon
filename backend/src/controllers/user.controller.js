import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const generateAccessAndRefreshToken=async(userId)=>{
  try{
      const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({validateBeforeSave:false});

    return {accessToken,refreshToken};

  }catch(err){
    throw new ApiError(500,"Something went wrong while generating access & refresh token")
  }

}

const registerNewUser=asyncHandler(async(req,res)=>{
    const {name,phone,email,address,password}=req.body;
    
   if([name,phone,email,address,password].some((field)=> String(field || "").trim() === "")){
       throw new ApiError(404,"All Fields are required");
   }

   const existedUser =await User.findOne({phone});

   if(existedUser){
    throw new ApiError(409,"User with this phone number exists!");
   }

   const user= await User.create({name,phone,email,address,password});

   const createdUser=await User.findById(user._id).select("-password -refreshToken");

   if(!createdUser){
    throw new ApiError(500,"Something went wrong while registering user!");
   }

   return res.status(201).json(
    new ApiResponse(200,createdUser,"User Registered Successfully!")
   );


});

const loginUser=asyncHandler(async(req,res)=>{
    const {phone,password}=req.body;

    if(!phone || !password){
      throw new ApiError(400,"Both Phone Number & Password is Required!");
    };

    const user=await User.findOne({phone});

    if(!user){
        throw new ApiError(404,"User with this Phone Number doesnt exits!");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new ApiError(401,"Password doesnt match with phone number")
    }

    const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id);

    const loggedInUser= await User.findById(user._id).select("-password -refreshToken");

    const options={
        httpOnly:true,
        secure:true
    }

    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(200,{
            user: loggedInUser,accessToken,refreshToken
        },
       "User LoggedIn Successfully!"  
    )
    )
});

const logOut=asyncHandler(async(req,res)=>{
   await User.findByIdAndUpdate(
    req.user._id, // middleware lekha baki
    {
        $unset:{
            refreshToken:1
        }
    },
    {
        new:true //It tells Mongoose to return the updated document instead — after applying your changes.
    }
   );

   const options={
    httpOnly:true,
    secure:true
   }

   return res.status(200)
   .clearCookie("accessToken",options)
   .clearCookie("refreshToken",options)
   .json(new ApiResponse(200,{},"Logged Out Successfully!"))
});

export {registerNewUser,loginUser,logOut}