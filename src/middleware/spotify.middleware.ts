/*====== Middleware For Spotify Routes =======*/

let spotifyTokenExpired = {
    success: false,
    message: "Access token not set, please log in",
    login: "http://localhost:8000/login",
};

exports.AccessTokenExists = (req: any, res: any, next: any) => {
    /*
    #swagger.responses[401] = {
        description: 'Spotify Access Token Expired',
        schema: { $ref: "#/definitions/SpotifyTokenExpired" }
    }
     */
    if (!req.cookies.hasOwnProperty("access_token")) {
        res.status(401).json(spotifyTokenExpired);
    } else {
        next();
    }
};
