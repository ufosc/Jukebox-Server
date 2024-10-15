import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, HydratedDocument, Schema as MSchema } from 'mongoose'
import { SpotifyLink } from 'src/spotify/schemas/spotify-link.schema'

@Schema()
export class Jukebox extends Document {
  id: string
  
  @Prop()
  name: string

  @Prop()
  clubId: string

  @Prop({ type: Array<MSchema.Types.ObjectId>, ref: SpotifyLink.name })
  spotifyLinks: SpotifyLink[]

  @Prop({ type: MSchema.Types.ObjectId, ref: SpotifyLink.name })
  activeSpotifyLink?: SpotifyLink
}

export type JukeboxDocument = HydratedDocument<Jukebox>
export const JukeboxSchema = SchemaFactory.createForClass(Jukebox)

JukeboxSchema.loadClass(Jukebox)
