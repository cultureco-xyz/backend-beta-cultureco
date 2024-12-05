import mongoose, { Schema, Types } from "mongoose";
import UserModel, { IUser } from "./UserModel";

interface IGeneratedWallet {
  userID: Types.ObjectId | IUser;
  public_key: string;
  encrypted_private_key: string;
}

const GeneratedWalletSchema: Schema = new Schema(
  {
    userID: { type: Types.ObjectId, ref: UserModel },
    public_key: { type: String, required: true },
    encrypted_private_key: { type: String, required: true },
  },
  {
    timestamps: true, // Automatically add `createdAt` and `updatedAt` fields
  }
);

const GeneratedWallet = mongoose.model<IGeneratedWallet>(
  "GeneratedWallet",
  GeneratedWalletSchema
);

export default GeneratedWallet;
