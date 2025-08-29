export class CreateQueuedTrackDto {
  queued_by: { id: number }

  track: { id: number }
}

export class QueueUpTrackDto {
  queued_by: { id: number }

  spotify_track_id: string
}

