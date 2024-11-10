import { Request, Response } from "express";
import FollowService from "../services/followService";

// Follow a user
async function followUser(req: Request, res: Response): Promise<void> {
  try {
    const { followerId, followingId } = req.body;
    await FollowService.followUser(followerId, followingId);
    res.status(200).json({ message: "User followed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error following user", error });
  }
}

// Become a member, which also makes you follow the user
async function becomeMember(req: Request, res: Response): Promise<void> {
  try {
    const { followerId, followingId } = req.body;
    await FollowService.becomeMember(followerId, followingId);
    res
      .status(200)
      .json({ message: "User became a member and followed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error becoming a member", error });
  }
}

// Unfollow a user
async function unfollowUser(req: Request, res: Response): Promise<void> {
  try {
    const { followerId, followingId } = req.body;
    await FollowService.unfollowUser(followerId, followingId);
    res.status(200).json({ message: "User unfollowed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error unfollowing user", error });
  }
}

// Get all followers of a user
async function getFollowers(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = req.params;
    const followers = await FollowService.getFollowers(userId);
    res.status(200).json(followers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching followers", error });
  }
}

// Get all users followed by a user
async function getFollowing(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = req.params;
    const following = await FollowService.getFollowing(userId);
    res.status(200).json(following);
  } catch (error) {
    res.status(500).json({ message: "Error fetching following users", error });
  }
}

// Get follow status
async function getFollowStatus(req: Request, res: Response): Promise<any> {
  try {
    let userId = req.body.auth_user._id;
    let creatorId = req.body.creatorId;
    let followStatus = await FollowService.getFollowStatus(creatorId, userId);
    return res.status(200).json(followStatus);
  } catch (error) {
    return res.status(500).json({});
  }
}

// Exporting all functions as an object
export default {
  followUser,
  becomeMember,
  unfollowUser,
  getFollowers,
  getFollowing,
  getFollowStatus,
};
