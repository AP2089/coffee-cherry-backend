import { UserRole, type UserSeedEntry } from '../types'

export const usersSeed: UserSeedEntry[] = [
  { username: 'admin', password: 'admin', role: UserRole.Admin },
  { username: 'manager', password: 'manager', role: UserRole.Manager },
  { username: 'guest', password: 'guest', role: UserRole.Guest },
]
