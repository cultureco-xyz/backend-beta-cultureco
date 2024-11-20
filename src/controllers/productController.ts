import ProductService from "../services/productService";
import { Request, Response } from "express";

// Create a new product
async function createProduct(req: Request, res: Response): Promise<void> {
  try {
    console.log(req.body);
    const product = await ProductService.createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating product", error });
  }
}

// Update existing product
async function updateProduct(req: Request, res: Response): Promise<void> {
  try {
    console.log(req.body);
    const product = await ProductService.updateProduct(req.params.productId, req.body);
    res.status(201).json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating product", error });
  }
}

// Get product by ID
async function getProductById(req: Request, res: Response): Promise<void> {
  try {
    const product = await ProductService.getProductById(req.params.id);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
    } else {
      res.status(200).json(product);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching product", error });
  }
}

// Delete product by ID
async function deleteProductById(req: Request, res: Response): Promise<void> {
  try {
    const result = await ProductService.deleteProductById(req.params.productId);
    if (!result) {
      res.status(404).json({ message: "Product not found" });
    } else {
      res.status(200).json({ message: "Product deleted successfully" })
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error deleting product", error})
  }
}

// Get all products
async function getAllProducts(req: Request, res: Response): Promise<void> {
  try {
    const products = await ProductService.getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
}

// Get products by user
async function getProductsByUser(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.params.userId; // Assuming user ID is passed as a route parameter
    const products = await ProductService.getProductsByUser(userId);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user's products", error });
  }
}

// Get product stats
async function getProductsStats(req: Request, res: Response): Promise<void> {
  try {
    const { userId, productId } = req.body;
    const stats = await ProductService.getProductStats(userId, productId);
    res.status(200).json(stats);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching product details", error });
  }
}

// Update existing product
async function updateProduct(req: Request, res: Response): Promise<void> {
  try {
    console.log(req.body);
    const product = await ProductService.updateProduct(
      req.params.productId,
      req.body
    );
    res.status(201).json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating product", error });
  }
}

// Delete product by ID
async function deleteProductById(req: Request, res: Response): Promise<void> {
  try {
    const result = await ProductService.deleteProductById(req.params.productId);
    if (!result) {
      res.status(404).json({ message: "Product not found" });
    } else {
      res.status(200).json({ message: "Product deleted successfully" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error deleting product", error });
  }
}

export default {
  createProduct,
  updateProduct,
  getProductById,
  deleteProductById,
  getAllProducts,
  getProductsByUser,
  getProductsStats,
  updateProduct,
  deleteProductById,
};
