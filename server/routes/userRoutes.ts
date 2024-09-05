import { Router } from 'express'
import { isAuthenticated } from '../middleware/authMiddleware'
import * as userViews from '../views/userViews'
import { UserViewset } from '../views/userViews'

const router = Router()

/**== User Authentication ==**/
router.post('/register', userViews.registerUserView)
router.post('/login', userViews.loginUserView)
router.get('/me', isAuthenticated, userViews.currentUserView)
router.post('/request-password-reset', isAuthenticated, userViews.requestPasswordResetView)
router.post('/reset-password', isAuthenticated, userViews.resetPasswordView)

/**== User Management ==**/
router.use('/users', isAuthenticated, UserViewset.registerRouter())

export const userRouter = router
