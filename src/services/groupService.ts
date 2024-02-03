import { Group, Membership, type User } from 'src/models'

export class GroupService {
  static async createGroup(body: any, user: User) {
    try {
      const group = await Group.create({ ...body, ownerId: user._id })
      return group
    } catch (error: any) {
      throw new Error(error?.message)
    }
  }
  static async createGroupMember(
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
  static async createSessionGuest() {
    throw new Error('Not implemented')
  }
  static async getGroup() {
    throw new Error('Not implemented')
  }
  static async updateGroup() {
    throw new Error('Not implemented')
  }
  static async deleteGroup() {
    throw new Error('Not implemented')
  }
  static async getGroupMembers() {
    throw new Error('Not implemented')
  }
}
