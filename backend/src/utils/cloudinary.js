import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary=async(localFilePath)=>{
    try {
        if(!localFilePath) return null;
         
         
        try {
            const response=await cloudinary.uploader.upload(localFilePath,{
                resource_type:"auto"
            });
              console.log("file is uploaded on cloudinary",response.url);
              fs.unlinkSync(localFilePath);
                return response;
        } catch (error) {
            console.log("upload error caught",error);
            
        }

        
    } catch (error) {
        fs.unlinkSync(localFilePath);
        return null;
    }
};

const uploadMultipleOnCloudinary=async(files)=>{
   try {
       const uploads=await Promise.all(
        files.map(file=>{
            const resourceType=file.mimetype.startsWith("video") ? "video" : "image";
            // file.mimetype -> image/jpg ; comes from multer;
            return cloudinary.uploader.upload(file.path,{resource_type:resourceType});
        })
       );

       files.forEach(file=> fs.unlinkSync(file.path));

       return uploads.map(res=>({
        type:res.resource_type,
        public_id:res.public_id,
        url:res.secure_url
       }))


   } catch (error) {
    console.log("cloudinary multiple upload error",error);
    return [];
   }
}

export {uploadOnCloudinary,uploadMultipleOnCloudinary}