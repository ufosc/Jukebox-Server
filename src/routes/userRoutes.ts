import { Router } from 'express'
import * as UserController from '../controllers/userController'
import { hasAuthToken } from '../middleware/authMiddleware'

const router = Router()

/**== User Authentication - /api/user/ ==**/
router.post('/register', UserController.register)
router.post('/login', UserController.logIn)

/**== User Management - /api/user/ ==**/
router.get('/user', hasAuthToken, UserController.getUser)
router.patch('/user/:id', hasAuthToken, UserController.updateUser)
router.put('/user/:id', hasAuthToken, UserController.updateUser)
router.delete('/user/:id', hasAuthToken, UserController.deleteUser)

export const userRouter = router