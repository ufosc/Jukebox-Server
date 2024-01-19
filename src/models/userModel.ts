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
  spotifyAccessToken: {
    type: String,
    required: false,
  },
  spotifyRefreshToken: {
    type: String,
    required: false,
  },
});

export const User = mongoose.model("User", UserSchema);

export type User = InstanceType<typeof User>;