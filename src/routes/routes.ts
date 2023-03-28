const path          = require('path');
const express       = require('express');
const router        = express.Router();
var cookieParser    = require("cookie-parser");

router.use(cookieParser());

// Middleware
var spotifyMiddleware =   require("../middleware/spotify.middleware");

// Controllers
var mainController =      require('../controllers/main.controller');
var authController =      require('../controllers/authentication.controller');
var spotifyController =   require('../controllers/spotify.controller');

/** Base Routes **/
router.get('/', mainController.getIndex);

/** Spotify Authentication **/
router.get('/login', authController.getSpotifyCreds);
router.get('/logout', authController.SpotifyLogout);
router.get('/spotify-login-callback', authController.SpotifyLoginCallback);
router.get('/spotify-token', authController.SpotifyLoginToken);

/** Spotify Communication **/
router.get('/spotify', spotifyMiddleware.AccessTokenExists, spotifyController.SpotifyTest);
router.get('/spotify/search', spotifyMiddleware.AccessTokenExists, spotifyController.SpotifySearch);


module.exports = router;
