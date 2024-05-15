require("dotenv").config();
import express, { json } from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import router from "./router";
import { dbConnect } from "./db";
import { firebaseInitialize } from "./helpers";

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

server.listen(process.env.PORT, () => {
  console.log("Server running ");
});

firebaseInitialize();

app.use("/", router());
