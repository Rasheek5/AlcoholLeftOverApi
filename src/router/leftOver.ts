import express from "express";
import {
  deleteLeftOver,
  getLefoverByUserId,
  uploadLeftOver,
  leftOverScheduler,
} from "../controllers";

export default (router: express.Router) => {
  router.post("/leftOver/upload", uploadLeftOver);
  router.patch("/leftOver/update", uploadLeftOver);
  router.get("/leftOver/getLefoverByUserId", getLefoverByUserId);
  router.delete("/leftOver/delete", deleteLeftOver);
  router.post("/leftOver/scheduler", leftOverScheduler);
};
