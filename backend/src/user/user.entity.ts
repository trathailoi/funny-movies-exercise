import {
  BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn, OneToMany
} from 'typeorm'
import { Exclude, Expose } from 'class-transformer'

import type { Movie } from '../app/movie/movie.entity'

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
    id!: string

  @Unique(['email'])
  @Column()
    email: string

  @Column({
    nullable: true
  })
    firstName?: string

  @Column({
    nullable: true
  })
    lastName?: string

  @Exclude()
  // @Column({ select: false })
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

  @OneToMany('Movie', 'user', {
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
    const names = []
    if (this.firstName) {
      names.push(this.firstName)
    }
    if (this.lastName) {
      names.push(this.lastName)
    }
    return names.join(' ')
  }

  toJSON() {
    delete this.password
    return this
  }
}
