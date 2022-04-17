import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, InsertResult, UpdateResult } from 'typeorm'
import type { EntityId } from 'typeorm/repository/EntityId'

import { Mapper } from '../../common/mapper'
import { BaseService } from '../../common/base.service'
import { Movie } from './movie.entity'
import { MovieDto } from './dto/movie.dto'

import { User } from '../../user/user.entity'

@Injectable()
export class MovieService extends BaseService<Movie> {
  constructor(
    @InjectRepository(Movie) private readonly repo: Repository<Movie>,
    private readonly mapper: Mapper
  ) {
    super(repo)
  }

  create(entity: MovieDto, createdBy: User): Promise<InsertResult> {
    return this.repository.insert(this.mapper.map(MovieDto, Movie, { ...entity, createdBy }))
  }

  findOne(id: EntityId): Promise<Movie | undefined> {
    return this.repo.findOne(id, { relations: ['reactions', 'reactions.user', 'reactions.movie'] })
  }

  update(id: EntityId, entity: MovieDto, modifiedBy: User): Promise<UpdateResult> {
    // const { author, ...data } = entity
    // return this.repo.update(id, { ...data, modifiedBy })
    const { author, ...data } = entity // we don't want to update author
    return this.repo.update(id, this.mapper.map(MovieDto, Movie, { ...data, modifiedBy }))
  }

  // async findAllWithReactions(): Promise<Array<Movie>> {
  //   return this.repo.createQueryBuilder('movie')
  //     .innerJoinAndSelect('movie.reactions', 'reaction')
  //     .select([
  //       'movie.*',
  //       // 'movie.reactions AS myreactions'
  //       'reaction.action'
  //     ])
  //     .getMany()
  // }
}
