import { Router } from "express";
import { loginUser, logOut, registerNewUser } from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";


const router=Router();

router.route("/register").post(registerNewUser);

router.route("/login").post(loginUser);

router.route("/logout").post(verifyJwt,logOut);

export default router;