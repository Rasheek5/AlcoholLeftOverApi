import express from "express";
import { triggerNotification } from "../controllers";

export default (router: express.Router) => {
  router.post("/notification/push", triggerNotification);
};
