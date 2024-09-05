import { Router } from 'express'
import * as baseViews from '../views/baseViews'
import { groupRoutes } from './groupRoutes'
import { spotifyRouter } from './spotifyRoutes'
import { userRouter } from './userRoutes'
import { docsMiddleware } from '../middleware/docsMiddleware'

const router = Router()
router.get('/', baseViews.healthcheck)
router.get('/api', baseViews.apiHelp)

router.use(docsMiddleware)
router.use('/api/spotify', spotifyRouter)
router.use('/api/user', userRouter)
router.use('/api/group', groupRoutes)

export { router }
