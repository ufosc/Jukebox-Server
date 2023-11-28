import { Request, Response } from "express";
import { CustomRequest } from "jwt/config";
import JwtManager from "jwt/jwt.manager";
import UserManager from "models/user.manager";
import SpotifyManager from "spotify/spotify.manager";

// TODO: implement this in react
export const loginWithSpotify = async (req: Request, res: Response) => {
  // const token = (<CustomRequest>req).token;
  const token = JwtManager.getTokenFromRequest(req).catch((error: any) => {
    console.log("Error getting token: ", error);
    return res.status(401).send("Error getting token: " + error);
  });

  const user = await UserManager.getUserByToken(token);

  SpotifyManager.redirectToSpotifyLogin(token.originalToken, req, res);
};

// TODO: implement this in react
export const getSpotifyToken = async (req: Request, res: Response) => {
  const code = req.query.code as string;
  const state = req.query.state as string;
  const error = req.query.error as string;

  const token = JwtManager.getTokenFromRequest(req).catch((error: any) => {
    console.log("Error getting token: ", error);
    return res.status(401).send("Error getting token: " + error);
  });
  const userId = token.userId;
  

  if (error) {
    console.log("Spotify Error: ", error);
    return res.status(401).send("Spotify Error: " + error);
  }

  if (!code) return res.status(400).send("Missing code or state");

  SpotifyManager.getSpotifyTokens(code, state, userId).then((response) => {
    res.json(response);
  });
};
