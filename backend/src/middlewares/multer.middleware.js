import multer from "multer";
import path from "path";

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"./public/temp")
    },
    filename:function(req,file,cb){
        const nameWithoutExt = path.basename(file.originalname, path.extname(file.originalname));
        const newFileName = `${file.fieldname}-${nameWithoutExt}-${Date.now()}${path.extname(file.originalname)}`;
        cb(null,newFileName);
    }
});

export const upload=multer({storage});