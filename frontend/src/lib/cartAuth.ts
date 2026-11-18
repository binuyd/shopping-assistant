export interface CartUser {
  id: string
  email?: string
  name?: string
}

// A cart requires an authenticated user with an account ID.
export function isCartAllowed(user: CartUser | null | undefined): boolean {
  return Boolean(user && user.id)
}
