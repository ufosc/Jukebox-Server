/*====== Primary API Routes =======*/
var querystring = require("querystring");
var cookieParser = require("cookie-parser");
var request = require("request"); // "Request" library

var client_id = process.env.SP_ID; // Your client id
var client_secret = process.env.SP_SECRET; // Your secret
var redirect_uri = process.env.SP_URI; // Your redirect uri
require("dotenv").config();

let baseResponse = {
    success: true,
    login_route: "http://localhost:3000/login",
    logout_route: "http://localhost:3000/logout",
    documenation: "http://localhost:3000/doc",
};

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
            logout_route: "http://localhost:3000/logout",
            documentation: "http://localhost:3000/doc",
      }
    }
  */
    res.json(baseResponse);
};
