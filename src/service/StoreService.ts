import { Service, Container } from "typedi"
import { StoreRepository } from "../persistence/repository"
import { StoreEntity } from "../persistence/entity"

@Service()
export class StoreService {
    constructor(
       private repository: StoreRepository
    ) {
        this.repository = Container.get(StoreRepository)
    }

    public save(data: any) {
        const entity = new StoreEntity()
        entity.data = data
        return this.repository.save(entity)
    }
}