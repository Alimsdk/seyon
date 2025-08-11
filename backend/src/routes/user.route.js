import { Router } from "express";
import { changeUserPassword, loginUser, logOut, refreshAccessToken, registerNewUser } from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";


const router=Router();

router.route("/register").post(registerNewUser);

router.route("/login").post(loginUser);

router.route("/logout").post(verifyJwt,logOut);

router.route("/refresh-token").post(refreshAccessToken);
//no need of verifyJwt as it will verify accessToken which is already expired 
// so it will create a problem ; moreover its not a private route so we need to verify;

router.route("/change-password").post(verifyJwt,changeUserPassword);

export default router;