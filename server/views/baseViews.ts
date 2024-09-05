import { apiRequest } from 'server/utils'

/**
 * REST Api Views
 *
 * Views handle requests and responses from the router, and
 * will call any necessary controller. Views cannot directly access
 * services, validators, models, or other views.
 */
export const healthcheck = apiRequest(
  (req, res) => {
    /** ==========================*
    @swagger Health Check
    #swagger.summary = 'Health Check'
    #swagger.tags = ['General']
    #swagger.description = 'Root route to check if the system is online.'
   *=========================== */

    return 'All systems operational.'
  },
  { showStatus: true }
)

export const apiHelp = apiRequest((req, res) => {
  /** ==========================*
    @swagger API Help
    #swagger.summary = 'API Help and Navigation'
    #swagger.tags = ['General']
    #swagger.description = 'Main links to use for navigating api.'
   *=========================== */
  const baseUrl = req.protocol + '://' + req.get('host')

  return {
    spotifyLogin: `${baseUrl}/api/spotify/login/`,
    documenation: `${baseUrl}/api/docs/`
  }
})
