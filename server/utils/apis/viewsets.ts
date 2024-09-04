import { type NextFunction, type Request, type Response, Router } from 'express'
import type { Document, Model } from 'mongoose'
import { NotFoundError } from '../exceptions'
import { httpCreated } from '../responses'
import { apiRequest } from './wrappers'

export class Viewset<
  T extends Model<any, any, IModelMethods> = Model<any, any, IModelMethods>,
  S extends Serializable = any
> {
  private model: T
  private clean: (data: any) => S
  
  constructor(
    model: T,
    clean: (data: any) => S
  ) {
    this.model = model
    this.clean = clean
  }

  private apiWrapper = apiRequest

  private async handleCreate(req: Request, res: Response, next: NextFunction) {
    const { body } = req
    const data = this.clean(body)
    const obj = await this.model.create(data)
    
    return obj.serialize()

  }
  private async handleList(req: Request, res: Response, next: NextFunction) {
    const query = await this.model.find({})
    return query.map((obj: InstanceType<T>) => obj.serialize())
  }
  private async handleGet(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    const result = await this.model.findById(id)

    if (!result) throw new NotFoundError(`${this.model.name} with id ${id} not found.`)

    return result.serialize()
  }
  private async handleUpdate(req: Request, res: Response, next: NextFunction) {
    const { body, params } = req
    const data = this.clean(body)

    const obj = await this.model.findOneAndUpdate({ _id: params.id }, data, { new: true })
    if (!obj) throw new NotFoundError(`${this.model.name} with id ${params.id} not found.`)
      
    return obj.serialize()
  }
  private async handlePartialUpdate(req: Request, res: Response, next: NextFunction) {
    const { body, params } = req
    const data = this.clean(body)

    const obj = await this.model.findOneAndUpdate({ _id: params.id }, data, { new: true })
    if (!obj) throw new NotFoundError(`${this.model.name} with id ${params.id} not found.`)

    return obj.serialize()
  }
  private async handleDelete(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    const result: InstanceType<Model<T, any, IModelMethods<T>>> | null = await this.model.findById(id)

    if (!result) throw new NotFoundError(`${this.model.name} with id ${id} not found.`)

    await result.deleteOne()

    return result.serialize()
  }

  public create = this.apiWrapper(this.handleCreate.bind(this), { onSuccess: httpCreated })
  public list = this.apiWrapper(this.handleList.bind(this))
  public get = this.apiWrapper(this.handleGet.bind(this))
  public update = this.apiWrapper(this.handleUpdate.bind(this))
  public partialUpdate = this.apiWrapper(this.handlePartialUpdate.bind(this))
  public delete = this.apiWrapper(this.handleDelete.bind(this))

  registerRouter(path = '/'): Router {
    const router = Router()

    router.post(path, this.create)
    router.get(path, this.list)
    router.get(`${path}:id`, this.get)
    router.post(`${path}:id`, this.update)
    router.patch(`${path}:id`, this.partialUpdate)
    router.delete(`${path}:id`, this.delete)

    return router
  }
}
