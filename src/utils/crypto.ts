import * as crypto from "crypto";
import Web3 from "web3";

const web3 = new Web3();

// Secret key for AES encryption (32 bytes for AES-256)
const G_KEY = process.env.WALLET_GEN_SECRET;

// Function to encrypt the private key using AES-256-CBC
export function encryptPrivateKey(privateKey: string, secret: string): string {
  const iv = crypto.randomBytes(16); // Initialization vector (IV)
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(secret, "hex"),
    iv
  );

  let encrypted = cipher.update(privateKey, "utf8", "hex");
  encrypted += cipher.final("hex");

  // Return IV and encrypted data (we'll need IV for decryption later)
  return iv.toString("hex") + ":" + encrypted;
}

// Function to decrypt the private key
export function decryptPrivateKey(
  encryptedData: string,
  secret: string
): string {
  const [iv, encrypted] = encryptedData.split(":"); // Split IV and encrypted data
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(secret, "hex"),
    Buffer.from(iv, "hex")
  );

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted; // Return the original private key
}

// Function to generate a new wallet (Ethereum account)
export const generateWallet = () => {
  const newAccount = web3.eth.accounts.create();
  return {
    public_key: newAccount.address,
    private_key: newAccount.privateKey,
  };
};
