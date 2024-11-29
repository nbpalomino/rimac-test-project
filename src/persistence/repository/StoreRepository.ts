import { Service } from "typedi"
import { AppDataSource } from "../database"
import { StoreEntity } from "../entity/"

@Service()
export class StoreRepository {
    constructor(
        private repository = AppDataSource.getRepository(StoreEntity)
    ) {}

    public findAll() {
        return this.repository.find({
            where: {
                isDeleted: false
            }
        })
    }

    public save(entity: StoreEntity) {
        return this.repository.save(entity)
    }
}