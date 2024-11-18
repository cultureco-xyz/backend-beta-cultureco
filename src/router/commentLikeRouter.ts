import express from "express";
import CommentLikeController from "../controllers/commentLikeController";
import authMiddleware from "../middleware/auth";

const likeRouter = express.Router();

likeRouter.post("/toggle", authMiddleware, CommentLikeController.toggleLike);
likeRouter.get("/:commentId/count", CommentLikeController.getLikeCount);
likeRouter.post(
  "/:commentId/isLiked",
  authMiddleware,
  CommentLikeController.isLikedByUser
);

export default likeRouter;
