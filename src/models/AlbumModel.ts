import mongoose, { Schema, Types } from "mongoose";
import UserModel, { IUser } from "./UserModel";

export interface IAlbum {
  name: string;
  cover_url: string;
  userID: Types.ObjectId | IUser;
}

const AlbumSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    cover_url: { type: String, required: true },
    userID: { type: Types.ObjectId, ref: UserModel },
  },
  {
    timestamps: true, // Automatically add `createdAt` and `updatedAt` fields
  }
);

const AlbumModel = mongoose.model<IAlbum>("Album", AlbumSchema);

export default AlbumModel;
