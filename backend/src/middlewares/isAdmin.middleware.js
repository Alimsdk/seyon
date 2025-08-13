import { ApiError } from "../utils/ApiError.js";

const isAdmin = async(req,_,next)=>{
    if(req.user?.role !== "admin"){
        throw new ApiError(403,"Only Admin can perform this action!");
    }

    next();
}

export {isAdmin};