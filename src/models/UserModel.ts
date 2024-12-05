import mongoose, { Document, Schema } from "mongoose";

// Define an enum for the possible user roles
export enum UserRole {
  CREATOR = "creator",
  USER = "user",
}

export enum CREATOR_TYPES {
  ARTIST = "Artist",
  MUSICIAN = "Musician",
}

// Interface for TypeScript to enforce schema typing
export interface IUser extends Document {
  name: string;
  username: string;
  email: string;
  bio: string;
  profilePicture: string;
  role: UserRole;
  claimCode?: string;
  creatorType?: CREATOR_TYPES;
  isDemo?: boolean;
  demoCreatorEmail?: string;
  createdAt: Date;
  updatedAt: Date;
  isClaimed: boolean;
}

// Define the user schema
const userSchema: Schema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    username: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    bio: {
      type: String,
    },
    profilePicture: {
      type: String,
    },
    role: {
      type: String,
      enum: Object.values(UserRole), // Ensures role is either "creator" or "user"
      default: UserRole.USER,
    },
    isDemo: {
      type: Boolean,
    },
    claimCode: {
      type: String,
      unique: true,
    },
    isClaimed: {
      type: Boolean,
    },
    demoCreatorEmail: {
      type: String,
    },
    creatorType: {
      type: String,
      enum: Object.values(CREATOR_TYPES),
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// Create and export the model
const UserModel = mongoose.model<IUser>("User", userSchema);
export default UserModel;
