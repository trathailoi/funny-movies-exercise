import {
  Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne
} from 'typeorm'

import type { Reaction } from '../reaction/reaction.entity'
import type { User } from '../../user/user.entity'

import { BaseEntity } from '../../common/base.entity'

@Entity()
export class Movie extends BaseEntity<Movie> {
  @PrimaryGeneratedColumn('uuid')
    id!: string

  @Column('varchar', {
    nullable: false,
    length: 100
  })
    title: string

  @Column('varchar', {
    nullable: false,
    length: 500
  })
    desc: string

  @Column('varchar', {
    nullable: false,
    length: 300
  })
    thumbnailPath: string

  @Column('varchar', {
    nullable: false,
    length: 300
  })
    srcPath: string

  @ManyToOne('User', 'movie')
    author: User

  @OneToMany('Reaction', 'movie', {
    cascade: true,
    // // nullable: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
    reactions?: Reaction[]
}
