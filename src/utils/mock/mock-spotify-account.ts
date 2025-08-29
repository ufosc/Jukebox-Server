import { CreateSpotifyAccountDto, SpotifyAccountDto } from "src/spotify/dto";

export const mockSpotifyAccount: CreateSpotifyAccountDto = {
    user_id: 0,
    spotify_email: '',
    tokens: {
        access_token: "",
        refresh_token: "",
        expires_in: 200,
        token_type: "",
    }
}