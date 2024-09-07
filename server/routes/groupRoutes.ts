import { Router } from 'express'
import * as GroupController from '../controllers/groupController'
import * as JamController from '../controllers/jamController'
import * as views from '../views/groupViews'

const router = Router()

router.post('/groups', views.groupCreateView)
router.get('/groups', views.groupListView)
router.get('/groups/:id', views.groupGetView)
router.put('/groups/:id', views.groupUpdateView)
router.patch('/groups/:id', views.groupPartialUpdateView)
router.delete('/groups/:id', views.groupDeleteView)

// router.post('/groups', GroupController.createGroup)
// router.post('/groups/:groupId/members', GroupController.createGroupMember)
// // router.post('/groups/:groupId/guests', GroupController.createSessionGuest)
// router.get('/groups/:groupId', GroupController.getGroup)
// router.put('/groups/:groupId', GroupController.updateGroup)
// router.patch('/groups/:groupId', GroupController.updateGroup)
// router.delete('/groups/:groupId', GroupController.deleteGroup)
// router.get('/groups/:groupId/members', GroupController.getGroupMembers)

router.post('/groups/:groupId/jam', JamController.startJam)
router.delete('/groups/:groupId/jam', JamController.endJam)

export const groupRoutes = router
