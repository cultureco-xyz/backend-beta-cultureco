// routes/ProductPurchaseRouter.ts
import { Router } from "express";
import ProductPurchaseController from "../controllers/productPurchaseController";
import authMiddleware from "../middleware/auth";

const router = Router();

// Create a purchase
router.post(
  "/create-purchase",
  authMiddleware,
  ProductPurchaseController.createPurchase
);

// Get a purchase by ID
router.get("/:id", ProductPurchaseController.getPurchaseById);

// Update purchase status
router.put("/:order_id/status", ProductPurchaseController.updatePurchaseStatus);

// Get purchases by user
router.get("/user/:userId", ProductPurchaseController.getPurchasesByUser);

// Delete a purchase
router.delete("/:id", ProductPurchaseController.deletePurchase);

// Is purchased by user
router.get(
  "/user/:userId/:productId",
  ProductPurchaseController.isPurchasedByUser
);

export default router;
