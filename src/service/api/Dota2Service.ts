import { Service, Container } from "typedi"
import axios from 'axios'

import { Cache } from '../../persistence/database/redis'

// npc_dota_hero_antimage=Luke, npc_dota_hero_abaddon=Anakin, npc_dota_hero_meepo=Yoda, 
// npc_dota_hero_necrolyte=palpatine, npc_dota_hero_spectre=D.V,npc_dota_hero_dark_seer=jarjarbinks
const BASE_URL = 'https://api.opendota.com/api'

type Dota2HeroDto = {
    name: string,
    localized_name: string,
    attack_type: string,
    primary_attr: string,
    roles: string[],
}

@Service()
export class Dota2Service {
    private radiant_team = ['npc_dota_hero_antimage', 'npc_dota_hero_abaddon', 'npc_dota_hero_meepo']
    private dire_team    = ['npc_dota_hero_necrolyte', 'npc_dota_hero_spectre', 'npc_dota_hero_dark_seer']

    public async getHeroesByTeams() {        
        try {
            const result = await this.getHeroesFromCache()
            const radiant_heroes = result
                .filter(hero => this.radiant_team.includes(hero.name))
                .map(hero => new Dota2Hero(hero))
                
            const dire_heroes = result
                .filter(hero => this.dire_team.includes(hero.name))
                .map(hero => new Dota2Hero(hero))

            return {
                radiant: radiant_heroes,
                dire: dire_heroes,
            } as Dota2Teams
        } catch (error) {
            console.error(`Error fetching DOTA2 TEAM heroes: ${error}`)
            throw error
        }
    }

    private async getHeroes() {
        try {
            const results = await axios.get<Dota2HeroDto[]>(`${BASE_URL}/heroes`)
            return results.data.map(
                ({name, localized_name, attack_type, primary_attr, roles}) => ({name, localized_name, attack_type, primary_attr, roles} as Dota2HeroDto)
            )
        } catch(error) {
            console.error(`Error fetching HEROES from Dota2`)
            throw error
        }
    }

    private async getHeroesFromCache() {
        const cache: Cache = Container.get('cache')

        let result = await cache.getCache<Dota2HeroDto[]>('dota2-heroes')
        if(!result) {
            result = await this.getHeroes()
            await cache.setCache('dota2-heroes', result)
        }
        return result
    }
}


export type Dota2Teams = {
    radiant: Dota2Hero[],
    dire: Dota2Hero[]
}

export class Dota2Hero {
    name: string
    id: string
    team: string
    attribute: string
    attack: string
    role: string

    constructor(dto: Dota2HeroDto) {
        this.id     = dto.name
        this.name   = dto.localized_name
        this.attribute   = this.normalize(dto.primary_attr)
        this.attack = dto.attack_type
        this.role   = dto.roles[0]
    }

    private normalize(attr: string) {
        const attributes = {
            agi: "Agility",
            str: "Strength",
            int: "Intelligence",
            all: "Universal",
        }
        return attributes[attr]
    }
}
