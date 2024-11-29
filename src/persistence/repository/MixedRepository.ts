import { Repository } from "typeorm";
import { Service } from "typedi";
import { AppDataSource } from "../database";

import { PlayerEntity } from "../entity";
import { Pagination } from "../../app/utils";
import { StarWarsPlayingDota2 } from "../../service";

@Service()
export class MixedRepository {
    private repository: Repository<PlayerEntity>
    
    constructor() {
        this.repository = AppDataSource.getRepository(PlayerEntity)
    }
    
    public findAll() {
        return this.repository.find({
            where: {
                isDeleted: false
            }
        })
    }   
    
    public findByPagination(pagination: Pagination) {
        const qb = this.repository.createQueryBuilder("player");
            qb.where("player.is_deleted = :status", {status: false})
            qb.orderBy("player.created_at", "DESC")
            if(pagination.page > 1) qb.skip(pagination.size)
            qb.take(pagination.size)
        return qb.getMany();
    }

    public savePlayer(dto: StarWarsPlayingDota2) {
        const entity = new PlayerEntity()
        entity.player = dto.player
        entity.dota2_hero = dto.dota2_hero
        entity.dota2_team = dto.dota2_team
        return this.repository.save(entity)
    }

    public saveMatch(match: StarWarsPlayingDota2[]) {
        const process = match.map(dto => this.savePlayer(dto))

        return Promise.all(process)
    }
}