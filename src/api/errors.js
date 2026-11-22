// Thrown by getVerdict when no valid verdict comes back. The UI shows a Try again button.
export class VerdictError extends Error {
  constructor(message = "The judge couldn't reach a verdict. Try again.") {
    super(message)
    this.name = 'VerdictError'
  }
}
