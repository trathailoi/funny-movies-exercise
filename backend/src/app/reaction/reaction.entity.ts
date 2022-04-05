import {
  Entity, Unique, PrimaryGeneratedColumn, Column, ManyToOne
} from 'typeorm'

import { BaseEntity } from '../common/base.entity'
import { User } from '../../user/user.entity'
// import { Movie } from '../movie/movie.entity'
import { IReaction } from './reaction.interface'
import { IMovie } from '../movie/movie.interface'

@Entity()
@Unique('unique_reaction_index', ['user', 'action', 'movie'])
export class Reaction extends BaseEntity implements IReaction {
  @PrimaryGeneratedColumn('uuid')
    id!: string

  @Column('varchar', {
    nullable: false,
    length: 20
  })
    action: string

  @ManyToOne(() => User, (user) => user.id, {
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
    movie: IMovie
}
