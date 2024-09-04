/**
 * @fileoverview User model
 */
import mongoose, { Schema, type Model } from 'mongoose'

export interface IUser {
  id: string
  email: string
  firstName?: string
  lastName?: string
  image?: string
}
export interface IUserFields extends Omit<IUser, 'id'> {
  password: string
}
export interface IUserMethods extends IModelMethods<IUser> {}

export type IUserModel = Model<IUser, any, IUserMethods>

export const UserSchema = new Schema<IUserFields, IUserModel, IUserMethods>({
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
  firstName: {
    type: String,
    required: false
  },
  lastName: {
    type: String,
    required: false
  },
  image: {
    type: String,
    required: false
  }
  // spotifyAccessToken: {
  //   type: String,
  //   required: false
  // },
  // spotifyRefreshToken: {
  //   type: String,
  //   required: false
  // },
  // spotifyTokenExpiration: {
  //   type: Date,
  //   required: false
  // }
})

UserSchema.methods.serialize = function () {
  return {
    id: this._id.toString(),
    email: this.email,
    firstName: this.firstName,
    lastName: this.lastName,
    image: this.image
  }
}

export const User = mongoose.model('User', UserSchema)

export type User = InstanceType<typeof User>
