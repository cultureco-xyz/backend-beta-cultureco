// src/services/product.service.ts

import ProductModel, { IProduct } from "../models/ProductModel";

// Create a new product
async function createProduct(data: IProduct): Promise<IProduct> {
  const product = new ProductModel(data);
  return await product.save();
}

// Get product by ID
async function getProductById(productId: string): Promise<IProduct | null> {
  return await ProductModel.findById(productId).populate("creator");
}

// Get all products
async function getAllProducts(): Promise<IProduct[]> {
  return await ProductModel.find().populate("creator");
}

export default {
  createProduct,
  getProductById,
  getAllProducts,
};
