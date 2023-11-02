/**
 * @fileoverview User types.
 */
import { Document } from "mongoose";

export type UserType = Document & {
  username: string;
  password: string;
  accessToken?: string;
  refreshToken?: string;
};

export type UserOrNull = UserType | null;
