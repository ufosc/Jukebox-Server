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
  // #swagger.tags = ['Base']
  // #swagger.description = "Base starting point of the project, displays important data"

  /*
    #swagger.responses[200] = {
      description: 'Example data with redactions',
      schema: {
            success: true,
            login_route: "http://localhost:3000/login",
            documentation: "http://localhost:3000/doc",
            client_id: "ed***15da****fcbd9****4db0****f",
            client_secret: "f0******a5e0405*****************"
      }
    }
  */
  res.json({
    success: true,
    login_route: "http://localhost:3000/login",
    documenation: "http://localhost:3000/doc",
    client_id: client_id,
    client_secret: client_secret
  });

};

