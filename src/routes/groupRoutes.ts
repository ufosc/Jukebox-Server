import { Router } from 'express'
import * as GroupController from '../controllers/groupController'

const router = Router()

router.post('groups', GroupController.createGroup)
router.post('groups/:groupId/members', GroupController.createGroupMember)
router.post('groups/:groupId/guests', GroupController.createSessionGuest)
router.get('groups/:groupId', GroupController.getGroup)
router.put('groups/:groupId', GroupController.updateGroup)
router.patch('groups/:groupId', GroupController.updateGroup)
router.delete('groups/:groupId', GroupController.deleteGroup)
router.get('groups/:groupId/members', GroupController.getGroupMembers)

export const groupRoutes = router
