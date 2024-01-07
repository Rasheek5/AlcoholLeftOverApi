import { checkUserTypeIsValid, handleResponse } from "../helpers";
import {
  getUserById,
  createLeftOver,
  getLeftOverByUploadedBy,
  getLeftOverByCustomerId,
  updatedLeftOverById,
  deleteLeftOverById,
} from "../db";
import express from "express";
import { USER_TYPE_INVALID_ERROR } from "../constants";

export const uploadLeftOver = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const {
      image,
      customerId,
      uploadedBy,
      comments,
      brandName,
      quantity,
      expiryDate,
      forEdit,
      _id,
    } = req.body;

    if (
      !image ||
      !customerId ||
      !uploadedBy ||
      !comments ||
      !brandName ||
      !quantity ||
      !expiryDate
    )
      return handleResponse({
        resRef: res,
        hasError: true,
        statusMessage: "Please Share All The Required Fields",
      });

    const user = await getUserById(customerId);

    if (!user)
      return handleResponse({
        resRef: res,
        hasError: true,
        statusMessage: "No Customer Found For Given Customer Id",
      });

    const sendRes = (result: any) => {
      return handleResponse({
        resRef: res,
        result: result,
        hasError: false,
        statusMessage: `Leftover Data ${forEdit ? "Updated" : "Uploaded"}`,
      });
    };

    const data = {
      comments,
      image,
      customerId,
      uploadedBy,
      customerName: `${user.firstName} ${user.lastName}`,
      brandName,
      quantity,
      expiryDate,
    };

    if (!forEdit) {
      const leftOver = await createLeftOver(data);
      return sendRes(leftOver);
    }

    if (!_id) {
      return handleResponse({
        resRef: res,
        hasError: true,
        statusMessage: "You Have To Pass The ID",
      });
    }

    const updatedData = await updatedLeftOverById(_id, data);

    if (!updatedData) {
      return handleResponse({
        resRef: res,
        hasError: true,
      });
    }

    return sendRes(updatedData);
  } catch (err) {
    return handleResponse({
      resRef: res,
      hasError: true,
    });
  }
};

export const getLefoverByUserId = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { userId, userType, searchTerm } = req.query;

    if (!userId || !userType)
      return handleResponse({
        resRef: res,
        hasError: true,
        errorMessage: "User Id and User Type Required",
      });

    if (!checkUserTypeIsValid(userType)) {
      return handleResponse({
        hasError: true,
        resRef: res,
        errorMessage: USER_TYPE_INVALID_ERROR,
      });
    }

    const data =
      userType == "customer"
        ? await getLeftOverByCustomerId(
            userId?.toString(),
            searchTerm?.toString()
          )
        : await getLeftOverByUploadedBy(
            userId?.toString(),
            searchTerm?.toString()
          );

    if (!data || !data?.length)
      return handleResponse({
        resRef: res,
        errorMessage: "No Record Found",
        hasError: true,
      });
    return handleResponse({
      resRef: res,
      result: data,
      hasError: false,
    });
  } catch (err) {
    return handleResponse({
      resRef: res,
      hasError: true,
    });
  }
};

export const deleteLeftOver = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.query;

    if (!id) {
      return handleResponse({
        resRef: res,
        hasError: true,
        statusMessage: "You Have To Pass The ID",
      });
    }

    const data = await deleteLeftOverById(id?.toString());

    if (!data) {
      return handleResponse({
        resRef: res,
        hasError: true,
      });
    }
    return handleResponse({
      resRef: res,
      hasError: false,
      result: data,
      statusMessage: "Left Over Deleted",
    });
  } catch (err) {
    return handleResponse({
      resRef: res,
      hasError: true,
    });
  }
};
