import { Types } from "mongoose";
import FollowModel from "../models/FollowModel"; // Assuming the model file is named FollowModel

// Follow a user
async function followUser(
  followerId: string,
  followingId: string
): Promise<void> {
  await FollowModel.findOneAndUpdate(
    { follower: followerId, following: followingId },
    {
      $setOnInsert: {
        follower: followerId,
        following: followingId,
        isMember: false,
      },
    },
    { upsert: true, new: true }
  );
}

// Become a member (which also makes you follow the user)
async function becomeMember(
  followerId: string,
  followingId: string
): Promise<void> {
  await FollowModel.findOneAndUpdate(
    { follower: followerId, following: followingId },
    { $set: { isMember: true } },
    { upsert: true, new: true }
  );
}

// Unfollow a user
async function unfollowUser(
  followerId: string,
  followingId: string
): Promise<void> {
  await FollowModel.findOneAndDelete({
    follower: followerId,
    following: followingId,
  });
}

// Get all followers of a user
async function getFollowers(userId: string): Promise<any[]> {
  return await FollowModel.find({ following: userId }).populate(
    "follower",
    "username"
  );
}

// Get all users followed by a user
async function getFollowing(userId: string): Promise<any[]> {
  return await FollowModel.find({ follower: userId }).populate(
    "following",
    "username"
  );
}

// Get follow status
async function getFollowStatus(
  creatorId: string,
  userId: string
): Promise<any> {
  let status = await FollowModel.findOne({
    follower: userId,
    following: creatorId,
  });

  return {
    isFollowing: status ? true : false,
    isMember: status ? status.isMember : false,
  };
}

// Export as an object
export default {
  followUser,
  becomeMember,
  unfollowUser,
  getFollowers,
  getFollowing,
  getFollowStatus,
};
