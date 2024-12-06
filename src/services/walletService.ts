import GeneratedWallet from "../models/GeneratedWallet";
import {
  encryptPrivateKey,
  generateWallet,
  decryptPrivateKey,
} from "../utils/crypto";
const G_KEY = process.env.WALLET_GEN_SECRET;

async function createUserWallet(userId: string) {
  // Secret key for AES encryption (32 bytes for AES-256)

  //generate wallet and link to user
  let { public_key, private_key } = generateWallet();

  // Encrypt the private key using AES-256-CBC
  let encrypted_private_key = encryptPrivateKey(private_key, G_KEY as string);

  const wallet = new GeneratedWallet({
    userID: userId,
    public_key: public_key,
    encrypted_private_key: encrypted_private_key,
  });
  const generatedWallet = await wallet.save();
  return generatedWallet;
}

async function getUserWallet(userId: string) {
  // find user wallet by id
  let wallet = await GeneratedWallet.findOne({
    userID: userId,
  });

  return wallet?.public_key;
}

async function exportPrivateKey(userID: string) {
  // find user wallet by id
  let wallet = await GeneratedWallet.findOne({
    userID,
  });
  //decrypt key
  const private_key = decryptPrivateKey(
    `${wallet?.encrypted_private_key}`,
    `${G_KEY}`
  );

  return private_key;
}

export default {
  createUserWallet,
  getUserWallet,
  exportPrivateKey,
};
