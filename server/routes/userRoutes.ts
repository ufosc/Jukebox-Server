import { Router } from 'express'
import { isAuthenticated } from '../middleware/authMiddleware'
import * as views from '../views/userViews'

const router = Router()

/**== User Authentication ==**/
router.post('/register', views.registerUserView)
router.post('/token', views.loginUserView)
router.post('/request-password-reset', isAuthenticated, views.requestPasswordResetView)
router.post('/reset-password', isAuthenticated, views.resetPasswordView)

router.get('/me', isAuthenticated, views.currentUserView)
router.get('/me/spotify-accounts', isAuthenticated, views.connectedSpotifyAccounts)

/**== User Management ==**/
// router.use('/users', isAuthenticated, UserViewset.registerRouter())
router.post('/users', isAuthenticated, views.userCreateView)
router.get('/users', isAuthenticated, views.userListView)
router.get('/users/:id', isAuthenticated, views.userGetView)
router.put('/users/:id', isAuthenticated, views.userUpdateView)
router.patch('/users/:id', isAuthenticated, views.userPartialUpdateView)
router.delete('/users/:id', isAuthenticated, views.userDeleteView)

export const userRouter = router
