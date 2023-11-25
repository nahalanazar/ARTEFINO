import multer from "multer";
import path from "path";


const profileImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Public/UserProfileImages")
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
  }
});

// Multer configuration for product images
const productImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Public/ProductImages");
  },
  filename: (req, file, cb) => {
    const fileName = `product_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, fileName);console.log("fileName", fileName)
  },
  
});

const fileFilter = (req, file, cb) => {

  if (file.mimetype.startsWith("image/")) {  
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed!"), false);
  }

};

export const multerUploadUserProfile = multer({
  storage: profileImageStorage,
  fileFilter: fileFilter,
});

export const multerUploadProductImages = multer({
  storage: productImageStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }
}).array('images', 3) 