import multer from "multer";
import { storage } from "../storage";

export const multerUpload = multer({ storage: storage });
