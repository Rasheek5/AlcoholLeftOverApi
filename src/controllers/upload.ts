import express from "express";
import { handleResponse } from "../helpers";

export const uploadImage = (req: express.Request, res: express.Response) => {
  try {
    if (!req.file) {
      return handleResponse({
        resRef: res,
        errorMessage: "No files were uploaded",
        hasError: true,
      });
    }

    return handleResponse({
      resRef: res,
      result: req.file,
      statusMessage: "File Upload Successfully",
      hasError: false,
    });
  } catch (err) {
    return handleResponse({
      resRef: res,
      hasError: true,
    });
  }
};
