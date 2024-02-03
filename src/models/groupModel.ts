import mongoose, { Types } from 'mongoose'

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
      enum: ['member', 'admin'],
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

const groupSchema = new mongoose.Schema(
  {
    ownerId: {
      type: Types.ObjectId,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    spotifyToken: {
      type: {
        accessToken: String,
        refreshTOken: String,
        expirationDate: Date
      },
      required: false
    },
    // members: [membershipSchema]
    memberCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
)

export const Group = mongoose.model('Group', groupSchema)
export type Group = InstanceType<typeof Group>
export const Membership = mongoose.model('Membership', membershipSchema)
export type Membership = InstanceType<typeof Membership>
