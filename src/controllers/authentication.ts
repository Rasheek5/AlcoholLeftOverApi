import express from "express";
import { createUser, getUserByEmail } from "../db";
import { authentication, handleResponse, random } from "../helpers";

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return handleResponse({
        hasError: true,
        resRef: res,
        statusMessage: "Pass All Required Value",
      });

    const user = await getUserByEmail(email).select(
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
    const { email, password, firstName, secondName, userType } = req.body;

    if (!email || !password || !firstName || !secondName || !userType)
      return handleResponse({
        hasError: true,
        resRef: res,
        statusMessage: "Pass All Required Value",
      });

    const exitstingUser = await getUserByEmail(email);

    if (exitstingUser)
      return handleResponse({
        hasError: true,
        resRef: res,
        errorMessage: "Email Id Already Register",
      });

    const salt = random();
    const user = await createUser({
      email,
      password,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
      firstName,
      lastName: secondName,
      userType,
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
