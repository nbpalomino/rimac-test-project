import { Service, Container } from "typedi"
import axios from 'axios'
import { Cache } from '../../persistence/database/redis'

// 1=Luke, 11 = Anakin, 20 = Yoda, 21= palpatine, 4 = D.V, 36=jar jar binks ???
const BASE_URL = 'https://swapi.dev/api'

type SwapiPeopleDto = {
    name: string,
    gender: string,
    height: string,
    mass: string,
    species: string[],
}

@Service()
export class SwapiService {
    private jedis_id = [1, 11, 20]
    private siths_id = [21, 4, 36]

    public async getJedis() {
        try {
            const result = await Promise.all(
                this.jedis_id.map(p => this.getPeopleFromCache(p))
            )
            return result
        } catch (error) {
            console.error(`Error fetching Jedis: ${error}`)
            throw error
        }
    }    
    
    public async getSiths() {
        try {
            const result = await Promise.all(
                this.siths_id.map(p => this.getPeopleFromCache(p))
            )
            return result
        } catch (error) {
            console.error(`Error fetching SITHS: ${error}`)
            throw error
        }
    }

    private async getPeopleById(id: number) {
        try {
            const result = await axios.get<SwapiPeopleDto>(`${BASE_URL}/people/${id}`)
            const {name, gender, height, mass, species} = result.data
            return new SwapiPeople({name, gender, height, mass, species} as SwapiPeopleDto)
        } catch(error) {
            console.error(`Error fetching PEOPLE: ${id}`)
            throw error
        }
    }

    private async getPeopleFromCache(id: number) {
        const cache: Cache = Container.get('cache')

        let result = await cache.getCache<SwapiPeople>(`swapi-people-${id}`)
        if(!result) {
            result = await this.getPeopleById(id)
            await cache.setCache(`swapi-people-${id}`, result)
        }
        return result
    }
}

export class SwapiPeople {
    name: string
    gender: string
    height: string
    mass: string

    constructor(dto: SwapiPeopleDto) {
        this.name = dto.name
        this.gender = dto.gender
        this.height = (`${dto.height}cm`)
        this.mass = (`${dto.mass}kg`)
    }
}