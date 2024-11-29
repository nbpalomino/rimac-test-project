import { BaseEntity } from './BaseEntity'
import { Entity, Column } from 'typeorm'

@Entity()
export class HistoryEntity extends BaseEntity {
    @Column('varchar')
    endpoint: string

    @Column('float', {default: 0})
    total_calls: number
}