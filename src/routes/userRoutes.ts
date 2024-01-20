import { Router } from 'express'
import * as UserController from '../controllers/userController'
import { isAuthenticated } from '../middleware/authMiddleware'

const router = Router()

/**== User Authentication - /api/user/ ==**/
router.post('/register', UserController.register)
router.post('/login', UserController.logIn)

/**== User Management - /api/user/ ==**/
router.get('/user', isAuthenticated, UserController.getUser)
router.patch('/user/:id', isAuthenticated, UserController.updateUser)
router.put('/user/:id', isAuthenticated, UserController.updateUser)
router.delete('/user/:id', isAuthenticated, UserController.deleteUser)

export const userRouter = router
