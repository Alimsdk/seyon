import { app } from "./app.js";
import { connectDB } from "./db/index.js";

const PORT = process.env.PORT || 8000;

connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log("Listening to PORT",PORT);
        
    });
       
}).catch((err)=>{
    console.log("Something went wrong while connecting Database",err);
    
});