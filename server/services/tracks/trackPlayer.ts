export interface CurrentTrack {
  track: Track
  duration: number
  position: number
  isPlaying: boolean
  pause: () => void
  play: () => void
  toggle: () => void
}
