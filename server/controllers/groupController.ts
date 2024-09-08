import { Group, SpotifyAuth, type User } from 'server/models'
import { SpotifyService } from 'server/services'
import { NotFoundError } from 'server/utils'

export const assignSpotifyToGroup = async (user: User, groupId: string, spotifyEmail: string) => {
  const auth = await SpotifyAuth.findOne({ userId: user._id.toString(), spotifyEmail })

  if (!auth)
    throw new Error(`User ${user.email} is not connected to spotify account ${spotifyEmail}.`)

  const group = await Group.findById(groupId)
  if (!group) throw new NotFoundError(`Group with id ${groupId} not found.`)

  await group.updateOne({ spotifyAuthId: auth._id }, { new: true })
  return group
}

export const getGroupSpotify = async (groupId: string) => {
  const group = await Group.findById(groupId)
  if (!group) throw new NotFoundError(`Group with id ${groupId} not found.`)

  const auth = await SpotifyAuth.findById(group.spotifyAuthId)
  if (!auth) throw new Error(`No linked Spotify accounts for group ${group.name}.`)

  return SpotifyService.connect(auth.spotifyEmail)
}
