import type { Request } from 'express'
import { PORT } from 'server/config'

export const getQuery = (req: Request): any => {
  const protocol = req.protocol
  const host = req.hostname
  const url = req.originalUrl
  const port = `:${PORT}`

  const fullUrl = `${protocol}://${host}${port}${url}`
  const query = new URL(fullUrl).searchParams
  let params = {}

  for (const [key, value] of query.entries()) {
    params = { ...params, [key]: value }
  }

  return params
}
