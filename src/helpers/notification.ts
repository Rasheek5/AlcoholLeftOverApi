import * as admin from "firebase-admin";
import { Message } from "firebase-admin/messaging";

export const pushNotification = async (
  token: string,
  title: string,
  body: string,
  imageUrl?: string
) => {
  const message: Message = {
    notification: {
      title,
      body,
    },
    token,
    data: {
      imageUrl,
    },
  };

  return new Promise(async (res, rej) => {
    try {
      const response = await admin.messaging().send(message);
      response ? res("done") : rej();
    } catch (error) {
      rej();
    }
  });
};
