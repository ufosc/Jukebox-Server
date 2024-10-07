import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, HydratedDocument } from 'mongoose'

@Schema()
export class SpotifyLink extends Document {
  @Prop()
  accessToken: string

  @Prop()
  refreshToken: string

  @Prop()
  userId: string

  @Prop({ required: true, unique: true })
  spotifyEmail: string

  @Prop()
  expiresIn: number

  @Prop()
  expiresAt: Date

  @Prop()
  tokenType: string

  isExpired() {
    return this.expiresAt.getTime() <= Date.now()
  }

  syncExpiresAt() {
    this.expiresAt = new Date(Date.now() + this.expiresIn * 1000)
  }
}

export type SpotifyLinkDocument = HydratedDocument<SpotifyLink>
export const SpotifyLinkSchema = SchemaFactory.createForClass(SpotifyLink)

SpotifyLinkSchema.loadClass(SpotifyLink)
