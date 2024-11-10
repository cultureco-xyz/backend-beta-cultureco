import LikeModel from "../models/LikeModel";
import ProductModel from "../models/ProductModel";
import { Types } from "mongoose";

export const addLike = async (productId: string, userId: string) => {
  if (!Types.ObjectId.isValid(productId) || !Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid product or user ID");
  }

  const productExists = await ProductModel.exists({ _id: productId });
  if (!productExists) throw new Error("Product not found");

  const likeExists = await LikeModel.exists({ productId, userId });
  if (likeExists) throw new Error("Product already liked");

  return await LikeModel.create({ productId, userId });
};

export const removeLike = async (productId: string, userId: string) => {
  if (!Types.ObjectId.isValid(productId) || !Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid product or user ID");
  }

  const result = await LikeModel.findOneAndDelete({ productId, userId });
  if (!result) throw new Error("Like not found");

  return result;
};

export const countLikes = async (productId: string) => {
  if (!Types.ObjectId.isValid(productId)) throw new Error("Invalid product ID");

  return await LikeModel.countDocuments({ productId });
};

export const isLikedByUser = async (productId: string, userId: string) => {
  let res = await LikeModel.find({
    productId: productId,
    userId: userId,
  });

  if (res.length > 0) {
    return true;
  } else {
    false;
  }
};
