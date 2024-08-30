import { Router } from 'express'
import { hasSpotifyToken } from 'server/middleware/authMiddleware'
import * as SpotifyController from '../controllers/spotifyController'
import { isAuthenticated } from './../middleware/authMiddleware'

const router = Router()

/**== Spotify Authentication - /api/spotify/ ==**/
router.get('/login', isAuthenticated, SpotifyController.spotifyLogin)
router.get('/login-callback', SpotifyController.spotifyLoginCallback)

/**== Spotify Communication - /api/spotify/ ==**/
router.get('/me', isAuthenticated, hasSpotifyToken, SpotifyController.getUserProfile)
router.get('/search', isAuthenticated, hasSpotifyToken, SpotifyController.spotifySearch)
router.get('/tracks', isAuthenticated, hasSpotifyToken, SpotifyController.spotifySearchTracks)
router.get('/tracks/:id', isAuthenticated, hasSpotifyToken, SpotifyController.spotifySearchTrackId)

export const spotifyRouter = router
