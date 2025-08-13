import mongoose, { mongo } from "mongoose";
import slugify from "slugify";

const productSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true,"product name is required"]
    },
    slug:{
        type:String,
        unique:true
    },
    category:{
        type:String,
        enum:["classic-polo","contrast-polo","striped-polo"],
        required:true
    },
    price:{
        type:Number,
        required:true,
        min:0
    },
    discountedPrice:{
        type:Number,
        min:0,
        validate:{
            validator:function(value){
                return value <= this.price;
            }
        }
    },
    media:[
        {
            type:{
                type:String,
                enum:["image","video"],
                required:true
            },
            public_id:{type:String,required:true},
            url:{type:String,required:true}
        }
    ],
    description:{
        type:String,
        required:true
    },
    sizes:[
       { 
        size:{
            type:String,
            enum:["S","M","L","XL","XXL"],
            required:true
        },
        stock:{
            type:Number,
            required:true,
            min:0,
            default:0
        },
        sizeInfo: {
             type: String,
             trim: true,    // optional, trims whitespace
             default: ""    // optional default empty string
        }
    }],
   
},{timestamps:true});



productSchema.pre("validate", async function(next) {
  if (this.name) {
    let baseSlug = slugify(this.name, { lower: true, strict: true });
    let slug = baseSlug;
    let count = 1;

    while (await mongoose.models.Product.findOne({ slug })) {
      slug = `${baseSlug}-${count++}`;
    }

    this.slug = slug;
  }
  next();
});

const Product = mongoose.model("Product", productSchema);

export { Product };
