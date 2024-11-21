// controllers/ProductPurchaseController.ts
import { Request, Response } from "express";
import ProductPurchaseService from "../services/productPurchaseService";

class ProductPurchaseController {
  async createPurchase(req: Request, res: Response): Promise<any> {
    try {
      const purchase = await ProductPurchaseService.createPurchase({
        ...req.body,
        user: req.body.auth_user._id,
      });
      return res.status(201).json(purchase);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }

  async getPurchaseById(req: Request, res: Response): Promise<any> {
    try {
      const purchase = await ProductPurchaseService.getPurchaseById(
        req.params.id
      );
      if (!purchase) {
        return res.status(404).json({ message: "Purchase not found" });
      }
      return res.status(200).json(purchase);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }

  async updatePurchaseStatus(req: Request, res: Response): Promise<any> {
    try {
      const { order_id } = req.params;
      const { status } = req.body;
      const updatedPurchase = await ProductPurchaseService.updatePurchaseStatus(
        order_id,
        status
      );
      if (!updatedPurchase) {
        return res.status(404).json({ message: "Purchase not found" });
      }
      return res.status(200).json(updatedPurchase);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }

  async getPurchasesByUser(req: Request, res: Response): Promise<any> {
    try {
      const purchases = await ProductPurchaseService.getPurchasesByUser(
        req.params.userId
      );
      return res.status(200).json(purchases);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }

  async deletePurchase(req: Request, res: Response): Promise<any> {
    try {
      const deletedPurchase = await ProductPurchaseService.deletePurchase(
        req.params.id
      );
      if (!deletedPurchase) {
        return res.status(404).json({ message: "Purchase not found" });
      }
      return res.status(200).json({ message: "Purchase deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
}

export default new ProductPurchaseController();
