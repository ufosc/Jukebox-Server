# Working With Spotify in Jukebox

- [Setting up Spotify](#setting-up-spotify)
  - [1. Create spotify app](#1-create-spotify-app)
    - [Creating the App](#creating-the-app)
    - [Adding Authorized Users](#adding-authorized-users)
    - [Connecting to the Development Environment](#connecting-to-the-development-environment)
  - [2. Getting The Spotify Auth Code](#2-getting-the-spotify-auth-code)
- [Resources](#resources)
  - [General Links](#general-links)
  - [Web Playback SDK](#web-playback-sdk)
  - [Web API](#web-api)

## Setting up Spotify

The server gets its services from Spotify, as such using its developer account allows the server access to Spotify's artists, playlists, and algorithms

### 1. Create spotify app

A Spotify app is essentially a spotify developer account where you can access their api and other developer services. After you get access to the dashboard you can create additional apps in the future for other personal projects.

#### Creating the App

To create an app refer to their guide: [Developer.Spotify.com](https://developer.spotify.com/documentation/general/guides/authorization/app-settings/). During setup, here are the recommended settings:

- The **Name** can be anything, I chose OSC Jukebox
- For **Website**, you can enter any value. This value is only used when pushed to production, spotify will verify requests coming from that url. But, since the Spotify App is in development mode it shouldn't matter.
- For **Redirect URI** enter the following urls, they are the redirect urls that spotify will send you to once you are authenticated, and how the server get's your credentials from spotify.
  - `http://localhost:8000/api/v1/spotify/login/success/`
  - `http://localhost:8080/api/v1/spotify/login/success/`
- Ignore **Bundle IDs and Android Packages**
- For **"Which API/SDKs are you planning to use?"**, you can select **Web API** and **Web Playback SDK**.

#### Adding Authorized Users

After this is created, go to the **User Management** tab in the dashboard and add your spotify account as a user. The email you enter must be the same email attached to your spotify account. If your account is not properly connecting to spotify, this may be why.

#### Connecting to the Development Environment

Back in the project, copy the `sample.env` file to a new `.env` file:

```sh
cp sample.env .env
```

Copy **Client ID** and **Client Secret** from the Spotify App dashboard, and place as values for the `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` variables respectively. Example:

```txt
SPOTIFY_CLIENT_ID="abc123"
SPOTIFY_CLIENT_SECRET="supersecret"
```

### 2. Getting The Spotify Auth Code

> Spotify Authentication URL: <http://localhost:8000/api/v1/spotify/login/>

Once you have the Spotify App and the project set up, the last step is to authenticate Spotify with the Jukebox server. To do so, visit <http://localhost:8000/api/v1/spotify/login/>. This will redirect you to the <http://localhost:8000/api/v1/spotify/login/success/> route which will display your account details in JSON format to verify the connection was successful.

_Note: if you are in `network` mode, replace localhost:8000 with localhost:8080._

In the project, `/api/v1/spotify/login/` has implemented Spotify's access token authorization code they provide on GitHub, you can look over it [here](https://github.com/spotify/web-api-examples/blob/master/authentication/authorization_code/app.js). The access token spotify returns back is stored in the database as a `SpotifyAccount`. This account can then be attached to a Jukebox via a `JukeboxLink`.

## Resources

### General Links

- Dashboard: <https://developer.spotify.com/dashboard>
- How spotify authorization works: <https://developer.spotify.com/documentation/web-api/tutorials/code-flow>
- Spotify's GitHub: <https://github.com/spotify>

### Web Playback SDK

The web playback sdk allows users to select the frontend web app to play music through as a sort of speaker.

- Docs: <https://developer.spotify.com/documentation/web-playback-sdk>

### Web API

The web api allows more granular control over spotify functionality via a server application.

- Docs: <https://developer.spotify.com/documentation/web-api>
