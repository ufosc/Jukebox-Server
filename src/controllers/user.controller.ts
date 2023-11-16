import jwt from 'jsonwebtoken';
/**
 * @fileoverview User controller.
 */
import { Request, Response } from "express";
import UserManager from "../models/user.manager";
import bcrypt from "bcrypt";
import { CustomRequest, config } from "../config";

/** @api {get} /api/user/register */
export const register = async (req: Request, res: Response) => {
  /**
   * Create new user in db
   */
  const { username, password } = req.body;
  
  
  // const salt = await bcrypt.genSalt(10);
  // const hashedPassword = await bcrypt.hash(password, salt);
  
  const user = await UserManager.createUser(username, password, {});
  
  res.send(user);
};

/** @api {get} /api/user/login */
export const logIn = async (req: Request, res: Response) => {
  /**
   * generate token for user
   */
  const { username, password } = req.body;
  
  console.log("username: ", username)
  console.log("password: ", password)

  let user = await UserManager.getUserByUsername(username);
  if (!user) {
    res.status(404).send("User not found");
    return;
  }
  // console.log("user password", typeof(user!.password))
  const validPassword = await bcrypt.compare(password, user.password!);
  
  if (!validPassword) {
    console.log("Invalid password")
    res.status(400).send("Invalid password");
    return;
  }
  
  const token = jwt.sign({ userId: user._id }, config.jwt.secret!, {
    expiresIn: config.jwt.expiresIn,
    issuer: config.jwt.issuer,
    algorithm: "HS256",
    notBefore: 0,
  });

  res.status(200).json({
    token: token,
  });
};

export const getUser = async (req: Request, res: Response) => {
  /**
   * Validate user token
   */
  const token = <string>req.headers["authorization"]
  let jwtPayload;
  
  console.log("token: ", token)
  
  try {
    jwtPayload = <any>jwt.verify(token?.split(' ')[1], config.jwt.secret!, {
      complete: true,
      issuer: config.jwt.issuer,
      algorithms: [config.jwt.algorithm as any],
      clockTolerance: 0,
      ignoreExpiration: false,
      ignoreNotBefore: false,
    });
    
    // (req as CustomRequest).token = jwtPayload.payload;
    
  } catch (error) {
    res.status(401).send("Invalid token");
    return;
  }
  
  let user = await UserManager.getUser(jwtPayload.payload.userId);
  if (!user) {
    res.status(404).send("User not found");
    return;
  }
  
  res.status(200).send(user);
  
  // res.status(200).send("Not implemented");
};

export const updateUser = async (req: Request, res: Response) => {}

