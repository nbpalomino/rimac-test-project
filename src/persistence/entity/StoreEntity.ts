import { BaseEntity } from "./BaseEntity"
import { Entity, Column } from 'typeorm'

@Entity({name: 'store'})
export class StoreEntity extends BaseEntity {

    @Column({type:'json', nullable: true})
    data: any
}