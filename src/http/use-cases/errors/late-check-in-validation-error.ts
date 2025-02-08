export class LateCheckInValidationError extends Error {
  constructor() {
    super('Check-ins can only be validated until 20 minutes of its creation')
  }
}