export interface CartUser {
  id: string
  email?: string
  name?: string
}

export function isCartAllowed(user: CartUser | null | undefined): boolean {
  return Boolean(user && user.id)
}
