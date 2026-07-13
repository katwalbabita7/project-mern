import multer from "multer";
import fs from "fs";
export const uploder = ()=>{
    const folder = "uploads/";
    const fileSize = 5 * 1024 * 1024;
    console.log(fs.existsSync(folder));
    if(!fs.existsSync(folder)){
        fs.mkdirSync(folder, {recursive:true});
    }
    // * storage
const storage = multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null, folder);
  },
  filename:(req,file,cb)=>{
    const fileName = Date.now() + "_" + file.originalname;
    cb(null,fileName);
  },
});
// * uploads
const upload = multer({ 
    storage,
    limits:{
        fileSize:fileSize,

    },

});  
return upload; 
}