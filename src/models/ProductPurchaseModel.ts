import mongoose, { Document, Schema, Types } from "mongoose";
import ProductModel, { IProduct } from "./ProductModel";
import UserModel, { IUser } from "./UserModel";

interface IProductPurchase {
  _id: string;
  productId: Types.ObjectId | IProduct;
  cost?: number;
  user?: Types.ObjectId | IUser;
  creator?: Types.ObjectId | IUser;
  order_id: string;
  currency: string;
  status: "PENDING" | "SUCCESS" | "FAILED";
  createdAt?: Date;
  updatedAt?: Date;
}

const ProductPurchaseSchema: Schema<IProductPurchase> = new Schema(
  {
    productId: { type: Types.ObjectId, ref: ProductModel },
    cost: { type: Number },
    user: { type: Types.ObjectId, ref: UserModel },
    creator: { type: Types.ObjectId, ref: UserModel },
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

const ProductPurchaseModel = mongoose.model<IProductPurchase>(
  "ProductPurchase",
  ProductPurchaseSchema
);

export default ProductPurchaseModel;
