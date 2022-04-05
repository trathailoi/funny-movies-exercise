import {
  PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, BaseEntity as SuperBaseEntity, ManyToOne
} from 'typeorm'
import { IUser } from '../../user/user.interface'

export abstract class BaseEntity extends SuperBaseEntity {
  @PrimaryGeneratedColumn('uuid')
    id?: string

  @Column({ type: 'boolean', default: true })
    isActive?: boolean

  @Column({ type: 'boolean', default: false })
    isArchived?: boolean

  // @Column({
  //   type: 'timestamptz',
  //   update: false,
  //   default: () => 'CURRENT_TIMESTAMP'
  // })
  //   createdTime: Date

  // @Column({
  //   type: 'timestamptz',
  //   default: () => 'CURRENT_TIMESTAMP',
  //   onUpdate: 'now()'
  // })
  //   updatedTime: Date

  @CreateDateColumn({
    type: 'timestamptz',
    default: 'now()' // default: () => 'CURRENT_TIMESTAMP'
    // nullable: true
  })
    createdAt?: Date

  @UpdateDateColumn({
    type: 'timestamptz',
    default: 'now()' // default: () => 'CURRENT_TIMESTAMP'
    // nullable: true
  })
    modifiedAt?: Date

  @ManyToOne('User', 'user')
    createdBy?: IUser

  @ManyToOne('User', 'user', {
    nullable: true
  })
    modifiedBy: IUser
}
