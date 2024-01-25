import { isAuthenticated } from './../middleware/authMiddleware';
import { Router } from 'express'
import { hasSpotifyToken } from 'src/middleware/authMiddleware'
import * as SpotifyController from '../controllers/spotifyController'

const router = Router()

/**== Spotify Authentication - /api/spotify/ ==**/
router.get('/login', isAuthenticated, SpotifyController.spotifyLogin)
router.get('/login-callback', SpotifyController.spotifyLoginCallback)
// router.get('/tokens', isAuthenticated, hasSpotifyToken, SpotifyController.spotifyTokens)

/**== Spotify Communication - /api/spotify/ ==**/
router.get('/', hasSpotifyToken, SpotifyController.spotifyTest)
router.get('/search', hasSpotifyToken, SpotifyController.spotifySearch)
router.get('/tracks', hasSpotifyToken, SpotifyController.spotifySearchTracks)
router.get('/tracks/:id', hasSpotifyToken, SpotifyController.spotifySearchTrackId)

export const spotifyRouter = router