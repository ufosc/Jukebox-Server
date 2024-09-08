import { Router } from 'express'
import * as views from '../views/spotifyAuthViews'
import { isAuthenticated } from './../middleware/authMiddleware'

const router = Router()

/**== Spotify Authentication - /api/spotify/ ==**/
router.get('/login', isAuthenticated, views.spotifyLoginView)
router.get('/login-callback', views.spotifyLoginCallbackView)
router.delete('/', isAuthenticated, views.removeSpotifyConnection)

export const spotifyRouter = router
