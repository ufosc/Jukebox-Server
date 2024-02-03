import mongoose, { Types } from 'mongoose'

const membershipSchema = new mongoose.Schema(
  {
    userId: {
      type: Types.ObjectId,
      required: true,
      ref: 'User'
    },
    role: {
      types: String,
      enum: ['member', 'admin'],
      default: 'member'
    },
    points: {
      types: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
)

const groupSchema = new mongoose.Schema(
  {
    owner: {
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
    members: [membershipSchema]
  },
  {
    timestamps: true
  }
)

export const Group = new mongoose.Model('Group', groupSchema)
export type Group = InstanceType<typeof Group>
