import { SetMetadata } from '@nestjs/common'

export type Role = 'member' | 'admin'
export const ROLES_KEY = 'roles'

export const Roles = (role: Role) => SetMetadata(ROLES_KEY, role)
