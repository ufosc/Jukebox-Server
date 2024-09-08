import { Router } from 'express'
import { isAuthenticated } from 'server/middleware'
import * as JamController from '../controllers/jamController'
import * as views from '../views/groupViews'

const router = Router()

router.post('/:id/spotify', isAuthenticated, views.assignSpotifyAccountView)
router.get('/:id/spotify/current-track', isAuthenticated, views.getGroupCurrentTrackView)
router.post('/:id/jam', JamController.startJam)
router.delete('/:id/jam', JamController.endJam)

router.post('/groups', views.groupCreateView)
router.get('/groups', views.groupListView)
router.get('/groups/:id', views.groupGetView)
router.put('/groups/:id', views.groupUpdateView)
router.patch('/groups/:id', views.groupPartialUpdateView)
router.delete('/groups/:id', views.groupDeleteView)

export const groupRoutes = router
