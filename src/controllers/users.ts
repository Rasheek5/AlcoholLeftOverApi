import express from "express";
import { getFullUsers, getUserByUserType } from "../db/users";
import { checkUserTypeIsValid, handleResponse } from "../helpers";
import { USER_TYPE_INVALID_ERROR } from "../constants";

export const getUsers = async (req: express.Request, res: express.Response) => {
  try {
    const { userType } = req.query;

    if (!checkUserTypeIsValid(userType)) {
      return handleResponse({
        hasError: true,
        resRef: res,
        errorMessage: USER_TYPE_INVALID_ERROR,
      });
    }

    const users = userType
      ? await getUserByUserType(userType?.toString())
      : await getFullUsers();

    if (!users || !users?.length)
      return handleResponse({
        hasError: true,
        resRef: res,
        errorMessage: "No Record Found",
      });

    let updatedUsers = users.map((res) => {
      let userData = res;
      delete userData.authentication;
      return userData;
    });

    return handleResponse({
      resRef: res,
      result: updatedUsers,
      statusMessage: updatedUsers?.length
        ? "Users Data Fetch Successfully"
        : "No Record Found",
      hasError: false,
    });
  } catch (err) {
    return handleResponse({
      hasError: true,
      resRef: res,
    });
  }
};
