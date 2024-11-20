// src/services/product.service.ts
import CommentModel from "../models/CommentModel";
import LikeModel from "../models/LikeModel";
import ProductModel, { IProduct } from "../models/ProductModel";

// Create a new product
async function createProduct(data: IProduct): Promise<IProduct> {
  const product = new ProductModel(data);
  return await product.save();
}

// Get product by ID
async function getProductById(
  productId: string
): Promise<{ productData: IProduct; likeCount: number }> {
  //product details
  let productData = ProductModel.findById(productId).populate("creator").lean();
  //likes
  let likes = LikeModel.find({ productId: productId });
  //comments
  let res = await Promise.all([productData, likes]);
  return { productData: res[0] as IProduct, likeCount: res[1].length };
}

// Get all products
async function getAllProducts(): Promise<IProduct[]> {
  return await ProductModel.find().populate("creator");
}

// Get products by user
async function getProductsByUser(userId: string): Promise<IProduct[]> {
  return await ProductModel.find({ creator: userId });
}

// Get stats (like-count, comment-count, isLiked by user post)
async function getProductStats(userId: string, productId: string) {
  // like count
  const likes = LikeModel.countDocuments({ productId });
  // comment count
  const comment = CommentModel.countDocuments({ productId });
  // is liked by user
  const isLikedByUser = userId
    ? LikeModel.findOne({ productId, userId })
    : Promise.resolve(false);

  let res = await Promise.all([likes, comment, isLikedByUser]);

  return {
    likeCount: res[0],
    commentCount: res[1],
    isLikedByUser: res[2] ? true : false,
  };
}

export default {
  createProduct,
  getProductById,
  getAllProducts,
  getProductsByUser,
  getProductStats,
};
