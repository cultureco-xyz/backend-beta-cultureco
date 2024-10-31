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

export default { createUser };
