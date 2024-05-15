import * as admin from "firebase-admin";
import { configData } from "../config";

export const firebaseInitialize = () => {
  admin.initializeApp({
    credential: admin.credential.cert(configData.fireBaseServiceAccount),
  });
};
