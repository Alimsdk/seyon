import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadMultipleOnCloudinary } from "../utils/cloudinary.js";

const createNewProduct= asyncHandler(async(req,res)=>{
    const {name,category,price,description}=req.body;

    const mediaData = await uploadMultipleOnCloudinary(req.files);
    

    if([name,category,price,description].some((val)=> String(val || "") === " ")){
        throw new ApiError(404,"All fields are required");
    }

    if(!mediaData || mediaData.length === 0){
       throw new ApiError(401,"Product Media is required!");
    };

     const sizes = req.body.sizes ? JSON.parse(req.body.sizes) : [];

     if(!sizes || sizes.length === 0){
        throw new ApiError(401,"Product available sizes are required");
     }

    const product=await Product.create({name,category,price,description,sizes,media:mediaData});
      
    if(!product){
        throw new ApiError(400,"something went wrong while creating product");
    }

    return res.status(201).json(new ApiResponse(200,{product},"product created Successfully"));

    

});

const getAllProducts=asyncHandler(async(req,res)=>{
    const products=await Product.find();

    if(!products || products.length === 0){
       return res.status(404).json(new ApiResponse(404,[],"No Product found"));
    }

    return res.status(201).json(new ApiResponse(201,products,"Products fetched successfully"));
});

const getSingleProductDetail=asyncHandler(async(req,res)=>{
  const {slug}=req.params;

  const productDetails=await Product.findOne({slug});

  if(!productDetails){
    throw ApiError(404,"Product not found") ;
  }

  res.status(200).json(new ApiResponse(200,productDetails,"product details fetched"));
});

const updateSingleProduct=asyncHandler(async(req,res)=>{
    const {productId} = req.params;

    console.log(productId);
    
   const allowedUpdates=["sizes","price"];
   const updates={};

   allowedUpdates.forEach(field=>{
       if(req.body[field] !== "undefined"){
          updates[field] = req.body[field];
       }
   });

  const updatedProduct= await Product.findByIdAndUpdate(productId,updates, { new: true, runValidators: true })

  if (!updatedProduct) throw new ApiError(404, "Product not found");
   

   return res.status(200).json(new ApiResponse(200,{product:updatedProduct},"Product updated Successfully"));
});

const deleteSingleProduct=asyncHandler(async(req,res)=>{
      const {productId}=req.params;

      await Product.findByIdAndDelete(productId);

      return res.status(200).json(new ApiResponse(200,{},"product deleted successfully"))
});



export {createNewProduct,getAllProducts,getSingleProductDetail,updateSingleProduct,deleteSingleProduct};