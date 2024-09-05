// /**
//  * CRUD Structure:
//  * /api/{RESOURCE}/{OBJECTS}
//  *
//  * Actions:
//  * /api/{RESOURCE}/{ACTION}
//  */

// import { Router } from 'express'
// import * as BaseController from '../controllers/baseController'
// import { groupRoutes } from './groupRoutes'
// import { spotifyRouter } from './spotifyRoutes'
// import { userRouter } from './userRoutes'

// const router = Router()
// router.get('/api', BaseController.healthCheck)
// router.use('/api/spotify', spotifyRouter)
// router.use('/api/user', userRouter)
// router.use('/api/group', groupRoutes)

// export { router }
/**
 * @module router
 * @description Network ingress/egress router
 *
 * The routers are responsible for defining which
 * endpoints are available, and directing requests from
 * those endpoints to the appropriate views. They can
 * only reference views and middleware.
 */

export { router } from './router'
