import 'dotenv/config';
import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export const config = {
  jwt: {
    secret: process.env.JWT_SECRET_KEY || "secret",
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    issuer: process.env.JWT_ISSUER || "jukebox",
    algorithm: "HS256",
  }
}

export interface CustomRequest extends Request {
  token: JwtPayload;
}