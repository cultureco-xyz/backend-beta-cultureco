import { Request, Response } from "express";
import CommentLikeService from "../services/commentLikeService";

class CommentLikeController {
  async toggleLike(req: Request, res: Response): Promise<void> {
    const { commentId } = req.body;
    const userId = req.body.auth_user._id;

    try {
      const result = await CommentLikeService.toggleLike(commentId, userId);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getLikeCount(req: Request, res: Response): Promise<void> {
    const { commentId } = req.params;

    try {
      const likeCount = await CommentLikeService.getLikeCount(commentId);
      res.status(200).json({ likeCount });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Checks if a comment is liked by the user.
   */
  async isLikedByUser(req: Request, res: Response): Promise<void> {
    const { commentId } = req.params;
    const userId = req.body.auth_user._id;

    try {
      const isLiked = await CommentLikeService.isLikedByUser(commentId, userId);
      res.status(200).json({ isLiked });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new CommentLikeController();
