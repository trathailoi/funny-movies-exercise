import {
  Entity, Unique, PrimaryGeneratedColumn, Column, ManyToOne
} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'

import type { Movie } from '../movie/movie.entity'

import { BaseEntity } from '../../common/base.entity'
import { User } from '../../user/user.entity'

export enum ReactionType {
  like = 'like',
  dislike = 'dislike'
}

@Entity()
@Unique('unique_reaction_index', ['user', 'action', 'movie'])
export class Reaction extends BaseEntity<Reaction> {
  @ApiProperty({ format: 'uuid', example: 'f620a1bf-d317-4bcb-a190-0213bede890b' })
  @PrimaryGeneratedColumn('uuid')
    id!: string

  @ApiProperty({ example: 'like' })
  @Column({
    type: 'enum',
    enum: ReactionType
  })
    action: ReactionType

  @ApiProperty({ format: 'uuid', example: 'f620a1bf-d317-4bcb-a190-0213bede890b' })
  // @ApiProperty({ type: () => User })
  @ManyToOne('User', 'reaction', {
    // cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false
  })
    user: User

  @ApiProperty({ format: 'uuid', example: 'f620a1bf-d317-4bcb-a190-0213bede890b' })
  @ManyToOne('Movie', 'reaction', {
    // cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false
  })
    movie: Movie
}
