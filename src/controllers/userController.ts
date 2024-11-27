import { JWT } from "google-auth-library";
import userService from "../services/userService";
import { generateToken, verifyToken } from "../utils/jwtUtils";
import { Request, Response } from "express";

const createUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { SIGNUPTOKEN, username, name, bio, profilePicture } = req.body;

    let tokenData = verifyToken(SIGNUPTOKEN) as { email: string };

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
        message: "User Creation Successful",
      });
    } else {
      return res.status(400).json({ message: "Upload failed" });
    }
  } catch (error) {
    console.error("Error in createUser:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const changeToCreator = async (req: Request, res: Response): Promise<any> => {
  try {
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
  } catch (error) {
    console.error("Error in changeToCreator:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const createDemoUser = async (req: Request, res: Response): Promise<any> => {
  try {
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
        error: "Unauthorized access",
      });
    }
  } catch (error) {
    console.error("Error in createDemoUser:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const verifyClaimCode = async (req: Request, res: Response): Promise<any> => {
  try {
    const { demoCreatorID, claimCode } = req.body;
    let isValid = await userService.verifyClaimCode(demoCreatorID, claimCode);
    return res.status(200).send({ isValid });
  } catch (error) {
    console.error("Error in verifyClaimCode:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const claimDemoUser = async (req: Request, res: Response): Promise<any> => {
  try {
    let { demoUserID, claimCode } = req.body;

    let updatedUser = await userService.claimDemoUser({
      currentUserID: req.body.auth_user._id,
      demoUserID: demoUserID,
      updatedData: { ...req.body, email: req.body.auth_user.email },
      claimCode,
    });
    if (!updatedUser) {
      return res.status(400).send({ error: "Request failed" });
    }
    let token = generateToken(updatedUser);
    res.cookie("Authorization", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error in claimDemoUser:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllUser = async (req: Request, res: Response): Promise<any> => {
  try {
    let creators = await userService.getAllCreators();
    return res.status(200).json(creators);
  } catch (error) {
    console.error("Error in getAllUser:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getUserByID = async (req: Request, res: Response): Promise<any> => {
  try {
    let { userID } = req.body;
    let user = await userService.getUserByID(userID);
    return res.status(200).json(user);
  } catch (error) {
    console.error("Error in getUserByID:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getCreatorStats = async (req: Request, res: Response): Promise<any> => {
  try {
    let userID = req.params.id;
    let stats = await userService.getCreatorStats(userID);
    return res.status(200).json(stats);
  } catch (error) {
    console.error("Error in getCreatorStats:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getUserStats = async (req: Request, res: Response): Promise<any> => {
  try {
    let userID = req.params.id;
    let stats = await userService.getUserStats(userID);
    return res.status(200).json(stats);
  } catch (error) {
    console.error("Error in getUserStats:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateProfile = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.body.auth_user._id;
    const { name, username, bio, profilePicture } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const updatedProfile = await userService.updateUserProfile(userId, {
      name,
      username,
      bio,
      profilePicture,
    });

    // Convert Mongoose document to a plain JavaScript object before passing to generateToken
    const plainUser = updatedProfile.toObject
      ? updatedProfile.toObject()
      : updatedProfile;

    // Regenerate token with updated user data
    const newToken = generateToken(plainUser);

    // Set the new token in cookies
    res.cookie("Authorization", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedProfile,
    });
  } catch (error) {
    console.error("Error in updateProfile:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default {
  createUser,
  changeToCreator,
  createDemoUser,
  claimDemoUser,
  getAllUser,
  verifyClaimCode,
  getUserByID,
  getCreatorStats,
  getUserStats,
  updateProfile,
};
