import {
  Controller,
  UsePipes, HttpCode, HttpStatus,
  Get, Delete, Param
} from '@nestjs/common'
import {
  ApiTags, ApiOkResponse, ApiBadRequestResponse, ApiNotFoundResponse, ApiNoContentResponse, ApiOperation
} from '@nestjs/swagger'
import * as Joi from 'joi'

import { JoiValidationPipe } from '../common/validation.pipe'
import { MzSwaggerAuth } from '../common/decorator/swagger-auth.decorator'

// import { Reaction } from './reaction.entity'
import { ReactionService } from './reaction.service'
import { ReactionDto } from './dto/reaction.dto'

@ApiTags('reactions')
@MzSwaggerAuth()
@Controller('reactions')
export class ReactionController {
  constructor(private readonly reactionService: ReactionService) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'for development purposes' })
  @ApiOkResponse({ type: ReactionDto, isArray: false })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @UsePipes(new JoiValidationPipe({
    param: Joi.object().keys({
      id: Joi.string().guid().required().description('ID of reaction to return')
    })
  }))
  async findOne(@Param('id') id: string) {
    const result = await this.reactionService.findOne(id)
    return result
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'for development purposes' })
  @ApiNoContentResponse()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @UsePipes(new JoiValidationPipe({
    param: Joi.object().keys({
      id: Joi.string().guid().required().description('Reaction id to delete')
    })
  }))
  async delete(@Param('id') id: string) {
    const result = await this.reactionService.delete(id)
    return result
  }
}
