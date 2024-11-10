import mongoose, { Schema, Types } from "mongoose";
import ProductModel, { IProduct } from "./ProductModel";
import UserModel, { IUser } from "./UserModel";

interface ILike {
  productId: Types.ObjectId | IProduct; // The post being liked
  userId: Types.ObjectId | IUser; // The user who liked the post
}

const LikeSchema: Schema = new Schema(
  {
    productId: { type: Types.ObjectId, ref: ProductModel, required: true },
    userId: { type: Types.ObjectId, ref: UserModel, required: true },
  },
  {
    timestamps: true,
  }
);

const LikeModel = mongoose.model<ILike>("Like", LikeSchema);
export default LikeModel;
