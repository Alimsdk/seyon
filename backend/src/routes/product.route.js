import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";
import { createNewProduct, deleteSingleProduct, getAllProducts, getSingleProductDetail, updateSingleProduct } from "../controllers/product.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router=Router();

router.route("/create-product").post(verifyJwt,isAdmin,upload.array("media",10),createNewProduct);

router.route("/get-products").get(getAllProducts);

router.route("/product/:slug").get(getSingleProductDetail);

router.route("/update-product/:productId").patch(verifyJwt,isAdmin,updateSingleProduct);

router.delete("/delete/:productId",verifyJwt,isAdmin,deleteSingleProduct);

export default router;