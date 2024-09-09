import { Router } from 'express'
import * as JamController from '../controllers/jamController'
import { isAuthenticated } from '../middleware/authMiddleware'
import * as views from '../views/groupViews'

const router = Router()

router.post('/:id/spotify', isAuthenticated, views.assignSpotifyAccountView)
router.get('/:id/spotify/current-track', isAuthenticated, views.getGroupCurrentTrackView)
router.post('/:id/spotify/state', isAuthenticated, views.setGroupPlayerStateView)
router.get('/:id/spotify/devices', isAuthenticated, views.getGroupDevicesView)
router.post('/:id/spotify/default-device', isAuthenticated, views.setGroupDefaultDeviceView)

router.post('/:id/jam', JamController.startJam)
router.delete('/:id/jam', JamController.endJam)

router.post('/groups', isAuthenticated, views.groupCreateView)
router.get('/groups', isAuthenticated, views.groupListView)
router.get('/groups/:id', isAuthenticated, views.groupGetView)
router.put('/groups/:id', isAuthenticated, views.groupUpdateView)
router.patch('/groups/:id', isAuthenticated, views.groupPartialUpdateView)
router.delete('/groups/:id', isAuthenticated, views.groupDeleteView)

export const groupRoutes = router
