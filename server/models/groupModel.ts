import mongoose, { Types, type Model } from 'mongoose'

export interface IGroupFields {
  name: string
  ownerId: string
  spotifyAuthId?: string
  defaultDeviceId?: string
}

export interface IGroup extends IGroupFields {
  id: string
}

export interface GroupFields extends Omit<IGroupFields, 'ownerId' | 'id' | 'spotifyAuthId'> {
  ownerId: typeof Types.ObjectId
  spotifyAuthId?: typeof Types.ObjectId
}
export interface GroupMethods extends IModelMethods<IGroup> {}
type GroupModel = Model<IGroup, any, GroupMethods>

const GroupSchema = new mongoose.Schema<GroupFields, GroupModel, GroupMethods>(
  {
    ownerId: {
      type: Types.ObjectId,
      required: true
    },
    name: {
      type: String,
      required: true,
      unique: true
    },
    spotifyAuthId: {
      type: Types.ObjectId,
      ref: 'SpotifyAuth',
      unique: true,
      dropDups: true,
      sparse: true
    },
    defaultDeviceId: {
      type: String
    }
  },
  {
    timestamps: true
  }
)

GroupSchema.methods.serialize = function () {
  return {
    id: this.id,
    ownerId: this.ownerId.toString(),
    name: this.name,
    spotifyAuthId: this.spotifyAuthId?.toString()
  }
}

const membershipSchema = new mongoose.Schema(
  {
    groupId: {
      type: Types.ObjectId,
      required: true,
      ref: 'Group'
    },
    userId: {
      type: Types.ObjectId,
      required: true,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['admin', 'owner', 'member'],
      default: 'member'
    },
    points: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
)

export const Group = mongoose.model('Group', GroupSchema)
export type Group = InstanceType<typeof Group>
export const Membership = mongoose.model('Membership', membershipSchema)
export type Membership = InstanceType<typeof Membership>
