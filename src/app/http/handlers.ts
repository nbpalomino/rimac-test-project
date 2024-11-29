import { Request, Response } from 'express'
import { Container } from 'typedi'
import { MixedService, StoreService } from '../../service/'
import { connectDB } from '../../persistence/database'
import { connectRedis } from '../../persistence/database/redis'
import { logger } from '../utils'

interface RequestParams {}
interface ResponseBody {}
interface RequestBody {
    [key: string]: any
}
interface RequestQuery {}

export const mixed_handler = async (req: Request, res: Response) => {
    await connectDB()
    await connectRedis()

    const mixedService = Container.get(MixedService)
    const result = await mixedService.getMixedEndpoints()

    res.send({
        'code': 200,
        'body': result
    })
}

export const store_handler = async (req: Request<{},{},RequestBody>, res: Response) => {
    await connectDB()
    
    const storeService = Container.get(StoreService)

    console.log("Store : ", req.body)
    const entity = await storeService.save(req.body)

    res.send({
        'code': 200,
        'body': entity
    })
}

interface RequestQuery {
    size?: string,
    page?: string
}

export const history_handler = async (req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>, res: Response) => {
    await connectDB()

    const mixedService = Container.get(MixedService)
    const { size, page } = req.query

    res.send({
        'code': 200,
        'body': await mixedService.getAllPaginated(size, page)
    })
}