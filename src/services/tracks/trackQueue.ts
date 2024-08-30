export interface TrackQueue {
  tracks: Track[]
  push: () => void
  pop: () => void
  remove: () => void
}
