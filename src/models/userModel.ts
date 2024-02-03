/**
 * @fileoverview User model
 */
import mongoose from 'mongoose'

export const UserSchema = new mongoose.Schema({
  // username: {
  //   type: String,
  //   required: true,
  //   unique: true,
  //   index: true,
  //   dropDups: true
  // },
  email: {
    // TODO: Validate
    type: String,
    unique: true,
    required: true,
    index: true,
    dropDups: true
  },
  password: {
    // TODO: Validate
    type: String,
    required: true
  },
  spotifyAccessToken: {
    type: String,
    required: false
  },
  spotifyRefreshToken: {
    type: String,
    required: false
  },
  spotifyTokenExpiration: {
    type: Date,
    required: false
  }
})

export const User = mongoose.model('User', UserSchema)

export type User = InstanceType<typeof User>
