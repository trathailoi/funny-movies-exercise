import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ReactionModule } from '../reaction/reaction.module'
import { MovieService } from './movie.service'
import { MovieController } from './movie.controller'
import { Movie } from './movie.entity'

import { Mapper } from '../../common/mapper'

@Module({
  imports: [
    TypeOrmModule.forFeature([Movie]),
    ReactionModule
  ],
  controllers: [MovieController],
  providers: [
    MovieService,
    Mapper
  ]
})
export class MovieModule {}
