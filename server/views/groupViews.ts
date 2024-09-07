import { Group } from 'server/models'
import { apiRequest } from 'server/utils'
import { Viewset } from '../utils/apis/viewsets'

const groupViewset = new Viewset(Group)

export const groupCreateView = apiRequest((req, res, next) => {
  /**
   @swagger
   #swagger.tags = ['Group']
   */
  return groupViewset.create(req, res, next)
})
export const groupListView = groupViewset.list
export const groupGetView = groupViewset.get
export const groupUpdateView = groupViewset.update
export const groupPartialUpdateView = groupViewset.partialUpdate
export const groupDeleteView = groupViewset.delete
