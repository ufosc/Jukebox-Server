/**
 * @fileoverview User model
 */
import mongoose, { Schema, type Model } from 'mongoose'

export interface IUserFields {
  email: string
  firstName?: string
  lastName?: string
  image?: string
}

export interface IUser extends IUserFields {
  id: string
}

export interface UserFields extends Omit<IUser, 'id'> {
  // export interface IUserFields extends IModelFields<IUser> {
  password: string
}
export interface UserMethods extends IModelMethods<IUser> {}

export type UserModel = Model<IUser, any, UserMethods>

export const UserSchema = new Schema<UserFields, UserModel, UserMethods>({
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

export const cleanUser = (data: any): Partial<IUser> => {
  let payload: Partial<IUser> = {}

  // TODO: Create cleanModel utility
  if ('id' in data) {
    payload = { ...payload, id: data.id }
  }
  if ('email' in data) {
    payload = { ...payload, email: data.email }
  }
  if ('firstName' in data) {
    payload = { ...payload, firstName: data.firstName }
  }
  if ('lastName' in data) {
    payload = { ...payload, lastName: data.lastName }
  }
  if ('image' in data) {
    payload = { ...payload, image: data.image }
  }

  return payload
}

export const User = mongoose.model('User', UserSchema)

export type User = InstanceType<typeof User>
