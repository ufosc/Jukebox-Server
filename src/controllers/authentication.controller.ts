var querystring = require("querystring");
var cookieParser = require("cookie-parser");
var request = require("request"); // "Request" library
var fs = require('fs');
require("dotenv").config();
// const env_file = require('../../.env');

var client_id = process.env.SP_ID; // Your client id
var client_secret = process.env.SP_SECRET; // Your secret
var redirect_uri = process.env.SP_URI; // Your redirect uri
// var redirect_uri = 'http://localhost:3000/callback/'
var stateKey = "spotify_auth_state";

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function (length: number) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

exports.getSpotifyCreds = (req: any, res: any, next: any) => {
  /**
   * #swagger.tags = ['Authentication']
   * #swagger.summary = "Log into spotify"
   * #swagger.description = "This endpoint redirects to spotify to authenticate and return access token"
   */


  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = "user-read-private user-read-email";
  console.log("pre state: " + state);
  /**
    #swagger.responses[301] = {
      description: 'This is an example return value if spotify successfully redirects to /spotify-login-callback, which redirects to /spotify-token',
      schema: { $ref: '#/definitions/SpotifyAuthSuccess' }
    }
  */
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state,
      })
  );
};
exports.SpotifyLoginCallback = (req: any, res: any, next: any) => {
  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  //   var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null) {
    res.redirect(
      "/#" +
        querystring.stringify({
          error: "state_mismatch",
        })
    );
  } else {
    // res.clearCookie(stateKey);
    var authOptions = {
      url: "https://accounts.spotify.com/api/token",
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: "authorization_code",
      },
      headers: {
        Authorization:
          "Basic " +
          new Buffer(client_id + ":" + client_secret).toString("base64"),
      },
      json: true,
    };

    request.post(authOptions, (error: any, response: any, body: any) => {
      // #swagger.ignore = true
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token,
          refresh_token = body.refresh_token;

        var options = {
          url: "https://api.spotify.com/v1/me",
          headers: { Authorization: "Bearer " + access_token },
          json: true,
        };

        // use the access token to access the Spotify Web API
        request.get(options, (error: any, response: any, body: any) => {
          console.log("===== Spotify API Test =====");
          console.log(body);
        });

        // we can also pass the token to the browser to make requests from there
        res.redirect(
          "/spotify-token?access_token=" +
            access_token +
            "&refresh_token=" +
            refresh_token
        );
      } else {
        res.redirect(
          "/#" +
            querystring.stringify({
              error: "invalid_token",
            })
        );
      }
    });
  }
};

exports.SpotifyLoginToken = (req: any, res: any, next: any) => {
    // #swagger.ignore = true
    var access_token = req.query.access_token || null;
    var refresh_token = req.query.access_token || null;
    var err = req.query.err || null;
    var root = `http://${(process.env.HOST=='127.0.0.1') ? 'localhost' : process.env.HOST}:${process.env.PORT}`

    if (err == null) {
        res.json({
            success: true,
            access_token: access_token,
            refresh_token: refresh_token,
            home: root
        });
    } else {
        res.json({
            success: false,
            message: err,
        });
    }
};
