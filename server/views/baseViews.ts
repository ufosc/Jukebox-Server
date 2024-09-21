import { producePing } from 'server/events/producers'
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
    /**
      @swagger Health Check
      #swagger.summary = 'Health Check'
      #swagger.tags = ['General']
      #swagger.description = 'Root route to check if the system is online.'
     */
    return 'All systems operational.'
  },
  { showStatus: true }
)

export const apiHelp = apiRequest((req, res) => {
  /**
    @swagger API Help
    #swagger.summary = 'API Help and Navigation'
    #swagger.tags = ['General']
    #swagger.description = 'Main links to use for navigating api.'
    #swagger.responses[200] = {
      schema: {
        "spotifyLogin": "http://localhost:8000/api/spotify/login/",
        "documenation": "http://localhost:8000/api/docs/"
      },
      description: "Monitor updated"
    }
   */
  const baseUrl = req.protocol + '://' + req.get('host')

  return {
    spotifyLogin: `${baseUrl}/api/spotify/login/`,
    documenation: `${baseUrl}/api/docs/`
  }
})

export const pingPongView = apiRequest((req, res) => {
  /**
   @swagger
   #swagger.tags = ['General']
   #swagger.summary = 'Test out flow of events from client to server.'
   #swagger.description = 'Triggers a Kafka event that every server as a consumer for, 
   forcing them all to respond for sanity checks.'
   */
  const data = 'Ping from api.'
  producePing(new Date().toLocaleTimeString(), data)
})
