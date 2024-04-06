import mongoose from "mongoose";

const MONGO_URL = process.env.MONGO_URL;
mongoose.Promise = Promise;

export const dbConnect = () => {
  mongoose.connect(MONGO_URL);
  mongoose.connection.on("connected", () => {
    console.log("Connected");
  });
  mongoose.connection.on("error", (error: Error) => {
    console.log("err", error);
  });
};
