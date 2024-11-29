import { BaseEntity } from "./BaseEntity"
import { Entity, Column } from 'typeorm'

@Entity({name: 'player'})
export class PlayerEntity extends BaseEntity {
    
    @Column({type:'json'})
    player: any
    
    @Column({type:'json'})
    dota2_hero: any

    @Column({type:'varchar'})
    dota2_team: string
}