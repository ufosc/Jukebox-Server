/**
 * @fileoverview General routes for the project.
 */
import 'dotenv/config'
import { responses } from 'src/utils'

export const healthCheck = (_: any, res: any) => {
  /**======================*
    #swagger.tags = ['Base']
    #swagger.summary = "Base route"
    #swagger.description = "Base starting point of the project, displays important data"
    #swagger.responses[200] = {
        description: 'Example data with redactions',
        schema: {
            success: true,
            login_route: "http://localhost:8000/login/",
            logout_route: "http://localhost:8000/logout/",
            documentation: "http://localhost:8000/docs/",
        }
    }
  *========================*/
  responses.ok(res, {
    success: true,
    login_route: 'http://localhost:8000/login/',
    logout_route: 'http://localhost:8000/logout/',
    documenation: 'http://localhost:8000/docs/'
  })
}


