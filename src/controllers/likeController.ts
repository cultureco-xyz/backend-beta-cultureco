import { Request, Response } from "express";
import * as likeService from "../services/likeService";

export const likeProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const userId = req.body.auth_user._id;

    await likeService.addLike(productId, userId);
    res.status(201).json({ message: "Product liked successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error });
  }
};

export const unlikeProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const userId = req.body.auth_user._id;

    await likeService.removeLike(productId, userId);
    res.status(200).json({ message: "Product unliked successfully" });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const getLikesCount = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    const likesCount = await likeService.countLikes(productId);
    res.status(200).json({ likesCount });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const isLikedByUser = async (req: Request, res: Response) => {
  try {
    const productId = req.body.productId;
    const userId = req.body.auth_user._id;
    let isLiked = await likeService.isLikedByUser(productId, userId);
    res.status(200).json({ isLiked });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};
