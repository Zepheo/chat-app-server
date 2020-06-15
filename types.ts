export type User = {
  id: string
  name: string
}

export interface AddUserReturn {
  user?: User,
  error?: 'Username already in use'
}
