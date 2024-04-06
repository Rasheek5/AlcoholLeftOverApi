require("dotenv").config();
import express, { json } from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import * as admin from "firebase-admin";
import router from "./router";
import { configData } from "./config";
import { dbConnect } from "./db";

const app = express();

app.use(json());

app.use(
  cors({
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

dbConnect();

server.listen(8080, () => {
  console.log("Server running ");
});

admin.initializeApp({
  credential: admin.credential.cert(configData.fireBaseServiceAccount),
});

app.use("/", router());
