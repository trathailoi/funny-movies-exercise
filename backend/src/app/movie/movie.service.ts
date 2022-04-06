import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import type { EntityId } from 'typeorm/repository/EntityId'

import { BaseService } from '../common/base.service'
import { Movie } from './movie.entity'

@Injectable()
export class MovieService extends BaseService<Movie> {
  constructor(@InjectRepository(Movie) private readonly repo: Repository<Movie>) {
    super(repo)
  }

  findOne(id: EntityId): Promise<Movie | undefined> {
    return this.repo.findOne(id, { relations: ['reactions', 'reactions.user', 'reactions.movie'] })
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
