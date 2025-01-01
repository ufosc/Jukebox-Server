interface IJukeboxAction {
  jukebox_id: number
  action: 'like' | 'dislike'

  queue_index: number
}
export class JukeboxActionDto {}
