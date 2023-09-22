/*====== Primary API Routes =======*/

let client_id = process.env.SP_ID; // Your client id
let client_secret = process.env.SP_SECRET; // Your secret
let redirect_uri = process.env.SP_URI; // Your redirect uri
require("dotenv").config();

let baseResponse = {
    success: true,
    login_route: "http://localhost:8000/login",
    logout_route: "http://localhost:8000/logout",
    documenation: "http://localhost:8000/doc",
};

/** Base route for api **/
exports.getIndex = (req: any, res: any, next: any) => {
    /*
    #swagger.tags = ['Base']
    #swagger.description = "Base starting point of the project, displays important data"
    #swagger.responses[200] = {
        description: 'Example data with redactions',
        schema: {
            success: true,
            login_route: "http://localhost:8000/login",
            logout_route: "http://localhost:8000/logout",
            documentation: "http://localhost:8000/doc",
        }
    }
     */
    res.json(baseResponse);
};
