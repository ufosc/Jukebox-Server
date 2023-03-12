/*====== Primary API Routes =======*/
var querystring = require("querystring");
var cookieParser = require("cookie-parser");
var request = require("request"); // "Request" library
require("dotenv").config();

var client_id = process.env.SP_ID; // Your client id
var client_secret = process.env.SP_SECRET; // Your secret
var redirect_uri = process.env.SP_URI; // Your redirect uri
// var redirect_uri = 'http://localhost:3000/callback/'

/** Base route for api **/
exports.getIndex = (req: any, res: any, next: any) => {
  res.json({
    success: true,
    login_route: "http://localhost:3000/login",
    client_id: client_id,
    client_secret: client_secret
  });
};

