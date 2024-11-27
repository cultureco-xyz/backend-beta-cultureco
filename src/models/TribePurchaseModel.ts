import mongoose, { Document, Schema, Types } from "mongoose";
import ProductModel, { IProduct } from "./ProductModel";
import UserModel, { IUser } from "./UserModel";

interface ITribePurchase {
  _id: string;
  cost?: number;
  user?: Types.ObjectId | IUser;
  creator?: Types.ObjectId | IUser;
  order_id: string;
  currency: string;
  method: "RAZORPAY" | "COPPERX" | "STRIPE";
  status: "PENDING" | "SUCCESS" | "FAILED";
  createdAt?: Date;
  updatedAt?: Date;
}

const TribePurchaseSchema: Schema<ITribePurchase> = new Schema(
  {
    cost: { type: Number },
    user: { type: Types.ObjectId, ref: UserModel },
    creator: { type: Types.ObjectId, ref: UserModel },
    method: {
      type: String,
      required: true,
      enum: ["RAZORPAY", "COPPERX", "STRIPE"],
    },
    order_id: {
      type: String,
      required: true, // Ensure that every order has a unique order_id
      unique: true, // Ensure uniqueness of order_id
    },
    currency: {
      type: String,
      required: true, // The currency must be provided
      uppercase: true, // Automatically convert to uppercase (e.g., "usd" -> "USD")
    },
    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING",
    },
  },
  {
    timestamps: true, // Automatically add `createdAt` and `updatedAt` fields
  }
);

const TribePurchaseModel = mongoose.model<ITribePurchase>(
  "TribePurchase",
  TribePurchaseSchema
);

export default TribePurchaseModel;
