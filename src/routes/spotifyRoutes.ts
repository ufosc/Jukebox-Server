import { Router } from 'express'
import { hasSpotifyToken } from 'src/middleware/authMiddleware'
import * as SpotifyController from '../controllers/spotifyController'

const router = Router()

/**== Spotify Authentication - /api/spotify/ ==**/
router.get('/login', SpotifyController.spotifyLogin)
router.get('/login-callback', SpotifyController.spotifyLoginCallback)

/**== Spotify Communication - /api/spotify/ ==**/
router.get('/', hasSpotifyToken, SpotifyController.spotifyTest)
router.get('/search', hasSpotifyToken, SpotifyController.spotifySearch)
router.get('/tracks', hasSpotifyToken, SpotifyController.spotifySearchTracks)
router.get('/tracks/:id', hasSpotifyToken, SpotifyController.spotifySearchTrackId)

export const spotifyRouter = router