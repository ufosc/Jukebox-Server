/**
 * @fileoverview General routes for the project.
 */
import 'dotenv/config'
import { httpOk } from '../utils'

export const healthCheck = async (_: any, res: any) => {
  /**======================*
    #swagger.tags = ['Base']
    #swagger.summary = "Base route"
    #swagger.description = "Base starting point of the project, displays important data"
    #swagger.responses[200] = {
        description: 'Example data with redactions',
        schema: {
          spotifyLogin: 'http://localhost:8000/api/spotify/login/',
          documentation: "http://localhost:8000/api/docs/",
        }
    }
  *========================*/
  return httpOk(res, {
    spotifyLogin: 'http://localhost:8000/api/spotify/login/',
    documenation: 'http://localhost:8000/api/docs/'
  })
}
