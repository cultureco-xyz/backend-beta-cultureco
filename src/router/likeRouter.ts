import express from "express";
import * as likeController from "../controllers/likeController";
import authMiddleware from "../middleware/auth";

const router = express.Router();

router.post(
  "/product/:productId/like",
  authMiddleware,
  likeController.likeProduct
);
router.delete(
  "/product/:productId/unlike",
  authMiddleware,
  likeController.unlikeProduct
);
router.get("/product/:productId/likes", likeController.getLikesCount);
router.post("/is-liked", authMiddleware, likeController.isLikedByUser);

export default router;
