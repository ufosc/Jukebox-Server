/*====== Primary Spotify Routes =======*/
var request = require("request");
var querystring = require("querystring");
var cookieParser = require("cookie-parser");

/* Json Responses */
var spotifyTokenExpired = {
    success: false,
    message: "Spotify access token expired",
    login: "http://localhost:3000/login",
};

let spotifyOptions = (url: string, query: string, req: any) => {
    var options = {
        url: "https://api.spotify.com/v1" + url + (query ? "?" + query : ""),
        method: "GET",
        headers: {
            Accept: "application/json",
            "Accept-Charset": "utf-8",
            Authorization: "Bearer " + req.cookies.access_token,
        },
    };
    return options;
};
const spotifyResultsJson = (count: number, body: any) => {
    var results = [];

    // try {
    for (var i = 0; i < count; i++) {
        var result = {
            name: body["tracks"]["items"][i]["name"] || "",
            uri: body["tracks"]["items"][i]["uri"] || "",
            // id: body["tracks"]["items"][i]["id"] || "",
            link: body["tracks"]["items"][i]["external_urls"]["spotify"] || "",
        };
        results.push(result);
    }
    return results;
    // } catch(err) {
    // return {
    //     success: false,
    //     message: err,
    //     request: body
    // };
    // }
};

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
        method: "GET",
        headers: {
            Accept: "application/json",
            "Accept-Charset": "utf-8",
            Authorization: "Bearer " + req.cookies.access_token,
        },
    };
    request(options, (err: any, response: any, body: any) => {
        let json = JSON.parse(body);
        /*
        #swagger.responses[200] = {
              description: "Static response",
              schema: { $ref: '#/definitions/SpotifyTestResponse' }
        }

        */
        if (response.statusCode == 400) {
            res.status(400).json(json);
        } else {
            res.json(json);
        }
    });
};

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
    var options = spotifyOptions("/search", query, req);

    request(options, (err: any, response: any, body: string) => {
        let json = JSON.parse(body);

        /**
        #swagger.responses[200] = {
            description: "Success",
            schema: { $ref: '#/definitions/SpotifySearchResult' }
        }
        */
        if (response.statusCode == 400) {
            res.status(400).json(json);
        } else {
            var searchResult = {
                name: json["tracks"]["items"][0]["name"] || "",
                uri: json["tracks"]["items"][0]["uri"] || "",
                id: json["tracks"]["items"][0]["id"] || "",
                link: json["tracks"]["items"][0]["external_urls"]["spotify"] || "",
            };

            res.json(searchResult);
        }
    });
};

exports.SpotifySearchTracks = (req: any, res: any, next: any) => {
    // Available params: album, artist, track, year, upc, tag:hipster, tag:new, isrc, and genre
    /**
        #swagger.tags = ['Spotify']
        #swagger.summary = "Search Spotify with query params"
        #swagger.description = "Use this endpoint to more easily search for a song on Spotify."
     */
    // var q_string = `artist:${req.query.artist} album:${req.query.album} track:${req.query.track}`;

    var query = querystring.stringify({
        q:
            (req.query.artist ? "artist:" + req.query.artist : "") +
            (req.query.album ? " album:" + req.query.album : "") +
            (req.query.track ? " track:" + req.query.track : ""),
        type: "track",
    });
    var options = spotifyOptions("/search", query, req);

    request(options, (err: any, response: any, body: string) => {
        let json = JSON.parse(body);

        /**
        #swagger.responses[200] = {
            description: "Success",
            schema: { $ref: '#/definitions/SpotifySearchResult' }
        }
        */
        if (response.statusCode == 400) {
            res.status(400).json(json);
        } else {
            var searchResult = spotifyResultsJson(req.query.limit, json);

            res.json(searchResult);
        }
    });
};

exports.SpotifySearchId = (req: any, res: any, next: any) => {
    /**
        #swagger.tags = ['Spotify']
        #swagger.summary = "Search for song by ID"
        #swagger.description = "Use this endpoint to search for a song on Spotify by ID."
     */
    var query = "";
    var options = spotifyOptions("/tracks/" + req.query.id, query, req);

    request(options, (err: any, response: any, body: string) => {
        let json = JSON.parse(body);

        /**
        #swagger.responses[200] = {
            description: "Success",
            schema: { $ref: '#/definitions/SpotifySearchResult' }
        }
        */
        if (response.statusCode == 400) {
            res.status(400).json(json);
        } else {
            console.log(json);
            // var searchResult = spotifyResultsJson(1, json);
            var searchResult = {
                name: json["name"] || "",
                uri: json["uri"] || "",
                id: json["id"] || "",
                artist: json["artists"][0]["name"] || "",
            };

            res.json(searchResult);
        }
    });
};
