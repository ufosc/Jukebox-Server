/*====== Primary Spotify Routes =======*/
import querystring from "querystring";
import cookieParser from "cookie-parser";
import request from "request";

/* Json Responses */
let spotifyTokenExpired = {
    success: false,
    message: "Spotify access token expired",
    login: "http://localhost:3000/login",
};

let spotifyOptions = (url: string, query: string, req: any) => {
    let options = {
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
    let results = [];

    // try {
    for (let i = 0; i < count; i++) {
        let result = {
            name: body["tracks"]["items"][i]["name"] || "",
            uri: body["tracks"]["items"][i]["uri"] || "",
            // id: body["tracks"]["items"][i]["id"] || "",
            link: body["tracks"]["items"][i]["external_urls"]["spotify"] || "",
        };
        results.push(result);
    }
    return results;
};

/* Route methods */
exports.SpotifyTest = (req: any, res: any, next: any) => {
    /*
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
            description: 'This is an example return value if spotify successfully redirects to /spotify-login-callback, which redirects to /spotify-token',
            schema: { $ref: '#/definitions/SpotifyAuthSuccess' }
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
    /*
    #swagger.tags = ['Spotify']
    #swagger.summary = "Search Spotify with query params"
    #swagger.description = "Use this endpoint to more easily search for a song on Spotify."
    */
    let query = querystring.stringify({
        q: req.query.q,
        type: req.query.type,
    });
    let options = spotifyOptions("/search", query, req);

    request(options, (err: any, response: any, body: string) => {
        let json = JSON.parse(body);
        /*
        #swagger.responses[200] = {
            description: "Success",
            schema: { $ref: '#/definitions/SpotifyAuthResult' }
        }
        */
        if (response.statusCode == 400) {
            res.status(400).json(json);
        } else {
            let searchResult = {
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
    /*
    #swagger.tags = ['Spotify']
    #swagger.summary = "Search Spotify with query params"
    #swagger.description = "Use this endpoint to more easily search for a song on Spotify."
    */
    let query = querystring.stringify({
        q:
            (req.query.artist ? "artist:" + req.query.artist : "") +
            (req.query.album ? " album:" + req.query.album : "") +
            (req.query.track ? " track:" + req.query.track : ""),
        type: "track",
    });
    let options = spotifyOptions("/search", query, req);

    request(options, (err: any, response: any, body: string) => {
        /*
        #swagger.responses[200] = {
            description: "Success",
            schema: { $ref: '#/definitions/SpotifyAuthResult' }
        }
        */
        let json = JSON.parse(body);

        if (response.statusCode == 400) {
            res.status(400).json(json);
        } else {
            let searchResult = spotifyResultsJson(req.query.limit, json);

            res.json(searchResult);
        }
    });
};

exports.SpotifySearchId = (req: any, res: any, next: any) => {
    /*
    #swagger.tags = ['Spotify']
    #swagger.summary = "Search for song by ID"
    #swagger.description = "Use this endpoint to search for a song on Spotify by ID."
     */
    let query = "";
    let options = spotifyOptions("/tracks/" + req.query.id, query, req);

    request(options, (err: any, response: any, body: string) => {
        let json = JSON.parse(body);
        /*
        #swagger.responses[200] = {
            description: "Success",
            schema: { $ref: '#/definitions/SpotifySearchResult' }
        }
         */
        if (response.statusCode == 400) {
            res.status(400).json(json);
        } else {
            console.log(json);
            // let searchResult = spotifyResultsJson(1, json);
            let searchResult = {
                name: json["name"] || "",
                uri: json["uri"] || "",
                id: json["id"] || "",
                artist: json["artists"][0]["name"] || "",
            };

            res.json(searchResult);
        }
    });
};
