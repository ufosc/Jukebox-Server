/*====== Primary Spotify Routes =======*/
var request         = require("request");
var querystring     = require("querystring");

/* Json Responses */
let spotifyTokenExpired = {
    success: false,
    message: "Spotify access token expired",
    login: "http://localhost:3000/login"
}

let spotifyOptions = (url: string, query: string) => {
    var options = {
        url: 'https://api.spotify.com/v1' + url + '?' + query,
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8',
            'Authorization': 'Bearer ' + process.env.SP_TOKEN
        }
    };
    return options;
}

/* Route methods */
exports.SpotifyTest = (req: any, res: any, next: any) => {
    /**
        #swagger.tags = ['Spotify']
        #swagger.summary = "Test spotify connection"
        #swagger.description = "This endpoint is meant to test the spotify connection and provide an example of how to make a request to spotify.
            This is also included in the testing suite to ensure proper connection."
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
    request(options, (err: any, response: any, body: any) => {
        let json = JSON.parse(body);
        /*
        #swagger.responses[200] = {
              description: "Static response",
              schema: { $ref: '#/definitions/SpotifyTestResponse' }
        }
        #swagger.responses[401] = {
            description: "Invalid token",
            schema: { $ref: '#/definitions/SpotifyTokenExpired' }
        }

        */
       if(json["error"]) {
        res.status(401).json(spotifyTokenExpired);
       } else {
        res.json(json);
       }

    })
}

exports.SpotifySearch = (req: any, res: any, next: any) => {
     /**
        #swagger.tags = ['Spotify']
        #swagger.summary = "Search Spotify with query params"
        #swagger.description = "Use this endpoint to use Spotify's search feature, it returns the first song in the result."
     */
    var query = querystring.stringify({
        q: req.query.q,
        type: req.query.type,
    });
    var options = spotifyOptions('/search', query);

    request(options, (err: any, response: any, body: string) => {
        let json = JSON.parse(body);

        /**
        #swagger.responses[200] = {
            description: "Success",
            schema: { $ref: '#/definitions/SpotifySearchResult' }
        }
        #swagger.responses[400] = {
            description: "Invalid token",
            schema: { $ref: '#/definitions/SpotifyTokenExpired' }
        }
        */
        if(json["error"]) {
        res.status(400).json(spotifyTokenExpired);
        } else {
            var searchResult = {
                name: json["tracks"]["items"][0]["name"],
                uri: json["tracks"]["items"][0]["uri"],
                link: json["tracks"]["items"][0]["external_urls"]["spotify"]
            }

            res.json(searchResult);
        }

    });

}
