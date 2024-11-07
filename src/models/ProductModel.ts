import mongoose, { Document, Schema, Types } from "mongoose";
import { IUser } from "./UserModel";
import UserModel from "./UserModel";

export interface IProduct extends Document {
  _id: string;
  title: string;
  description: string;
  productType: string;
  productFormat: string;
  imageURL: string;
  creator: Types.ObjectId | IUser;
  dropDate: Date;
  quantity: number;
  regularPrice: number;
  memberPrice: number;
  rarity: string;
  productIsLive: boolean;
  category: string[];
  membersOnly: boolean;
  isDemo: boolean;
  fanlimit: number;
  printSize: string;
  audioUrl: string;
  artist: string;
  songName: string;
  duration: number; //in minutes
  location: string;
  enabled: boolean;
  collaborator: Types.ObjectId | IUser;
  album: Types.ObjectId;
}

export enum TProductTabs {
  DIGITAL = "digital",
  PHYSICAL = "physical",
  EVENT = "event",
}

const ProductSchema: Schema<IProduct> = new Schema(
  {
    title: { type: String },
    description: { type: String },
    productType: {
      type: String,
      enum: Object.values(TProductTabs),
    },
    productFormat: { type: String }, // NFT, Vinyl, T-shirt, etc.
    imageURL: { type: String }, // If the product is a song/other media and has a cover image
    creator: { type: Types.ObjectId, ref: UserModel },
    dropDate: { type: Date }, // For digital producst
    quantity: { type: Number }, // For physical producst // stock limit
    regularPrice: { type: Number },
    memberPrice: { type: Number },
    rarity: { type: String },
    productIsLive: { type: Boolean, default: false },
    category: { type: [String] },
    membersOnly: { type: Boolean, default: false },
    isDemo: { type: Boolean, default: false },
    fanlimit: { type: Number, default: 0 },
    printSize: { type: String },
    audioUrl: { type: String },
    artist: { type: String },
    songName: { type: String },
    duration: { type: Number }, //in minutes
    location: { type: String },
    enabled: { type: Boolean, default: false, required: true },
    collaborator: { type: Types.ObjectId, ref: UserModel },
  },
  {
    timestamps: true,
  }
);

const ProductModel = mongoose.model<IProduct>("Product", ProductSchema);
export default ProductModel;
