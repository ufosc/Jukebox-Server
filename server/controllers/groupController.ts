import type { Request, Response } from 'express'
import type { AuthenticatedLocals } from 'server/middleware'
import { Group, User } from 'server/models'
import { AuthService, GroupService } from 'server/services'
import { httpBadRequest, httpCreated, httpNoContent, httpNotFound, httpOk } from 'server/utils'

// TODO: Requires permission
export const createGroup = async (req: Request, res: Response) => {
  /**
  @swagger
  #swagger.tags = ['Group']
  */
  const { body } = req
  const { user } = <AuthenticatedLocals>res.locals

  try {
    // const group = await Group.create({ ...body, ownerId: user._id })
    const { name } = body // TODO: Validate body, explicitly define fields

    const group = await GroupService.createGroup(user, name, body)
    return httpCreated(res, group)
  } catch (error: any) {
    return httpBadRequest(res, error?.message)
  }
}

// TODO: Requires permission
export const createGroupMember = async (req: Request, res: Response) => {
  /**
  @swagger
  #swagger.tags = ['Group']
  */
  const { groupId } = req.params
  const { email, options } = req.body

  const group: Group | null = await Group.findById(groupId)
  if (!group) return httpNotFound(res, 'Group not found.')

  try {
    const userFound: User | null = await User.findOne({ email: email })
    let user: User

    if (!userFound) {
      user = await AuthService.inviteUser(email)
    } else {
      user = userFound
    }

    const newMembership = await GroupService.registerGroupMember(group, user, options)
    return httpCreated(res, newMembership)
  } catch (error: any) {
    return httpBadRequest(res, error?.message)
  }
}

export const getGroup = async (req: Request, res: Response) => {
  /**
  @swagger
  #swagger.tags = ['Group']
  */
  const { groupId } = req.params

  const group: Group | null = await Group.findById(groupId)
  if (!group) return httpNotFound(res, 'Group not found.')

  return httpOk(res, group)
}

export const updateGroup = async (req: Request, res: Response) => {
  /**
  @swagger
  #swagger.tags = ['Group']
  #swagger.summary = "Not implemented"
  */
  const { groupId } = req.params
  const { ownerId, name, spotifyToken } = req.body

  const group: Group | null = await Group.findById(groupId)
  if (!group) return httpNotFound(res, 'Group not found.')

  try {
    // TODO: Validate body
    // const updatedGroup = await group.updateOne({ ownerId, name, spotifyToken }, { new: true })
    const updatedGroup = await Group.findByIdAndUpdate(
      groupId,
      { ownerId, name, spotifyToken },
      { new: true }
    )

    return httpOk(res, updatedGroup)
  } catch (error: any) {
    return httpBadRequest(res, error?.message)
  }
}

export const deleteGroup = async (req: Request, res: Response) => {
  /**
  @swagger
  #swagger.tags = ['Group']
  #swagger.summary = "Not implemented"
  */
  const { groupId } = req.params

  const group: Group | null = await Group.findById(groupId)
  if (!group) return httpNotFound(res, 'Group not found.')

  try {
    await GroupService.deleteGroup(group)
    return httpNoContent(res)
  } catch (error: any) {
    return httpBadRequest(res, error?.message)
  }
}

export const getGroupMembers = async (req: Request, res: Response) => {
  /**
  @swagger
  #swagger.tags = ['Group']
  #swagger.summary = "Not implemented"
  */
  const { groupId } = req.params

  const group: Group | null = await Group.findById(groupId)
  if (!group) return httpNotFound(res, 'Group not found.')

  try {
    const members = await GroupService.getGroupMembers(group)
    return httpOk(res, members)
  } catch (error: any) {
    return httpBadRequest(res, error?.message)
  }
}

export const getGroupMemberships = async (req: Request, res: Response) => {
  /**
  @swagger
  #swagger.tags = ['Group']
  #swagger.summary = "Not implemented"
  */
  const { groupId } = req.params

  const group: Group | null = await Group.findById(groupId)
  if (!group) return httpNotFound(res, 'Group not found.')

  try {
    const memberships = await GroupService.getGroupMemberships(group)
    return httpOk(res, memberships)
  } catch (error: any) {
    return httpBadRequest(res, error?.message)
  }
}
