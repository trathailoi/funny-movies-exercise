import {
  Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne
} from 'typeorm'

import { BaseEntity } from '../common/base.entity'
// import { Reaction } from '../reaction/reaction.entity'
import { IReaction } from '../reaction/reaction.interface'

import { IMovie } from './movie.interface'
import { IUser } from '../../user/user.interface'

@Entity()
export class Movie extends BaseEntity implements IMovie {
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
    author: IUser

  @OneToMany('Reaction', 'movie', {
    cascade: true,
    // // nullable: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
    reactions?: IReaction[]
}
