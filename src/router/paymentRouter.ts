import { Router } from "express";
import authMiddleware from "../middleware/auth";
import paymentController from "../controllers/paymentController";
const router = Router();

router.post(
  "/razorpay/order-product",
  authMiddleware,
  paymentController.createOrderRazorPay
);

router.post(
  "/stripe/order-product",
  authMiddleware,
  paymentController.createOrderStripe
);

router.post(
  "/copperx/order-product",
  authMiddleware,
  paymentController.createOrderCopperX
);

router.post(
  "/base/order-product",
  authMiddleware,
  paymentController.createOrderBase
);

router.post(
  "/razorpay/verify-product",
  authMiddleware,
  paymentController.verifyOrderRazorPay
);

router.post(
  "/stripe/verify-product",
  authMiddleware,
  paymentController.verifyOrderStripe
);

router.post(
  "/base/verify-product",
  authMiddleware,
  paymentController.verifyOrderBase
);

//tipping

router.post(
  "/razorpay/order-tip",
  authMiddleware,
  paymentController.createTipRazorPay
);

router.post(
  "/stripe/order-tip",
  authMiddleware,
  paymentController.createTipStripe
);

router.post(
  "/copperx/order-tip",
  authMiddleware,
  paymentController.createTipCopperX
);

router.post(
  "/razorpay/verify-tip",
  authMiddleware,
  paymentController.verifyTipRazorPay
);

router.post(
  "/stripe/verify-tip",
  authMiddleware,
  paymentController.verifyTipStripe
);

//tribe membership
router.post(
  "/razorpay/order-tribe",
  authMiddleware,
  paymentController.createTribeRazorPay
);

router.post(
  "/stripe/order-tribe",
  authMiddleware,
  paymentController.createTribeStripe
);

router.post(
  "/copperx/order-tribe",
  authMiddleware,
  paymentController.createTribeCopperX
);

router.post(
  "/razorpay/verify-tribe",
  authMiddleware,
  paymentController.verifyTribeRazorPay
);

router.post(
  "/stripe/verify-tribe",
  authMiddleware,
  paymentController.verifyTribeStripe
);

export default router;
