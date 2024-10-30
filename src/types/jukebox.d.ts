declare interface IJukebox {
  id: number
  name: string
  club_id: number
  links: IJukeboxLink[]
}

declare type JukeboxLinkType = 'spotify'

declare interface IJukeboxLink {
  id: number
  type: JukeboxLinkType
  email: string
  active: boolean
}
