import {
  Entity, Unique, PrimaryGeneratedColumn, Column, ManyToOne
} from 'typeorm'

import type { Movie } from '../movie/movie.entity'

import { BaseEntity } from '../common/base.entity'
import { User } from '../../user/user.entity'

@Entity()
@Unique('unique_reaction_index', ['user', 'action', 'movie'])
export class Reaction extends BaseEntity<Reaction> {
  @PrimaryGeneratedColumn('uuid')
    id!: string

  @Column('varchar', {
    nullable: false,
    length: 20
  })
    action: string

  @ManyToOne('User', 'reaction', {
    // cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false
  })
    user: User

  @ManyToOne('Movie', 'reaction', {
    // cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false
  })
    movie: Movie
}
