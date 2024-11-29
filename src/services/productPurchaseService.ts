// services/ProductPurchaseService.ts
import ProductPurchaseModel from "../models/ProductPurchaseModel";

class ProductPurchaseService {
  async createPurchase(data: any) {
    const { productId, cost, creator, currency, user } = data;
    return await ProductPurchaseModel.create({
      productId,
      cost,
      creator,
      currency,
      user,
      order_id: `${Math.random() * 10000}`,
    });
  }

  async getPurchaseById(id: string) {
    return await ProductPurchaseModel.findById(id)
      .populate("productId")
      .populate("user")
      .populate("creator");
  }

  async isPurchasedByUser(userId: string, productId: string) {
    const res = await ProductPurchaseModel.findOne({
      user: userId,
      productId: productId,
      status: "SUCCESS",
    });
    if (res) {
      return true;
    }
    return false;
  }

  async updatePurchaseStatus(
    orderId: string,
    status: "PENDING" | "SUCCESS" | "FAILED"
  ) {
    return await ProductPurchaseModel.findOneAndUpdate(
      { order_id: orderId },
      { status },
      { new: true }
    );
  }

  async getPurchasesByUser(userId: string) {
    return await ProductPurchaseModel.find({
      user: userId,
      status: "SUCCESS",
    }).populate("productId");
  }

  async deletePurchase(id: string) {
    return await ProductPurchaseModel.findByIdAndDelete(id);
  }
}

export default new ProductPurchaseService();
