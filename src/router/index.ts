import express from "express";
import authentication from "./authentication";
import users from "./users";
import leftOver from "./leftOver";
import upload from "./upload";

const router = express.Router();

export default (): express.Router => {
  authentication(router);
  users(router);
  leftOver(router);
  upload(router);
  return router;
};
