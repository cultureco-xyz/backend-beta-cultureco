import mongoose, { Schema, Types } from "mongoose";
import ProductModel, { IProduct } from "./ProductModel";
import UserModel, { IUser } from "./UserModel";

interface IComment {
  productId: Types.ObjectId | IProduct;
  userId: Types.ObjectId | IUser;
  content: string;
  isDeleted: boolean; // Soft delete functionality
}

const CommentSchema: Schema = new Schema(
  {
    productId: { type: Types.ObjectId, ref: ProductModel, required: true },
    userId: { type: Types.ObjectId, ref: UserModel, required: true },
    content: { type: String, required: true },
    isDeleted: { type: Boolean, default: false }, // Soft delete functionality
  },
  {
    timestamps: true,
  }
);

const CommentModel = mongoose.model<IComment>("Comment", CommentSchema);
export default CommentModel;
