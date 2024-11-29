import { logger, Pagination } from "../app/utils"
import { Service, Container } from "typedi"
import { MixedRepository } from "../persistence/repository"
import { SwapiService, Dota2Service, Dota2Hero, SwapiPeople } from "./api"

@Service()
export class MixedService {
    constructor(
       private repository: MixedRepository,
       private swapiService: SwapiService,
       private dota2Service: Dota2Service,
    ) {
        this.repository = Container.get(MixedRepository)
        this.swapiService = Container.get(SwapiService)
        this.dota2Service = Container.get(Dota2Service)
    }

    public async getMixedEndpoints() {
        try {
            const [jedis, siths, dota2_heroes] = await Promise.all([
                this.swapiService.getJedis(),
                this.swapiService.getSiths(),
                this.dota2Service.getHeroesByTeams()
            ])

            logger.debug("Results from swapiService JEDIS: %a", jedis)
            logger.debug("Results from swapiService SITHS: %a", siths)
            logger.debug("Results from Dota2Service: %a", dota2_heroes)

            const radiant_players = jedis.map((player, idx) => {
                return new StarWarsPlayingDota2(player, dota2_heroes.radiant[idx], 'RADIANT')
            })   
            
            const dire_players = siths.map((player, idx) => {
                return new StarWarsPlayingDota2(player, dota2_heroes.dire[idx], 'DIRE')
            })

            const match = [radiant_players, dire_players].flatMap(p => p)
            await this.repository.saveMatch(match)
            return match
        } catch (error: unknown) {
            logger.error("Error found when calling API services: %s ", (error as Error).message)
            throw error
        }
    }

    public getAllPaginated(size: any, page: any) {
        const pagination: Pagination = {
            size: size ? parseInt(size) : 100,
            page: page ? parseInt(page) : 1,
        }

        return this.repository.findByPagination(pagination)
    }
}


export class StarWarsPlayingDota2 {
    player: SwapiPeople
    dota2_hero: Dota2Hero
    dota2_team: string

    constructor(p: SwapiPeople, h: Dota2Hero, t: string) {
        this.player = p
        this.dota2_hero = h
        this.dota2_team = t
    }
}