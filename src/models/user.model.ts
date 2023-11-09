/**
 * @fileoverview User model
 */
import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    index: true,
    dropDups: true,
  },
  password: {
    type: String,
    required: true,
  },
  accessToken: {
    type: String,
    required: false,
  },
  refreshToken: {
    type: String,
    required: false,
  },
});

const User = mongoose.model("User", UserSchema);
export default User;

export type UserType = InstanceType<typeof User>;