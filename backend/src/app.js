import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import productRouter from "./routes/product.route.js";

const app=express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

// ---

app.use("/api/v1/users",userRouter);
app.use("/api/v1/products",productRouter);

export {app}