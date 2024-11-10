import express from "express";
import commentController from "../controllers/commentController";
import authMiddleware from "../middleware/auth";

const router = express.Router();

router.post("/post-comment", authMiddleware, commentController.postComment);
router.get("/product/:productId", commentController.getCommentsByProductId);
router.get("/user/:creatorId", commentController.getCommentsByUserId);

export default router;
