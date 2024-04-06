import express from "express";
import {
  createUser,
  getUserByEmail,
  getUserById,
  updatedUserDetailsById,
} from "../db";
import { authentication, handleResponse, random } from "../helpers";

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, fcmToken } = req.body;

    if (!email || !password || !fcmToken)
      return handleResponse({
        hasError: true,
        resRef: res,
        statusMessage: "Pass All Required Value",
      });

    const user = await getUserByEmail(email?.toLowerCase()).select(
      `+authentication.salt +authentication.password`
    );

    if (!user)
      return handleResponse({
        hasError: true,
        resRef: res,
        errorMessage: "Email Id Or Password Is Invalid",
      });

    const expectedHash = authentication(user.authentication.salt, password);

    if (user.authentication.password !== expectedHash) {
      return handleResponse({
        hasError: true,
        resRef: res,
        errorMessage: "Email Id Or Password Is Invalid",
      });
    }

    const salt = random();
    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString()
    );
    user.fcmToken = fcmToken;

    await user.save();

    return handleResponse({
      resRef: res,
      result: user,
      hasError: false,
    });
  } catch (err) {
    return handleResponse({
      hasError: true,
      resRef: res,
    });
  }
};

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, firstName, secondName, userType, fcmToken } =
      req.body;

    if (
      !email ||
      !password ||
      !firstName ||
      !secondName ||
      !userType ||
      !fcmToken
    )
      return handleResponse({
        hasError: true,
        resRef: res,
        statusMessage: "Pass All Required Value",
      });

    const exitstingUser = await getUserByEmail(email?.toLowerCase());

    if (exitstingUser)
      return handleResponse({
        hasError: true,
        resRef: res,
        errorMessage: "Email Id Already Register",
      });

    const salt = random();
    const user = await createUser({
      email: email?.toLowerCase(),
      password,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
      firstName,
      lastName: secondName,
      userType,
      fcmToken,
    });

    return handleResponse({
      resRef: res,
      result: user,
      hasError: false,
    });
  } catch (err) {
    return handleResponse({
      hasError: true,
      resRef: res,
    });
  }
};

export const logOut = async (req: express.Request, res: express.Response) => {
  try {
    const { userId } = req.query;

    if (!userId)
      return handleResponse({
        hasError: true,
        resRef: res,
        errorMessage: "User Id Required",
      });

    const user = await getUserById(userId?.toString());

    if (!user) {
      return handleResponse({
        hasError: true,
        resRef: res,
        statusMessage: "Pass Valid  User Id",
      });
    }

    user.fcmToken = null;

    const upadtedData = await updatedUserDetailsById(userId?.toString(), {
      ...user,
    });

    if (!upadtedData) {
      return handleResponse({
        hasError: true,
        resRef: res,
        statusMessage: "Something Went Wrong",
      });
    }

    return handleResponse({
      resRef: res,
      result: user,
      hasError: false,
    });
  } catch (err) {
    return handleResponse({
      hasError: true,
      resRef: res,
    });
  }
};
