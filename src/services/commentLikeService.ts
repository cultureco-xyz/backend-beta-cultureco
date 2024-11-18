import { Types } from "mongoose";
import CommentLikeModel from "../models/CommentLikeModel";
import CommentModel from "../models/CommentModel";

class CommentLikeService {
  async toggleLike(
    commentId: string,
    userId: Types.ObjectId
  ): Promise<{ message: string }> {
    const commentExists = await CommentModel.exists({ _id: commentId });
    if (!commentExists) {
      throw new Error("Comment not found");
    }

    const existingLike = await CommentLikeModel.findOne({ commentId, userId });
    if (existingLike) {
      await CommentLikeModel.deleteOne({ _id: existingLike._id });
      return { message: "Like removed successfully" };
    } else {
      await CommentLikeModel.create({ commentId, userId });
      return { message: "Liked successfully" };
    }
  }

  async getLikeCount(commentId: string): Promise<number> {
    const commentExists = await CommentModel.exists({ _id: commentId });
    if (!commentExists) {
      throw new Error("Comment not found");
    }

    const likeCount = await CommentLikeModel.countDocuments({ commentId });
    return likeCount;
  }

  async isLikedByUser(commentId: string, userId: string): Promise<boolean> {
    const likeExists = await CommentLikeModel.exists({ commentId, userId });
    return !!likeExists;
  }
}

export default new CommentLikeService();
