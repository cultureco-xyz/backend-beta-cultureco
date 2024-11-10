import { Request, Response } from "express";
import { Types } from "mongoose";
import commentService from "../services/commentService";

const commentController = {
  // Controller method to post a new comment
  async postComment(req: Request, res: Response): Promise<any> {
    try {
      const { productId, content } = req.body;
      const userId = req.body.auth_user._id;
      // Validate required fields
      if (!productId || !userId || !content) {
        return res.status(400).json({
          message: "Product ID, creator ID, and content are required.",
        });
      }

      // Post the comment
      const comment = await commentService.postComment(
        productId,
        userId,
        content
      );

      res
        .status(201)
        .json({ message: "Comment created successfully", comment });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to post comment", error: error });
    }
  },

  // Controller method to get comments by product ID
  async getCommentsByProductId(req: Request, res: Response) {
    try {
      const { productId } = req.params;

      // Fetch comments
      const comments = await commentService.getCommentsByProductId(productId);
      res.status(200).json({ comments });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Failed to fetch comments", error: error });
    }
  },

  // Controller method to get comments by user ID
  async getCommentsByUserId(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      // Fetch comments
      const comments = await commentService.getCommentsByUserId(userId);
      res.status(200).json({ comments });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Failed to fetch comments", error: error });
    }
  },
};

export default commentController;
