import type { NextFunction, Request, Response } from 'express'
import { assignSpotifyToGroup, getGroupSpotify } from 'server/controllers/groupController'
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
  let { spotifyEmail } = req.body
  let { id } = req.params

  spotifyEmail = String(spotifyEmail)
  id = String(id)

  return await assignSpotifyToGroup(user, id, spotifyEmail)
})

export const getGroupCurrentTrackView = apiAuthRequest(async (req, res, next) => {
  /**
   @swagger
   #swagger.tags = ['Group']
   */
  let {id} = req.params
  id = String(id)
  
  const spotify = await getGroupSpotify(id)
  return await spotify.sdk.player.getCurrentlyPlayingTrack()
})

/** ========= Resource CRUD Views ========== */

export const groupCreateView = (...args: ApiArgs) => {
  /**
   @swagger
   #swagger.tags = ['Group']
   #swagger.parameters['body'] = {
      in: "body",
      name: "body",
      description: "New Group",
      required: true,
      schema: {$ref: "#/definitions/Group"}
    }
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
