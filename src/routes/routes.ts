const path = require('path');
const express = require('express');
const router = express.Router();

const mainController =      require('../controllers/main.controller');
const authController =      require('../controllers/authentication.controller');
const spotifyController =   require('../controllers/spotify.controller');

/** Base Routes **/
router.get('/', mainController.getIndex);

/** Spotify Authentication **/
router.get('/login', authController.getSpotifyCreds);
router.get('/spotify-login-callback', authController.SpotifyLoginCallback);
router.get('/spotify-token', authController.SpotifyLoginToken);

/** Spotify Communication **/
router.get('/spotify', spotifyController.SpotifyTest);


module.exports = router;
