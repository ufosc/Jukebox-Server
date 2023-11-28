/**
 * @fileoverview User controller.
 */
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import UserManager from "../models/user.manager";
import bcrypt from "bcrypt";
import { CustomRequest, TokenPayload, config } from "../jwt/config";

/** @api {get} /api/user/register */
export const register = async (req: Request, res: Response) => {
  /**
   * Create new user in db
   */
  const { username, password } = req.body;
  
  if (!username || !password) return res.status(400).send("Missing username or password");
  // console.log('request: ', req)

  const user = await UserManager.createUser(username, password, {}).catch((err) => {
    console.log(err);
    return res.status(400).send("Error creating user: " + err);
  });

  res.send(user);
};
 
/** @api {get} /api/user/login */
export const logIn = async (req: Request, res: Response) => {
  /**
   * generate token for user
   */
  const { username, password } = req.body;
  
  if (!username || !password) return res.status(400).send("Missing username or password");

  let user = await UserManager.getUserByUsername(username);
  if (!user) return res.status(404).send("User not found");
  
  const validPassword = await bcrypt.compare(password, user.password!);

  if (!validPassword) return res.status(400).send("Invalid password");
    

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
  const request = req as CustomRequest;
  const user = await UserManager.getUserByToken(request.token);

  if (!user) return res.status(404).send("User not found");

  res.status(200).send(user);
};

export const updateUser = async (req: Request, res: Response) => {};
