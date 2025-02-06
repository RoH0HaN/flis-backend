import { v4 as uuidv4 } from "uuid"; // To generate unique file names
import fs from "fs";
import multer from "multer";

// Ensure the folder exists before saving
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "./public/temp";
    // Check if directory exists
    if (!fs.existsSync(dir)) {
      // Create the directory if it doesn't exist
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${uuidv4()}`;
    const fileExtension = file.originalname.split(".").pop(); // Get file extension
    cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExtension}`);
  },
});

export const upload = multer({ storage: storage });
