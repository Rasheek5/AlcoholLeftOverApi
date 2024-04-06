import express from "express";
import { handleResponse, pushNotification } from "../helpers";

export const triggerNotification = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { token, title, body, imageUrl } = req?.body;

    if (!token || !title || !body) {
      return handleResponse({
        resRef: res,
        hasError: true,
        errorMessage: "Pass All Required Fields",
      });
    }

    const data = await pushNotification(
      token?.toString(),
      title?.toString(),
      body?.toString(),
      imageUrl ? imageUrl?.toString() : null
    );

    if (data) {
      return handleResponse({
        resRef: res,
        hasError: false,
        statusMessage: "Push Notification Success",
      });
    }
    return handleResponse({
      resRef: res,
      hasError: true,
    });
  } catch (err) {
    return handleResponse({
      resRef: res,
      hasError: true,
    });
  }
};
