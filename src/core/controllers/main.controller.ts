/**
 * @fileoverview General routes for the project.
 */
import "dotenv/config";
import config from "config";


const baseResponse = {
  success: true,
  login_route: "http://localhost:8000/login/",
  logout_route: "http://localhost:8000/logout/",
  documenation: "http://localhost:8000/docs/",
};

const healthCheck = {
  status: 200,
  message: "Jukebox API is online."
}

/** @api {get} / Base route */
export const getIndex = (req: any, res: any, next: any) => {
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
  let resData = process.env.NODE_ENV === 'production' ? healthCheck : baseResponse;
  res.json(resData);
};
