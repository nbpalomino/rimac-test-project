import { Service } from "typedi"
import { StoreRepository } from "../persistence/repository"
import { StoreEntity } from "../persistence/entity"

@Service()
export class StoreService {
    constructor(
       private repository: StoreRepository
    ) {}

    public save(data: any) {
        const entity = new StoreEntity()
        entity.data = data
        return this.repository.save(entity)
    }
}