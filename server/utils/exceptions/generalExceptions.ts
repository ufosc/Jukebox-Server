export class NotImplementedError extends Error {
  constructor(methodName: string) {
    super(`Method ${methodName} is not implemented.`)
    this.name = 'NotImplementedError'
  }
}

export class NotFoundError extends Error {
  constructor(resource?: string, query?: Record<any, any>) {
    const message = query
      ? `Resource ${resource} with query ${query} not found.`
      : `Resource ${resource} not found.`
    super(message)
    this.name = 'NotFoundError'
  }
}
