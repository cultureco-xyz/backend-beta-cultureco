// src/routes/product.routes.ts

import { Router } from "express";
import ProductController from "../controllers/productController";
import authMiddleware from "../middleware/auth";

const router = Router();

router.post("/save-product", authMiddleware, ProductController.createProduct);
router.get("/get-products/:id", ProductController.getProductById);
router.get("/get-all-products", ProductController.getAllProducts);

export default router;
