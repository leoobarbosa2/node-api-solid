export class InvaidCredentialsError extends Error {
  constructor() {
    super('Invalid credentials')
  }
}