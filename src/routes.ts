/**
 * @fileoverview Routes for the application.
 */
import express from "express";
// import * as spotifyMiddleware from "./middleware/spotify.middleware";
import * as spotifyMiddleware from "./spotify/middleware";
import * as mainController from "./controllers/main.controller";
// import * as authController from "./controllers/authentication.controller";
import * as spotifyAuthController from "./spotify/authentication";
// import * as spotifyController from "./controllers/spotify.controller";
import * as spotifyController from "./spotify/controller";
import * as userController from "./controllers/user.controller";
import * as authMiddleware from "./middleware/auth.middleware";

const router = express.Router();

/** Base Routes **/
router.get("/", mainController.getIndex);

/** Spotify Authentication **/
router.get("/login", spotifyAuthController.getSpotifyCreds);
router.get("/logout", spotifyAuthController.SpotifyLogout);
router.get("/spotify-login-callback", spotifyAuthController.SpotifyLoginCallback);
router.get("/spotify-token", spotifyAuthController.SpotifyLoginToken);

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
router.post("/api/user/register", userController.register);
router.post("/api/user/login", userController.logIn);
router.get("/api/user/me", authMiddleware.checkToken, userController.getUser);

export default router;
