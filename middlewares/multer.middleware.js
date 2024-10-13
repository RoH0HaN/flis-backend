import multer from "multer";
import { v4 as uuidv4 } from "uuid"; // To generate unique file names

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${uuidv4()}`;
    const fileExtension = file.originalname.split(".").pop(); // Get file extension
    cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExtension}`);
  },
});

export const upload = multer({ storage: storage });
