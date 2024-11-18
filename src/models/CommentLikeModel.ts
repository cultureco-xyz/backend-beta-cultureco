import mongoose, { Schema, Types } from "mongoose";
import CommentModel, { IComment } from "./CommentModel";
import UserModel, { IUser } from "./UserModel";

export interface ICommentLike {
  commentId: Types.ObjectId | IComment;
  userId: Types.ObjectId | IUser;
}

const CommentLikeSchema: Schema = new Schema(
  {
    commentId: { type: Types.ObjectId, ref: CommentModel, required: true },
    userId: { type: Types.ObjectId, ref: UserModel, required: true },
  },
  {
    timestamps: true,
  }
);

// Ensure a user can like a comment only once
CommentLikeSchema.index({ commentId: 1, userId: 1 }, { unique: true });

const CommentLikeModel = mongoose.model<ICommentLike>(
  "CommentLike",
  CommentLikeSchema
);
export default CommentLikeModel;
