export type UserRole = 'admin' | 'member'

export interface IUser {
  name: string
  role: UserRole
}
