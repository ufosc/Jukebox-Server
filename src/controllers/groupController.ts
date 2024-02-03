import type { Request, Response } from 'express'
import type { AuthenticatedLocals } from 'src/middleware'
import { Group, User } from 'src/models'
import { AuthService, GroupService } from 'src/services'
import { responses } from 'src/utils'

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
    const group = await GroupService.createGroup(body, user)
    return responses.created(res, group)
  } catch (error: any) {
    return responses.badRequest(res, error?.message)
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
  if (!group) return responses.notFound(res, 'Group not found.')

  try {
    const userFound: User | null = await User.findOne({ email: email })
    let user: User

    if (!userFound) {
      user = await AuthService.inviteUser(email)
    } else {
      user = userFound
    }

    const newMembership = await GroupService.createGroupMember(group, user, options)
    return responses.created(res, newMembership)
  } catch (error: any) {
    return responses.badRequest(res, error?.message)
  }
}
export const createSessionGuest = async (_: Request, res: Response) => {
  return responses.notImplemented(res)
}

export const getGroup = async (_: Request, res: Response) => {
  return responses.notImplemented(res)
}

export const updateGroup = async (_: Request, res: Response) => {
  return responses.notImplemented(res)
}

export const deleteGroup = async (_: Request, res: Response) => {
  return responses.notImplemented(res)
}

export const getGroupMembers = async (_: Request, res: Response) => {
  return responses.notImplemented(res)
}
