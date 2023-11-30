/**
 * @fileoverview Routes for the application.
 */
import express, { NextFunction, Request, Response } from "express";
import * as spotifyMiddleware from "./spotify/middleware";
import * as mainController from "./core/controllers/main.controller";
import * as spotifyAuthController from "./spotify/authentication";
import * as spotifyController from "./spotify/controller";
import * as userController from "./core/controllers/user.controller";
import * as authMiddleware from "./core/middleware/auth.middleware";

const router = express.Router();

/** ============================================== **/
/** API ROUTES - Appended to /api/ as base for api **/
/** ============================================== **/

/**== Base Routes - /api/ ==**/
router.get("/", mainController.getIndex);

/**== Spotify Authentication - /api/spotify/ ==**/
router.get("/spotify/login", spotifyAuthController.getSpotifyCreds);
router.get("/spotify/logout", spotifyAuthController.SpotifyLogout);
router.get("/spotify/login-callback", spotifyAuthController.SpotifyLoginCallback);
router.get("/spotify/token", spotifyAuthController.SpotifyLoginToken);

/**== Spotify Communication - /api/spotify/ ==**/
router.get("/spotify", spotifyMiddleware.AccessTokenExists, spotifyController.SpotifyTest);
router.get("/spotify/search", spotifyMiddleware.AccessTokenExists, spotifyController.SpotifySearch);
router.get(
  "/spotify/search-tracks",
  spotifyMiddleware.AccessTokenExists,
  spotifyController.SpotifySearchTracks
);
router.get(
  "/spotify/search-id/:id",
  spotifyMiddleware.AccessTokenExists,
  spotifyController.SpotifySearchId
);

/**== User Routes - /api/user/ ==**/
router.post("/user/register", userController.register);
router.post("/user/login", userController.logIn);
router.get("/user/me", authMiddleware.checkToken, userController.getUser);

export default router;
