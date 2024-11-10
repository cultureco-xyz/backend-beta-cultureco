import mongoose, { Document, ObjectId, Schema, Types } from "mongoose";
import UserModel, { IUser } from "./UserModel";

interface IFollow {
  follower: ObjectId | IUser;
  following: ObjectId | IUser;
  isMember: boolean;
}

const FollowSchema: Schema<IFollow> = new Schema({
  follower: { type: Types.ObjectId, required: true, ref: UserModel },
  following: { type: Types.ObjectId, required: true, ref: UserModel },
  isMember: { type: Boolean, required: true, default: false },
});

const FollowModel = mongoose.model<IFollow>("Follow", FollowSchema);
export default FollowModel;
