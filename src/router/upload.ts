import express from "express";
import { uploadImage } from "../controllers";
import { multerUpload } from "../helpers";

export default (router: express.Router) => {
  router.post("/upload/image", multerUpload.single("image"), uploadImage);
};
