import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ReactionService } from './reaction.service'
import { ReactionController } from './reaction.controller'
import { Reaction } from './reaction.entity'

import { Mapper } from '../common/mapper'

@Module({
  imports: [TypeOrmModule.forFeature([Reaction])],
  controllers: [ReactionController],
  providers: [
    ReactionService,
    Mapper
  ],
  exports: [ReactionService]
})
export class ReactionModule {}
