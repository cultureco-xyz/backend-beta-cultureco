// src/routes/product.routes.ts

import { Router } from "express";
import ProductController from "../controllers/productController";
import authMiddleware from "../middleware/auth";

const router = Router();

router.post("/save-product", authMiddleware, ProductController.createProduct);
router.get("/get-product/:id", ProductController.getProductById);
router.get("/get-all-products", ProductController.getAllProducts);
router.get("/get-user-products/:userId", ProductController.getProductsByUser);

export default router;
