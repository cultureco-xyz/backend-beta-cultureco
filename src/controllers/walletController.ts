import walletService from "../services/walletService";
import { Request, Response } from "express";

const getUserWallet = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const wallet = await walletService.getUserWallet(id);
    res.status(200).send({
      wallet,
    });
  } catch (er) {
    res.status(500).send({
      er,
    });
  }
};

const exportSeedPhrase = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = req.body.auth_user._id;
    const private_key = await walletService.exportSeedPhrase(id);
    res.status(200).send({
      private_key,
    });
  } catch (er) {
    res.status(500).send({
      er,
    });
  }
};

export default {
  getUserWallet,
  exportSeedPhrase,
};
