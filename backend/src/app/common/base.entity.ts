import {
  PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, BaseEntity as SuperBaseEntity
} from 'typeorm'

export abstract class BaseEntity extends SuperBaseEntity {
  @PrimaryGeneratedColumn('uuid')
    id: string

  @Column('text')
    creationAccountName: string

  @CreateDateColumn({
    type: 'timestamptz',
    default: 'now()' // default: () => 'CURRENT_TIMESTAMP'
  })
    creationHostTimestamp: Date

  @Column('text', { nullable: true })
    modificationAccountName: string

  @UpdateDateColumn({
    type: 'timestamptz',
    default: 'now()' // default: () => 'CURRENT_TIMESTAMP'
  })
    modificationHostTimestamp: Date

  @UpdateDateColumn({
    type: 'timestamp',
    default: 'now()' // default: () => 'CURRENT_TIMESTAMP'
  })
    modificationTimestamp: Date
}
