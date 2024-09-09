import type { NextFunction, Request, Response } from 'express'
import {
  assignSpotifyToGroup,
  getGroupDevices,
  getGroupTrack,
  setGroupDefaultDevice,
  setGroupPlayerState
} from 'server/controllers/groupController'
import { Group } from 'server/models'
import { apiAuthRequest } from 'server/utils'
import { Viewset } from '../utils/apis/viewsets'

const groupViewset = new Viewset(Group)

type ApiArgs = [req: Request, res: Response, next: NextFunction]

export const assignSpotifyAccountView = apiAuthRequest(async (req, res, next) => {
  /**
   @swagger
   #swagger.tags = ['Group']
   */
  const { user } = res.locals
  const spotifyEmail = String(req.body.spotifyEmail)
  const id = String(req.params.id)

  return await assignSpotifyToGroup(user, id, spotifyEmail)
})

export const getGroupCurrentTrackView = apiAuthRequest(async (req, res, next) => {
  /**
   @swagger
   #swagger.tags = ['Group']
   */
  const id = String(req.params.id)
  return await getGroupTrack(id)
})

export const getGroupDevicesView = apiAuthRequest(async (req, res) => {
  /**
   @swagger
   #swagger.tags = ['Group']
   */
  const id = String(req.params.id)
  return await getGroupDevices(id)
})
export const setGroupDefaultDeviceView = apiAuthRequest(async (req, res) => {
  /**
   @swagger
   #swagger.tags = ['Group']
   */
  const id = String(req.params.id)
  const deviceId = String(req.body.deviceId)

  return await setGroupDefaultDevice(id, deviceId)
})

export const setGroupPlayerStateView = apiAuthRequest(async (req, res, next) => {
  /**
   @swagger
   #swagger.tags = ['Group']
   */
  const id = String(req.params.id)
  const state = String(req.body.state) as 'play' | 'pause'

  return await setGroupPlayerState(id, state)
})

export const groupCreateView = (...args: ApiArgs) => {
  /**
   @swagger
   #swagger.tags = ['Group']
   */
  return groupViewset.create(...args)
}

export const groupListView = (...args: ApiArgs) => {
  /**
   @swagger
   #swagger.tags = ['Group']
   */
  return groupViewset.list(...args)
}
export const groupGetView = (...args: ApiArgs) => {
  /**
   @swagger
   #swagger.tags = ['Group']
   */
  return groupViewset.get(...args)
}
export const groupUpdateView = (...args: ApiArgs) => {
  /**
   @swagger
   #swagger.tags = ['Group']
   */
  return groupViewset.update(...args)
}
export const groupPartialUpdateView = (...args: ApiArgs) => {
  /**
   @swagger
   #swagger.tags = ['Group']
   */
  return groupViewset.partialUpdate(...args)
}
export const groupDeleteView = (...args: ApiArgs) => {
  /**
   @swagger
   #swagger.tags = ['Group']
   */
  return groupViewset.delete(...args)
}
