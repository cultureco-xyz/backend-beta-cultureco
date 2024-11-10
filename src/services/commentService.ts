import { Types } from "mongoose";
import CommentModel from "../models/CommentModel";
import { IProduct } from "../models/ProductModel";
import { IUser } from "../models/UserModel";

interface IComment {
  productId: Types.ObjectId | IProduct;
  userId: Types.ObjectId | IUser;
  content: string;
  isDeleted: boolean;
}

const commentService = {
  // Function to post a new comment
  async postComment(
    productId: string,
    userId: string,
    content: string
  ): Promise<IComment> {
    const newComment = new CommentModel({
      productId,
      userId,
      content,
      isDeleted: false,
    });
    return await newComment.save();
  },

  // Function to get all comments for a specific product ID (excluding soft-deleted comments)
  async getCommentsByProductId(productId: string): Promise<IComment[]> {
    return await CommentModel.find({ productId, isDeleted: false })
      .populate("userId", "username email profilePicture") // Adjust fields as needed
      .exec();
  },

  // Function to get all comments made by a specific user (excluding soft-deleted comments)
  async getCommentsByUserId(userId: string): Promise<IComment[]> {
    return await CommentModel.find({ userId, isDeleted: false })
      .populate("productId", "name description") // Adjust fields as needed
      .exec();
  },
};

export default commentService;
