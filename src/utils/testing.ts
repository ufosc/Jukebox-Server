import type { Response } from 'express'

export const getMockResJson = (res: Response) => {
  return (res as any)._getJSONData()
}
