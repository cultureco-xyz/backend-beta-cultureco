import { JWT } from "google-auth-library";
import userService from "../services/userService";
import { generateToken, verifyToken } from "../utils/jwtUtils";
import { json, Request, Response } from "express";

const createUser = async (req: Request, res: Response): Promise<any> => {
  const { SIGNUPTOKEN, username, name, bio, profilePicture } = req.body;

  let tokenData = verifyToken(SIGNUPTOKEN) as { email: string };

  console.log(tokenData);

  if (tokenData) {
    let user = await userService.createUser({
      name,
      username,
      bio,
      profilePicture,
      email: tokenData?.email,
    });
    let jwt = generateToken(user);
    res.cookie("Authorization", jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    return res.status(200).json({
      user: user,
      Authorization: jwt,
      message: "User Creation Successfull",
    });
  } else {
    return res.status(400).json({ message: "upload failed" });
  }
};

const changeToCreator = async (req: Request, res: Response): Promise<any> => {
  let { name, bio, creatorType, profilePicture, auth_user } = req.body;
  let user = await userService.changeToCreator({
    name,
    bio,
    creatorType,
    profilePicture,
    _id: auth_user._id,
  });
  let token = generateToken(user);
  res.cookie("Authorization", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  return res.status(200).json(user);
};

const createDemoUser = async (req: Request, res: Response): Promise<any> => {
  let { name, username, bio, creatorType, profilePicture } = req.body;
  if (
    req.body.auth_user.email &&
    `${req.body.auth_user.email}`.includes("@cultureco.xyz")
  ) {
    let user = await userService.createDemoUser({
      name,
      username,
      bio,
      creatorType,
      profilePicture,
      demoCreatorEmail: req.body.auth_user.email,
    });
    return res.status(200).json(user);
  } else {
    return res.status(401).json({
      error: "unauthorized access",
    });
  }
};

const claimDemoUser = async (req: Request, res: Response): Promise<any> => {
  let { demoUserID } = req.body;

  let updatedUser = userService.claimDemoUser({
    currentUserID: req.body.auth_user._id,
    demoUserID: demoUserID,
    updatedData: { ...req.body, email: req.body.auth_user.email },
  });

  let token = generateToken(updatedUser);
  res.cookie("Authorization", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  return res.status(200).json(updatedUser);
};

export default { createUser, changeToCreator, createDemoUser, claimDemoUser };
