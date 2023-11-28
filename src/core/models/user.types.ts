/**
 * @fileoverview User types.
 */
import { Document } from "mongoose";

export type UserType = Document & {
  username: string;
  password: string;
  spotifyAccessToken?: string;
  spotifyRefreshToken?: string;
};

export type UserOrNull = UserType | null;
export type UserPromiseOrNull = Promise<UserOrNull>;
