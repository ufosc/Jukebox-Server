/**
 * @fileoverview Group Service
 *
 * @description The group service is not responsible for all CRUD operations
 * on the group model. Instead, it is responsible for the operations that effect
 * other models and services, including memberships and users.
 */
import { Group, Membership, User } from 'src/models'

export class GroupService {
  static async createGroup(owner: User, name: string, options?: any): Promise<Group> {
    try {
      const group = await Group.create({ ...options, ownerId: owner._id, name })

      await Membership.create({
        groupId: group._id,
        userId: owner._id,
        role: 'owner'
      })

      return group
    } catch (error: any) {
      throw new Error(error?.message)
    }
  }
  static async registerGroupMember(
    group: Group,
    user: User,
    options?: { role: string }
  ): Promise<Membership> {
    try {
      const membership = await Membership.create({
        groupId: group._id,
        userId: user._id
      })
      if (options?.role) {
        membership.role = options.role as Membership['role']
        await membership.save()
      }

      return membership
    } catch (error: any) {
      throw new Error(error?.message)
    }
  }
  // TODO: Remove group member

  static async deleteGroup(group: Group) {
    await Membership.deleteMany({ groupId: group._id })
    await group.deleteOne()

    return group
  }
  static async getGroupMembers(group: Group) {
    const memberships = await Membership.find({ groupId: group._id })
    const members: User[] = await Promise.all(
      memberships.map(async (m) => await User.findById(m.userId))
    ).then((result) => result.filter((user) => user !== null) as User[])

    return members
  }

  static async getGroupMemberships(group: Group) {
    return await Membership.find({ groupId: group._id })
  }
}
