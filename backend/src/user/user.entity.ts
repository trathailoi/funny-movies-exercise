import {
  BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn
} from 'typeorm'
import { Exclude, Expose } from 'class-transformer'

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
    id!: string

  @Unique(['email'])
  @Column()
    email: string

  @Column()
    firstName: string

  @Column()
    lastName: string

  @Exclude()
  @Column()
    password: string

  @Column({ default: true })
    isActive: boolean

  // @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  @CreateDateColumn({
    type: 'timestamptz',
    default: 'now()'
    // nullable: true
  })
    createdAt?: Date

  // @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  @UpdateDateColumn({
    type: 'timestamptz',
    default: 'now()'
    // nullable: true
  })
    modifiedAt?: Date

  // @CreateDateColumn({
  //   default: 'now()',
  //   update: false,
  //   nullable: true
  // })
  //   createdAt: string

  // @UpdateDateColumn({
  //   default: 'now()',
  //   nullable: true
  // })
  //   updatedAt: string

  constructor(partial: Partial<User>) {
    super()
    Object.assign(this, partial)
  }

  @Expose()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`
  }
}
