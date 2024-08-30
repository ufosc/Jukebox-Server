import { type NextFunction, type Request, type Response, Router } from 'express'
import type { Document, Model } from 'mongoose'
import { NotFoundError } from '../exceptions'
import { httpCreated } from '../responses'
import { apiRequest } from './wrappers'

export class ResourceViewset<T extends Model<any>, S extends Record<string, any>> {
  constructor(
    public model: T,
    public serializer: (
      obj: Document | Document[] | any
    ) => Record<string, any> | Promise<Record<string, any>>,
    public validator: (data: any) => data is S
  ) {}

  private apiWrapper = apiRequest

  private async handleCreate(req: Request, res: Response, next: NextFunction) {
    const { body } = req
    this.validator(body)
    const obj = await this.model.create(body)

    return this.serializer(obj)
  }
  private async handleList(req: Request, res: Response, next: NextFunction) {
    return this.serializer(await this.model.find({}))
  }
  private async handleGet(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    const result = await this.model.findById(id)

    if (!result) throw new NotFoundError(`${this.model.name} with id ${id} not found.`)

    return this.serializer(result)
  }
  private async handleUpdate(req: Request, res: Response, next: NextFunction) {
    const { body, params } = req
    this.validator(body)

    const obj = await this.model.findOneAndUpdate({ _id: params.id }, body, { new: true })
    if (!obj) throw new NotFoundError(`${this.model.name} with id ${params.id} not found.`)

    return this.serializer(obj)
  }
  private async handlePartialUpdate(req: Request, res: Response, next: NextFunction) {
    const { body, params } = req
    this.validator(body)

    const obj = await this.model.findOneAndUpdate({ _id: params.id }, body, { new: true })
    if (!obj) throw new NotFoundError(`${this.model.name} with id ${params.id} not found.`)

    return this.serializer(obj)
  }
  private async handleDelete(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    const result: Document<T> | null = await this.model.findById(id)

    if (!result) throw new NotFoundError(`${this.model.name} with id ${id} not found.`)

    await result.deleteOne()

    return this.serializer(result)
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
