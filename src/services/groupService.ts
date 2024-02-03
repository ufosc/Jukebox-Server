/**
 * @fileoverview Group Service
 *
 * @description The group service is not responsible for all CRUD operations
 * on the group model. Instead, it is responsible for the operations that effect
 * other models and services, including memberships and users.
 */
import { Group, Membership, type User } from 'src/models'

export class GroupService {
  static async createGroup(owner: User, name: string, options?: any): Promise<Group> {
    try {
      const group = await Group.create({ ...options, ownerId: owner._id, name })
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
      let membership = await Membership.create({
        groupId: group._id,
        userId: user._id
      })
      if (options?.role) {
        membership = await membership.updateOne({ role: options.role })
      }

      return membership
    } catch (error: any) {
      throw new Error(error?.message)
    }
  }
  // TODO: Remove group member

  static async deleteGroup(group: Group) {
    throw new Error('Not implemented')
  }
  static async getGroupMembers(group: Group) {
    throw new Error('Not implemented')
  }
}
