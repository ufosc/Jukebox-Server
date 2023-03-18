const path = require('path');
const express = require('express');
const router = express.Router();

const mainController = require('../controllers/main.controller');
const spotifyController = require('../controllers/authentication.controller');

/** Primary Routes **/
router.get('/', mainController.getIndex);

/** Spotify Authentication **/
router.get('/login', spotifyController.getSpotifyCreds);
router.get('/spotify-login-callback', spotifyController.SpotifyLoginCallback);
router.get('/spotify-token', spotifyController.SpotifyLoginToken);


module.exports = router;
