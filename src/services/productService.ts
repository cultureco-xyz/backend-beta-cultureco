// src/services/product.service.ts

import LikeModel from "../models/LikeModel";
import ProductModel, { IProduct } from "../models/ProductModel";

// Create a new product
async function createProduct(data: IProduct): Promise<IProduct> {
  const product = new ProductModel(data);
  return await product.save();
}

// Update existing product
async function updateProduct(productId: string, data: IProduct): Promise<IProduct> {
  const updatedProduct = await ProductModel.findByIdAndUpdate(productId, data, {
    new: true,  // returns the updated product
    runValidators: true,  // ensures validation is applied
  });

  if (!updatedProduct) {
    throw new Error("Product not found");
  }

  return updatedProduct;
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

// Delete product by ID
async function deleteProductById(productId: string) {
  try {
    const result = await ProductModel.findByIdAndDelete(productId);

    if (!result) {
      throw new Error('Product not found');
    }

    return { success: true, message: 'Product deleted successfully' };
  } catch (error: unknown) {
    // Type assertion to treat 'error' as an instance of Error
    if (error instanceof Error) {
      throw new Error(`Error deleting product: ${error.message}`);
    }
    // If it's not an instance of Error, you can handle other types
    throw new Error('Unknown error occurred while deleting product');
  }
}


// Get all products
async function getAllProducts(): Promise<IProduct[]> {
  return await ProductModel.find().populate("creator");
}

// Get products by user
async function getProductsByUser(userId: string): Promise<IProduct[]> {
  return await ProductModel.find({ creator: userId });
}

export default {
  createProduct,
  updateProduct,
  getProductById,
  deleteProductById,
  getAllProducts,
  getProductsByUser,
};
