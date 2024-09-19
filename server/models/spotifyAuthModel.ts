import { Schema, Types, model, type Model } from 'mongoose'

export interface ISpotifyAuth {
  id: string
  accessToken: string
  refreshToken: string
  userId: string
  spotifyEmail: string
  expiresIn: number
  tokenType: string
  expiresAt: Date
}

export interface ISpotifyAuthFields extends Omit<ISpotifyAuth, 'id' | 'userId'> {
  userId: typeof Types.ObjectId
}

export interface ISpotifyAuthMethods extends IModelMethods<ISpotifyAuth> {}

export type ISpotifyAuthModel = Model<ISpotifyAuth, any, ISpotifyAuthMethods>

export const SpotifyAuthSchema = new Schema<
  ISpotifyAuthFields,
  ISpotifyAuthModel,
  ISpotifyAuthMethods
>({
  accessToken: {
    type: String
  },
  refreshToken: {
    type: String
  },
  userId: {
    type: Types.ObjectId,
    required: true,
    ref: 'User'
  },
  spotifyEmail: {
    type: String,
    required: true,
    unique: true
  },
  expiresIn: {
    type: Number
  },
  expiresAt: {
    type: Date
  },
  tokenType: {
    type: String
  }
})

SpotifyAuthSchema.methods.serialize = function () {
  return {
    id: this.id,
    accessToken: this.accessToken,
    refreshToken: this.refreshToken,
    userId: this.userId,
    spotifyEmail: this.spotifyEmail,
    expiresIn: this.expiresIn,
    tokenType: this.tokenType,
    expiresAt: this.expiresAt
  }
}

export const SpotifyAuth = model('SpotifyAuth', SpotifyAuthSchema)
export type SpotifyAuth = InstanceType<typeof SpotifyAuth>
