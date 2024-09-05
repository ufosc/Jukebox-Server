import type { NextFunction, Request, Response } from 'express'

export const docsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  /**
    @swagger
    #swagger.responses[400] = {
      schema: {$ref: "#/definitions/Error400"},
      description: "Bad request"
    }
    #swagger.responses[404] = {
      schema: {$ref: "#/definitions/Error404"},
      description: "Not found"
    }
    #swagger.responses[500] = {
      schema: {$ref: "#/definitions/Error500"},
      description: "Internal Server Error"
    }
    #swagger.responses[501] = {
      schema: {$ref: "#/definitions/Error501"},
      description: "Not implemented"
    }
   */
  next()
}
