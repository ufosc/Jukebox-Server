import { Router } from 'express'
import { isAuthenticated } from '../middleware/authMiddleware'
import * as userViews from '../views/userViews'
import { UserViewset } from '../views/userViews'

const router = Router()

/**== User Authentication ==**/
router.post('/register', userViews.registerUserView)
router.post('/login', userViews.loginUserView)
router.post('/request-password-reset', userViews.requestPasswordResetView)
router.post('/reset-password', userViews.resetPasswordView)

/**== User Management ==**/
router.use('/users', isAuthenticated, UserViewset.registerRouter())

export const userRouter = router
