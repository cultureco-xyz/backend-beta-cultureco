import { Request, Response } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import ProductPurchaseModel from "../models/ProductPurchaseModel";
import Stripe from "stripe";
import axios from "axios";
import TipModel from "../models/TipModal";
import TribePurchaseModel from "../models/TribePurchaseModel";
import followService from "../services/followService";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const createOrderRazorPay = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { amount, creator, productId } = req.body;
    const user = req.body.auth_user;

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID as string,
      key_secret: process.env.RAZORPAY_KEY_SECRET as string,
    });

    const options = {
      amount: amount * 100, // converting to paise
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    //save the order in the db
    let productPurchase = new ProductPurchaseModel({
      productId,
      cost: amount,
      creator,
      user: user._id,
      order_id: order.id,
      currency: "INR",
      method: "RAZORPAY",
    });

    let dbRes = productPurchase.save();

    return res.json(order);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error });
  }
};

const verifyOrderRazorPay = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { order_id, payment_id, signature } = req.body;

  const secret = process.env.RAZORPAY_KEY_SECRET as string;

  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(`${order_id}|${payment_id}`);
  const generated_signature = hmac.digest("hex");

  if (generated_signature === signature) {
    //update trx db
    let purchaseTrx = await ProductPurchaseModel.findOneAndUpdate(
      { order_id },
      {
        status: "SUCCESS",
      }
    );
  } else {
    let purchaseTrx = await ProductPurchaseModel.findOneAndUpdate(
      { order_id },
      {
        status: "FAILED",
      }
    );
  }

  return res.status(200).json({ order_id, payment_id });
};

const createOrderStripe = async (req: Request, res: Response): Promise<any> => {
  try {
    const { cost: amount, creator, productId } = req.body; // Parse the request body
    const user = req.body.auth_user;
    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "purchase",
            },
            unit_amount: amount * 100, // Amount in cents, $20
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/stripe/cancel`,
    });

    //save the order in the db
    let saveTrx = new ProductPurchaseModel({
      productId,
      cost: amount,
      creator,
      user: user._id,
      order_id: session.id,
      currency: "USD",
      method: "STRIPE",
    });
    await saveTrx.save();

    return res.status(200).json({ id: session.id });
  } catch (err) {
    console.error("Error creating Stripe checkout session:", err);
    return res.status(500).json({ err });
  }
};

const verifyOrderStripe = async (req: Request, res: Response): Promise<any> => {
  const { order_id, payment_id, signature } = req.body;

  //update trx db
  let purchaseTrx = await ProductPurchaseModel.findOneAndUpdate(
    { order_id },
    {
      status: "SUCCESS",
    }
  );
  if (purchaseTrx) {
    return res.status(200).json({ order_id, payment_id });
  } else {
    console.error("Error Verifying Stripe checkout session:");
    return res
      .status(500)
      .json({ err: "Error Verifying Stripe checkout session:" });
  }
};

const createOrderCopperX = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { cost: amount, creator, productId } = req.body;
    const user = req.body.auth_user;

    const response = await axios.post(
      "https://api.copperx.dev/api/v1/checkout/sessions",
      {
        successUrl: `${process.env.NEXT_PUBLIC_DOMAIN}/copperx/success?session_id={CHECKOUT_SESSION_ID}`,
        lineItems: {
          data: [
            {
              priceData: {
                currency: "usdc",
                unitAmount: Number(amount) * 100 * 1000000, // amount in smallest denomination (e.g., cents for USD, paise for INR)
                productData: {
                  name: "Purchase",
                  description: `Purchase of ` + productId,
                },
              },
            },
          ],
        },
        metadata: {
          user: user._id,
          creator,
          productId,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.COPPERX_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Extract necessary data from the response
    const { amount: responseAmount, id: order_id, url } = response.data;
    //save the order in the db
    let productPurchase = new ProductPurchaseModel({
      productId,
      cost: responseAmount,
      creator,
      user: user._id,
      order_id: order_id,
      currency: "USDC",
      method: "COPPERX",
    });

    let dbRes = await productPurchase.save();

    res.status(201).json({ url, data: dbRes });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error });
  }
};

//Tipping
const createTipRazorPay = async (req: Request, res: Response): Promise<any> => {
  try {
    const { amount, creator } = req.body;
    const user = req.body.auth_user;

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID as string,
      key_secret: process.env.RAZORPAY_KEY_SECRET as string,
    });

    const options = {
      amount: amount * 100, // converting to paise
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    //save the order in the db
    let productPurchase = new TipModel({
      cost: amount,
      creator,
      user: user._id,
      order_id: order.id,
      currency: "INR",
      method: "RAZORPAY",
    });

    let dbRes = productPurchase.save();

    return res.json(order);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error });
  }
};

const verifyTipRazorPay = async (req: Request, res: Response): Promise<any> => {
  const { order_id, payment_id, signature } = req.body;

  const secret = process.env.RAZORPAY_KEY_SECRET as string;

  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(`${order_id}|${payment_id}`);
  const generated_signature = hmac.digest("hex");

  if (generated_signature === signature) {
    //update trx db
    let purchaseTrx = await TipModel.findOneAndUpdate(
      { order_id },
      {
        status: "SUCCESS",
      }
    );
  } else {
    let purchaseTrx = await TipModel.findOneAndUpdate(
      { order_id },
      {
        status: "FAILED",
      }
    );
  }

  return res.status(200).json({ order_id, payment_id });
};

const createTipStripe = async (req: Request, res: Response): Promise<any> => {
  try {
    const { cost: amount, creator, productId } = req.body; // Parse the request body
    const user = req.body.auth_user;
    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "purchase",
            },
            unit_amount: amount * 100, // Amount in cents, $20
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/stripe/tip/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/stripe/cancel`,
    });

    //save the order in the db
    let saveTrx = new TipModel({
      cost: amount,
      creator,
      user: user._id,
      order_id: session.id,
      currency: "USD",
      method: "STRIPE",
    });
    await saveTrx.save();

    return res.status(200).json({ id: session.id });
  } catch (err) {
    console.error("Error creating Stripe checkout session:", err);
    return res.status(500).json({ err });
  }
};

const verifyTipStripe = async (req: Request, res: Response): Promise<any> => {
  const { order_id, payment_id, signature } = req.body;

  //update trx db
  let purchaseTrx = await TipModel.findOneAndUpdate(
    { order_id },
    {
      status: "SUCCESS",
    }
  );
  if (purchaseTrx) {
    return res.status(200).json({ order_id, payment_id });
  } else {
    console.error("Error Verifying Stripe checkout session:");
    return res
      .status(500)
      .json({ err: "Error Verifying Stripe checkout session:" });
  }
};

const createTipCopperX = async (req: Request, res: Response): Promise<any> => {
  try {
    const { cost: amount, creator, productId } = req.body;
    const user = req.body.auth_user;

    const response = await axios.post(
      "https://api.copperx.dev/api/v1/checkout/sessions",
      {
        successUrl: `${process.env.NEXT_PUBLIC_DOMAIN}/copperx/success?session_id={CHECKOUT_SESSION_ID}`,
        lineItems: {
          data: [
            {
              priceData: {
                currency: "usdc",
                unitAmount: Number(amount) * 100 * 1000000, // amount in smallest denomination (e.g., cents for USD, paise for INR)
                productData: {
                  name: "Purchase",
                  description: `Purchase of ` + productId,
                },
              },
            },
          ],
        },
        metadata: {
          user: user._id,
          creator,
          productId,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.COPPERX_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Extract necessary data from the response
    const { amount: responseAmount, id: order_id, url } = response.data;
    //save the order in the db
    let productPurchase = new ProductPurchaseModel({
      productId,
      cost: responseAmount,
      creator,
      user: user._id,
      order_id: order_id,
      currency: "USDC",
      method: "COPPERX",
    });

    let dbRes = await productPurchase.save();

    res.status(201).json({ url, data: dbRes });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error });
  }
};

//Tribe purchase
const createTribeRazorPay = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { amount, creator } = req.body;
    const user = req.body.auth_user;

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID as string,
      key_secret: process.env.RAZORPAY_KEY_SECRET as string,
    });

    const options = {
      amount: amount * 100, // converting to paise
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    //save the order in the db
    let tribePurchase = new TribePurchaseModel({
      cost: amount,
      creator,
      user: user._id,
      order_id: order.id,
      currency: "INR",
      method: "RAZORPAY",
    });

    let dbRes = tribePurchase.save();

    return res.json(order);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error });
  }
};

const verifyTribeRazorPay = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { order_id, payment_id, signature } = req.body;
  const user = req.body.auth_user;
  const secret = process.env.RAZORPAY_KEY_SECRET as string;

  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(`${order_id}|${payment_id}`);
  const generated_signature = hmac.digest("hex");

  if (generated_signature === signature) {
    //update trx db
    let purchaseTrx = await TribePurchaseModel.findOneAndUpdate(
      { order_id },
      {
        status: "SUCCESS",
      }
    );
    console.log(user._id, `${purchaseTrx?.creator}`);
    await followService.becomeMember(user._id, `${purchaseTrx?.creator}`);
  } else {
    let purchaseTrx = await TribePurchaseModel.findOneAndUpdate(
      { order_id },
      {
        status: "FAILED",
      }
    );
  }

  return res.status(200).json({ order_id, payment_id });
};

const createTribeStripe = async (req: Request, res: Response): Promise<any> => {
  try {
    const { cost: amount, creator, productId } = req.body; // Parse the request body
    const user = req.body.auth_user;
    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "purchase",
            },
            unit_amount: amount * 100, // Amount in cents, $20
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/stripe/tip/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/stripe/cancel`,
    });

    //save the order in the db
    let saveTrx = new TribePurchaseModel({
      cost: amount,
      creator,
      user: user._id,
      order_id: session.id,
      currency: "USD",
      method: "STRIPE",
    });
    await saveTrx.save();

    return res.status(200).json({ id: session.id });
  } catch (err) {
    console.error("Error creating Stripe checkout session:", err);
    return res.status(500).json({ err });
  }
};

const verifyTribeStripe = async (req: Request, res: Response): Promise<any> => {
  const { order_id, payment_id, signature } = req.body;
  const user = req.body.auth_user;
  //update trx db
  let purchaseTrx = await TribePurchaseModel.findOneAndUpdate(
    { order_id },
    {
      status: "SUCCESS",
    }
  );
  await followService.becomeMember(user._id, `${purchaseTrx?.creator}`);
  if (purchaseTrx) {
    return res.status(200).json({ order_id, payment_id });
  } else {
    console.error("Error Verifying Stripe checkout session:");
    return res
      .status(500)
      .json({ err: "Error Verifying Stripe checkout session:" });
  }
};

const createTribeCopperX = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { cost: amount, creator, productId } = req.body;
    const user = req.body.auth_user;

    const response = await axios.post(
      "https://api.copperx.dev/api/v1/checkout/sessions",
      {
        successUrl: `${process.env.NEXT_PUBLIC_DOMAIN}/copperx/success?session_id={CHECKOUT_SESSION_ID}`,
        lineItems: {
          data: [
            {
              priceData: {
                currency: "usdc",
                unitAmount: Number(amount) * 100 * 1000000, // amount in smallest denomination (e.g., cents for USD, paise for INR)
                productData: {
                  name: "Purchase",
                  description: `Purchase of ` + productId,
                },
              },
            },
          ],
        },
        metadata: {
          user: user._id,
          creator,
          productId,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.COPPERX_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Extract necessary data from the response
    const { amount: responseAmount, id: order_id, url } = response.data;
    //save the order in the db
    let tribePurchase = new TribePurchaseModel({
      productId,
      cost: responseAmount,
      creator,
      user: user._id,
      order_id: order_id,
      currency: "USDC",
      method: "COPPERX",
    });

    let dbRes = await tribePurchase.save();

    res.status(201).json({ url, data: dbRes });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error });
  }
};

export default {
  createOrderRazorPay,
  verifyOrderRazorPay,
  createOrderStripe,
  verifyOrderStripe,
  createOrderCopperX,
  createTipRazorPay,
  verifyTipRazorPay,
  createTipStripe,
  verifyTipStripe,
  createTipCopperX,
  createTribeRazorPay,
  verifyTribeRazorPay,
  createTribeStripe,
  verifyTribeStripe,
  createTribeCopperX,
};
