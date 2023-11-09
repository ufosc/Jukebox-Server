/**
 * @fileoverview User controller.
 */
import { Request, Response } from "express";
import UserManager from "../models/user.manager";

/** @api {get} /api/user/signup */
export const signUp = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await UserManager.createUser(username, password, {});
  res.send(user);
};

/** @api {get} /api/user/login */
export const logIn = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  // TODO: Implement Authentication

  let user = await UserManager.getUserByUsername(username);
  if (!user) {
    res.status(404).send("User not found");
    return;
  }

  res.send(user);
};

export const me = async (req: Request, res: Response) => {
  res.status(200).send("Not implemented");
};
