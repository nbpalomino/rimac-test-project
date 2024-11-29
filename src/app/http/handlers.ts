import {Request, Response} from 'express'
import { Container } from 'typedi'
import { MixedService, StoreService } from '../../service/'

interface RequestParams {}
interface ResponseBody {}
interface RequestBody {
    [key: string]: any
}
interface RequestQuery {}

const mixedService = Container.get(MixedService)
const storeService   = Container.get(StoreService)

export const mixed_handler = async (req: Request, res: Response) => {

    const result = await mixedService.getMixedEndpoints()

    res.send({
        'code': 200,
        'body': result
    })
}

export const store_handler = async (req: Request<{},{},RequestBody>, res: Response) => {
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
    
    const { size, page } = req.query

    res.send({
        'code': 200,
        'body': await mixedService.getAllPaginated(size, page)
    })
}