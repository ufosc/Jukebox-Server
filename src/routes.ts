/**
 * @fileoverview Routes for the application.
 */
import express from "express";
import * as spotifyMiddleware from "./middleware/spotify.middleware";
import * as mainController from "./controllers/main.controller";
import * as authController from "./controllers/authentication.controller";
import * as spotifyController from "./controllers/spotify.controller";
import * as userController from "./controllers/user.controller";

const router = express.Router();

/** Base Routes **/
router.get("/", mainController.getIndex);

/** Spotify Authentication **/
router.get("/login", authController.getSpotifyCreds);
router.get("/logout", authController.SpotifyLogout);
router.get("/spotify-login-callback", authController.SpotifyLoginCallback);
router.get("/spotify-token", authController.SpotifyLoginToken);

/** Spotify Communication **/
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

/** User Routes */
router.post("/api/user/signup", userController.signUp);
router.post("/api/user/login", userController.logIn);
router.get("/api/user/me", userController.me);

export default router;