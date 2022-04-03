import {
  Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, HttpCode, Req, HttpStatus
} from '@nestjs/common'
import {
  ApiTags, ApiOkResponse, ApiNoContentResponse, ApiCreatedResponse, ApiBadRequestResponse, ApiNotFoundResponse
} from '@nestjs/swagger'
import * as Joi from 'joi'

import { Mapper } from '../common/mapper'
import { JoiValidationPipe } from '../common/validation.pipe'
import { MzSwaggerAuth } from '../common/decorator/swagger-auth.decorator'
import { Sample } from './sample.entity'
import { SampleService } from './sample.service'
import { CreateSampleDto } from './dto/create-sample.dto'
import { UpdateSampleDto } from './dto/update-sample.dto'

@ApiTags('samples')
@MzSwaggerAuth()
@Controller('samples')
export class SampleController {
  constructor(
    private readonly sampleService: SampleService,
    private readonly mapper: Mapper
  ) {}

  @Post()
  @UsePipes(new JoiValidationPipe({
    body: Joi.object({})
  }))
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  async create(@Body() createSampleDto: CreateSampleDto, @Req() req) {
    const result = await this.sampleService.create(this.mapper.map(CreateSampleDto, Sample, createSampleDto), req.user)
    return result.identifiers[0]
  }

  @Get()
  @UsePipes(new JoiValidationPipe({
    query: Joi.object({})
  }))
  @ApiOkResponse({ type: Sample, isArray: true })
  findAll() {
    return this.sampleService.findAll({})
  }

  @Get(':id')
  @UsePipes(new JoiValidationPipe({
    param: Joi.object({
      id: Joi.string().guid().required()
    })
  }))
  @ApiNotFoundResponse()
  @ApiOkResponse({ type: Sample })
  findOne(@Param('id') id: string) {
    return this.sampleService.findOne(id)
  }

  @Patch(':id')
  @UsePipes(new JoiValidationPipe({
    param: Joi.object({
      id: Joi.string().guid().required()
    }),
    body: Joi.object({})
  }))
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  update(@Param('id') id: string, @Body() updateSampleDto: UpdateSampleDto, @Req() req) {
    return this.sampleService.update(id, this.mapper.map(UpdateSampleDto, Sample, updateSampleDto), req.user)
  }

  @Delete(':id')
  @UsePipes(new JoiValidationPipe({
    param: Joi.object({
      id: Joi.string().guid().required()
    })
  }))
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.sampleService.delete(id)
  }
}
