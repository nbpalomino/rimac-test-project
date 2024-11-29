import {
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn 
} from 'typeorm'

export abstract class BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({name: 'is_deleted', default: false, select: false})
    isDeleted: boolean

    @CreateDateColumn()
    created_at: Date
    
    @UpdateDateColumn({nullable: true})
    updated_at: Date
}