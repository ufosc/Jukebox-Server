import { Router, type Request, type Response } from 'express'

const router = Router()

const healthCheck = (req: Request, res: Response) => {
  return res.status(200).send()
}

router.get('/', healthCheck)
router.get('/health', healthCheck)

export { router }
