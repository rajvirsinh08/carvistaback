import multer from "multer";
import path from "path";
// ✅ Use memory storage for Vercel
const imageStorage = multer.memoryStorage();

const imageFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error("Only images (jpeg, jpg, png) are allowed!"));
  }
};

const upload = multer({
  storage: imageStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: imageFilter,
});

export const uploadMultiple = upload.fields([
  { name: "exteriorimage", maxCount: 1 },
  { name: "interiorimage", maxCount: 1 },
  { name: "tyreimage", maxCount: 1 },
]);

// Memory storage for Vercel
const pdfStorage = multer.memoryStorage();

// Memory storage for Vercel

const pdfFileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /pdf/;
  const extname = allowedTypes.test(file.originalname.toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed!"));
  }
};

export const uploadPDF = multer({
  storage: pdfStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: pdfFileFilter,
}).single("inspectionReport");

// ✅ Single profile image upload middleware
export const uploadProfileImage = multer({
  storage: multer.memoryStorage(),
limits: {
    fileSize: 10 * 1024 * 1024, // ⬅️ 10 MB
  },  fileFilter: imageFilter,
}).single("profileImage");
