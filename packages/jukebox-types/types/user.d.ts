/**
 * Person registered in the Club Service.
 */
declare interface IUser extends IModel {
  // id: number
  email: string
  first_name?: string
  last_name?: string
  username: string
  image?: string
}

/**
 * Additional details about a user.
 *
 * @see {@link IUser}
 */
declare interface IUserDetails extends IUser {
  clubs: { id: number; name: string; role: string }[]
}
