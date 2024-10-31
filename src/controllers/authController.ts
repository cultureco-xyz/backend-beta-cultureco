import { Request, Response } from "express";
import authService from "./../services/authService";
import { verifyToken } from "../utils/jwtUtils";

const signin = async (req: Request, res: Response): Promise<any> => {
  try {
    const { access_token } = req.body;
    if (!access_token) {
      return res.status(400).json({
        error: "access token not found",
      });
    }

    const auth = await authService.signin(access_token);

    if (!auth) {
      return res.status(400).json({
        error: "request failed",
      });
    }

    if (auth.newUser) {
      return res.status(200).json({
        newUser: true,
        signupToken: auth.token,
      });
    }

    if (auth.user && !auth.newUser) {
      res.cookie("Authorization", auth.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
      return res.status(200).json({
        newUser: false,
        user: auth.user,
      });
    }

    // If no condition is met, return a default response
    return res.status(500).json({
      error: "Unexpected error",
    });
  } catch (er) {
    return res.status(500).json({
      error: er,
    });
  }
};

const isLogedIn = async (req: Request, res: Response): Promise<any> => {
  try {
    const token = req.cookies.Authorization;
    if (!token) {
      return res.status(200).json({
        logedIn: false,
        message: "token not found",
      });
    }

    const user = verifyToken(token);

    if (user) {
      return res.status(200).json({
        logedIn: true,
        message: "user logedin",
        user: user,
      });
    }

    // If no condition is met, return a default response
    return res.status(200).json({
      logedIn: false,
      message: "unauthorized",
    });
  } catch (er) {
    return res.status(500).json({
      error: er,
    });
  }
};

const logOut = async (req: Request, res: Response): Promise<any> => {
  res.clearCookie("Authorization"); // 'token' is the cookie name; replace it with yours
  res.status(200).json({ message: "Successfully logged out" });
};

export default {
  signin,
  isLogedIn,
  logOut,
};
