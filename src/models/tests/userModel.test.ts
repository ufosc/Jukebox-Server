/**
 * @fileoverview User model tests.
 */

import { User } from '../userModel'

describe('User Model', () => {
  test('model can be created', async () => {
    const userFields = { email: 'john doe', password: 'unhashed-password' }
    const user = await User.create(userFields)

    expect(user).not.toBeNull()
    expect(user.email).toEqual(userFields.email)
    expect(user.password).toEqual(userFields.password) // Hashing is done by another service, model doesn't know/care
  })
})
