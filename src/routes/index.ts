import { Router } from 'express'
import * as BaseController from '../controllers/baseController'
import { spotifyRouter } from './spotifyRoutes'
import { userRouter } from './userRoutes'

const router = Router()
router.get('/', BaseController.healthCheck)
router.use('/api/spotify', spotifyRouter)
router.use('/api/user', userRouter)

export { router }
