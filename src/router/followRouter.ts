import express from "express";
import followController from "../controllers/followController";
import authMiddleware from "../middleware/auth";

const router = express.Router();

// Route to follow a user
router.post("/follow", followController.followUser);

// Route to become a member (also follows the user)
router.post("/become-member", followController.becomeMember);

// Route to unfollow a user
router.delete("/unfollow", followController.unfollowUser);

// Route to get all followers of a user
router.get("/followers/:userId", followController.getFollowers);

// Route to get all users followed by a user
router.get("/following/:userId", followController.getFollowing);

//Route to get follow status of a user for a creator
router.post("/follow-status", authMiddleware, followController.getFollowStatus);

export default router;
