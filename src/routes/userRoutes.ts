import { Router } from 'express'
import * as UserController from '../controllers/userController'
import { isAuthenticated } from '../middleware/authMiddleware'

const router = Router()
// const controller = UserController

/**== User Authentication ==**/
router.post('/register', UserController.register)
router.post('/login', UserController.login)

/**== User Management ==**/
router.get('/user', isAuthenticated, UserController.getUser)
router.patch('/user/:id', isAuthenticated, UserController.updateUser)
router.put('/user/:id', isAuthenticated, UserController.updateUser)
router.delete('/user/:id', isAuthenticated, UserController.deleteUser)

export const userRouter = router
