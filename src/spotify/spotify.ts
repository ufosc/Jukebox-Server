import querystring from "querystring";
import UserManager from "core/models/user.manager";
import { UserType } from "core/models/user.types";
import request from "request";
import { SpotifyResponse } from "./types";
import "dotenv/config";

const client_id = process.env.SP_ID; // Your client id
const client_secret = process.env.SP_SECRET; // Your secret
const redirect_uri = process.env.SP_URI || "http://localhost:8000/spotify-login-callback"; // Your redirect uri
const stateKey = "spotify_auth_state";

export default class SpotifyManager {
  static async redirectToSpotifyLogin(token: string, req: any, res: any) {
    let state = token;
    res.cookie(stateKey, state);

    let scope = "user-read-private user-read-email";
    console.log("pre state: " + state);
    return res.redirect(
      "https://accounts.spotify.com/authorize?" +
        querystring.stringify({
          response_type: "code",
          client_id: client_id,
          scope: scope,
          redirect_uri: redirect_uri,
          state: state,
        })
    );
  }

  static async getSpotifyTokens(
    code: string,
    state: string,
    userId: string
  ): Promise<SpotifyResponse> {
    if (state === null) throw new Error("Spotify state is null");
    let accessToken;
    let refreshToken;

    let authOptions = {
      url: "https://accounts.spotify.com/api/token",
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: "authorization_code",
      },
      headers: {
        Authorization: "Basic " + new Buffer(client_id + ":" + client_secret).toString("base64"),
      },
      json: true,
    };

    /** Make request to spotify API. */
    request.post(authOptions, (error: any, response: any, body: any) => {
      if (error || response.statusCode !== 200) throw new Error("Error getting spotify tokens");
      accessToken = body.access_token;
      refreshToken = body.refresh_token;

      let options = {
        url: "https://api.spotify.com/v1/me",
        headers: { Authorization: "Bearer " + accessToken },
        json: true,
      };

      /** Use the access token to access the Spotify API */
      request.get(options, (error: any, response: any, body: any) => {
        console.log("===== Spotify API Test =====");
        console.log(body);
      });

      UserManager.updateUser(userId, {
        spotifyAccessToken: accessToken,
        spotifyRefreshToken: refreshToken,
      });
    });

    if (!accessToken || !refreshToken) throw new Error("Error getting spotify tokens");

    let payload: SpotifyResponse = {
      accessToken,
      refreshToken,
    };

    return payload;
  }
}
