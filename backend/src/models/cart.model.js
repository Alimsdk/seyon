import mongoose from "mongoose";

const cartSchema=new mongoose.Schema({

},{timestamps:true});


export const Cart = mongoose.model("cart",cartSchema);