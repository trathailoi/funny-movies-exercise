import {
  BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn, OneToMany
} from 'typeorm'
import { Exclude, Expose } from 'class-transformer'
import { Movie } from '../app/movie/movie.entity'

import { IUser } from './user.interface'

@Entity()
export class User extends BaseEntity implements IUser {
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

  @OneToMany(() => Movie, (movie) => movie.id, {
    cascade: true,
    // // nullable: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
    movies?: Movie[]

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
