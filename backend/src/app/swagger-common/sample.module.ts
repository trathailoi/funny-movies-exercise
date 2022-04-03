import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { SampleService } from './sample.service'
import { SampleController } from './sample.controller'
import { Sample } from './sample.entity'

import { Mapper } from '../common/mapper'

@Module({
  imports: [TypeOrmModule.forFeature([Sample])],
  controllers: [SampleController],
  providers: [
    SampleService,
    Mapper
  ]
})
export class SampleModule {}
