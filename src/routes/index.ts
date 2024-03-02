/**
 * CRUD Structure:
 * /api/{RESOURCE}/{OBJECTS}
 *
 * Actions:
 * /api/{RESOURCE}/{ACTION}
 */

import { Router } from 'express'
import * as BaseController from '../controllers/baseController'
import { groupRoutes } from './groupRoutes'
import { spotifyRouter } from './spotifyRoutes'
import { userRouter } from './userRoutes'

const router = Router()
router.get('/', BaseController.healthCheck)
router.use('/api/spotify', spotifyRouter)
router.use('/api/user', userRouter)
router.use('/api/group', groupRoutes)

export { router }
