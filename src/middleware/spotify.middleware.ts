var request         = require("request");
var cookieParser    = require("cookie-parser");

var spotifyTokenExpired = {
    success: false,
    message: "Access token not set, please log in",
    login: "http://localhost:3000/login"
}
exports.AccessTokenExists = (req: any, res: any, next: any) => {
    /**
        #swagger.responses[401] = {
            description: "Spotify Access Token Expired",
            schema: { $ref: '#/definitions/SpotifyTokenExpired' }
        }
     */
    if(!req.cookies.hasOwnProperty("access_token")) {
        res.status(401).json(spotifyTokenExpired);
    } else {
        next();
    }
}


