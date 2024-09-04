export class NotImplementedError extends Error {
  constructor(methodName: string) {
    super(`Method ${methodName} is not implemented.`)
    this.name = 'NotImplementedError'
  }
}
