import multer from "multer";
import fs from "fs";

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "./uploads";
    // Create the directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const splitName = file.originalname.split(".");
    const ext = splitName[splitName.length - 1];
    const fileName = `${crypto.randomUUID()}.${ext}`;
    cb(null, fileName);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2_000_000 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

    const fileSize = parseInt(req.headers["content-length"])
    if (fileSize > 2_000_000) {
      const error = new Error("File size too large. Max 1MB.");
      error.code = "LIMIT_FILE_SIZE";
      return cb(error, false);
    }

    if (!allowedTypes.includes(file.mimetype)) {
      const error = new Error("Invalid file type");
      error.code = "INVALID_FILE_TYPE";
      return cb(error, false);
    }

    cb(null, true);
  },
});


export { storage, upload };
