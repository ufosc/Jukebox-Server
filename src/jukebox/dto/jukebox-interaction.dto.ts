export class CreateJukeboxInteractionDto implements IJukeboxInteractionCreate {
  action: 'like' | 'dislike'

  location: 'player' | 'queue'
  queue_index?: number
}

export class JukeboxInteractionDto extends CreateJukeboxInteractionDto implements IJukeboxInteraction {
  jukebox_id: number
  user: IUser
}
