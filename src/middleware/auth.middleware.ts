/**
 * @fileoverview Authentication middleware.
 */
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { CustomRequest, TokenPayload, config } from "../jwt/config";
import UserManager from "../models/user.manager";
import { NextFunction, Request, Response } from "express";

export const checkToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = <string>req.headers["authorization"];
  let jwtPayload;
  

  try {
    jwtPayload = <any>jwt.verify(token?.split(" ")[1], config.jwt.secret!, {
      complete: true,
      issuer: config.jwt.issuer,
      algorithms: [config.jwt.algorithm as any],
      clockTolerance: 0,
      ignoreExpiration: false,
      ignoreNotBefore: false,
    });
    
    jwtPayload.payload.originalToken = token;

    (req as CustomRequest).token = jwtPayload.payload as TokenPayload;
  } catch (error) {
    return res.status(401).send("Invalid token");
  }

  return next();
};
