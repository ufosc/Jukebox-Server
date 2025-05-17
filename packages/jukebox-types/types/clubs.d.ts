/**
 * Determines the type of association a user has with a club.
 */
declare type ClubRole = 'president' | 'officer' | 'member'

/**
 * User connection to a club.
 */
declare interface IClubMember extends IModel {
  user_id: number
  username: string
  owner: boolean
  role: ClubRole
  points: number
}

/**
 * Main club object, groups users together.
 */
declare interface IClub extends IModel {
  name: string
  logo?: string | null
}

declare interface IClubDetails extends IClub {
  members: IClubMember[]
}
