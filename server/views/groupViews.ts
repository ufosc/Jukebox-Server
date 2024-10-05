import type { Devices, PlaybackState } from '@spotify/web-api-ts-sdk'
import {
  assignSpotifyToGroup,
  getGroupDevices,
  getGroupSpotifyAuth,
  getGroupTrack,
  setGroupDefaultDevice,
  setGroupPlayerState
} from 'server/controllers'
import { Group, type IGroup, type ISpotifyAuth } from 'server/models'
import { apiAuthRequest, Viewset, type ApiArgs } from 'server/utils'

const groupViewset = new Viewset(Group)

export const assignSpotifyAccountView = apiAuthRequest(async (req, res, next) => {
  /**
   @swagger
   #swagger.tags = ['Group']
   #swagger.responses[200] = {
      schema: {
        "id": "66e9f064f4b6247a0c26291e",
        "ownerId": "66e8a2e7f4b6247a0c262910",
        "name": "group",
        "spotifyAuthId": "66e9fbbcb14c1ccc11b3d8fd"
      },
      description: "Monitor updated"
    }
   */
  const { user } = res.locals
  const spotifyEmail = String(req.body.spotifyEmail)
  const id = String(req.params.id)

  const group = await assignSpotifyToGroup(user, id, spotifyEmail)
  const serialized: IGroup = group.serialize()

  return serialized
})

export const getGroupCurrentTrackView = apiAuthRequest(async (req, res, next) => {
  /**
   @swagger
   #swagger.tags = ['Group']
   #swagger.responses[200] = {
      schema: {
        "id": "66e9f064f4b6247a0c26291e",
        "ownerId": "66e8a2e7f4b6247a0c262910",
        "name": "group",
        "spotifyAuthId": "66e9fbbcb14c1ccc11b3d8fd"
      },
      description: "Success"
    }
   */
  const id = String(req.params.id)
  const track: PlaybackState = await getGroupTrack(id)

  return track
})

export const getGroupDevicesView = apiAuthRequest(async (req, res) => {
  /**
   @swagger
   #swagger.tags = ['Group']
   #swagger.responses[200] = {
      schema: {
        devices: [
          {
            "id": "ff25d0139c6039819da122cacbdb275fe83e5286",
            "is_active": false,
            "is_private_session": false,
            "is_restricted": false,
            "name": "Nabeel’s MacBook Air",
            "supports_volume": true,
            "type": "Computer",
            "volume_percent": 81
          }
        ]
      },
      description: "Success"
    }
   */
  const id = String(req.params.id)
  const devices: Devices = await getGroupDevices(id)

  return devices
})
export const setGroupDefaultDeviceView = apiAuthRequest(async (req, res) => {
  /**
   @swagger
   #swagger.tags = ['Group']
   #swagger.responses[200] = {
      schema: {
        "spotifyLogin": "http://localhost:8000/api/spotify/login/",
        "documenation": "http://localhost:8000/api/docs/"
      },
      description: "Monitor updated"
    }
   */
  const id = String(req.params.id)
  const deviceId = String(req.body.deviceId)

  const group = await setGroupDefaultDevice(id, deviceId)
  const serialized: IGroup = group.serialize()

  return serialized
})

export const setGroupPlayerStateView = apiAuthRequest(async (req, res, next) => {
  /**
   @swagger
   #swagger.tags = ['Group']
   */
  const id = String(req.params.id)
  const state = String(req.body.state) as 'play' | 'pause'

  await setGroupPlayerState(id, state)
})

export const getGroupSpotifyAuthView = apiAuthRequest(async (req, res, next) => {
  /**
   @swagger
   #swagger.tags = ['Group']
   */
  const id = String(req.params.id)
  const auth = await getGroupSpotifyAuth(id)
  const serialized: ISpotifyAuth = auth.serialize()

  return serialized
})

export const groupCreateView = async (...args: ApiArgs) => {
  /**
   @swagger
   #swagger.tags = ['Group']
   #swagger.parameters['body'] = {
      in: "body",
      name: "body",
      description: "Group Object",
      required: true,
      schema: {$ref: "#/definitions/IGroupFields"}
    }
   #swagger.responses[200] = {
    schema: { $ref: "#/definitions/IGroup" }
   }
   */
  const group: IGroup = await groupViewset.create(...args)

  return group
}

export const groupListView = async (...args: ApiArgs) => {
  /**
   @swagger
   #swagger.tags = ['Group']
   */
  const groups: IGroup[] = await groupViewset.list(...args)

  return groups
}
export const groupGetView = async (...args: ApiArgs) => {
  /**
   @swagger
   #swagger.tags = ['Group']
   */
  const group: IGroup = await groupViewset.get(...args)

  return group
}
export const groupUpdateView = async (...args: ApiArgs) => {
  /**
   @swagger
   #swagger.tags = ['Group']
   */
  const group: IGroup = await groupViewset.update(...args)

  return group
}
export const groupPartialUpdateView = async (...args: ApiArgs) => {
  /**
   @swagger
   #swagger.tags = ['Group']
   */
  const group: IGroup = await groupViewset.partialUpdate(...args)

  return group
}
export const groupDeleteView = async (...args: ApiArgs) => {
  /**
   @swagger
   #swagger.tags = ['Group']
   */
  const group: IGroup = await groupViewset.delete(...args)

  return group
}
