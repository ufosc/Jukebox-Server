/*====== Primary Spotify Routes =======*/
var request             = require("request");

var spotifyTokenExpired = require('./responses/status_codes').SpotifyTokenExpired;


exports.SpotifyTest = (req: any, res: any, next: any) => {
    /**
     * #swagger.tags = ['Spotify']
     * #swagger.summary = "Test spotify connection"
     * #swagger.description = "This endpoint is meant to test the spotify connection and provide an example of how to make a request to spotify.
        This is also included in the testing suite to ensure proper connection."
     *
     */
    const options = {
        url: "https://api.spotify.com/v1/artists/0TnOYISbd1XYRBk9myaseg",
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8',
            'Authorization': 'Bearer ' + process.env.SP_TOKEN
        }
    };
    let json;
    request(options, (err: any, response: any, body: any) => {
        let json = JSON.parse(body);
        /*
        #swagger.responses[200] = {
              description: "Static response",
              schema: { $ref: '#/definitions/SpotifyTestResponse' }
        }

        */
       console.log(json["error"])
       if(json["error"]) {
        /**
        #swagger.responses[401] = {
            description: "Invalic token",
            schema: { $ref: '#/definitions/SpotifyTokenExpired' }
        }
         */
        res.status(401).json(spotifyTokenExpired);
       } else {
        res.json(json);
       }

    })
}


