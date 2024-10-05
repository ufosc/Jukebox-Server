import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

@Schema()
export class SpotifyLink {
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
}

export const SpotifyLinkSchema = SchemaFactory.createForClass(SpotifyLink)
export type SpotifyLinkDocument = HydratedDocument<SpotifyLink>
