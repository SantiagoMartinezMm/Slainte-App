export type UserRole = 'admin' | 'staff' | 'customer'

export interface Profile {
  id: string
  name: string
  email: string
  role: UserRole
  created_at: string
  updated_at: string
}
