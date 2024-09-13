import type { Model } from 'mongoose'
import { Group, SpotifyAuth, type User } from 'server/models'
import { SpotifyService } from 'server/services'
import { NotFoundError } from 'server/utils'

const getOrError = async <T extends Model<any>>(id: string, model: T): Promise<InstanceType<T>> => {
  const query = await model.findById(id)
  if (!query) {
    throw new NotFoundError(`${model.name} with id ${id} not found.`)
  }

  return query
}

export const assignSpotifyToGroup = async (
  user: User,
  groupId: string,
  spotifyEmail: string
): Promise<Group> => {
  const auth = await SpotifyAuth.findOne({ userId: user._id.toString(), spotifyEmail })

  if (!auth)
    throw new Error(`User ${user.email} is not connected to spotify account ${spotifyEmail}.`)

  const group = await getOrError(groupId, Group)

  await group.updateOne({ spotifyAuthId: auth._id }, { new: true })
  return group
}

export const getGroupSpotifyAuth = async (groupId) => {
  const group = await getOrError(groupId, Group)
  const auth = await getOrError(group.spotifyAuthId?.toString() ?? '', SpotifyAuth)

  return auth
}

export const getGroupSpotify = async (groupId: string) => {
  const auth = await getGroupSpotifyAuth(groupId)
  // const group = await getOrError(groupId, Group)

  // const auth = await SpotifyAuth.findById(group.spotifyAuthId)
  // if (!auth) throw new Error(`No linked Spotify accounts for group ${group.name}.`)

  return SpotifyService.connect(auth.spotifyEmail)
}

export const getGroupTrack = async (groupId: string) => {
  const spotify = await getGroupSpotify(groupId)
  return await spotify.sdk.player.getCurrentlyPlayingTrack()
}

export const getGroupDevices = async (groupId: string) => {
  const spotify = await getGroupSpotify(groupId)
  return await spotify.sdk.player.getAvailableDevices()
}

export const setGroupDefaultDevice = async (groupId: string, deviceId: string) => {
  const group = await getOrError(groupId, Group)
  group.defaultDeviceId = deviceId
  await group.save()

  return group
}

export const setGroupPlayerState = async (
  groupId: string,
  state: 'play' | 'pause' | 'next' | 'previous'
) => {
  const spotify = await getGroupSpotify(groupId)
  const group = await getOrError(groupId, Group)

  switch (state) {
    case 'play':
      await spotify.sdk.player.startResumePlayback(group.defaultDeviceId ?? '')
      break
    case 'pause':
      await spotify.sdk.player.pausePlayback(group.defaultDeviceId ?? '')
      break
    case 'next':
      await spotify.sdk.player.skipToNext(group.defaultDeviceId ?? '')
      break
    case 'previous':
      await spotify.sdk.player.skipToPrevious(group.defaultDeviceId ?? '')
      break
    default:
      throw new Error(`Cannot set player state to ${state}.`)
  }
}
