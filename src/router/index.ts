import express from "express";
import authentication from "./authentication";
import users from "./users";
import leftOver from "./leftOver";
import upload from "./upload";
import notification from "./notification";

const router = express.Router();

export default (): express.Router => {
  authentication(router);
  users(router);
  leftOver(router);
  upload(router);
  notification(router);
  return router;
};
