import {
  Controller,
  UsePipes, HttpCode, HttpStatus,
  Post, Get, Patch, Delete, Body, Param, Query, Req,
  BadRequestException, NotFoundException
} from '@nestjs/common'
import {
  ApiTags, ApiCreatedResponse, ApiBadRequestResponse, ApiOkResponse, ApiNotFoundResponse, ApiNoContentResponse, ApiQuery, ApiOperation
} from '@nestjs/swagger'
import * as Joi from 'joi'

import { Mapper } from '../common/mapper'
import { JoiValidationPipe } from '../common/validation.pipe'
import { MzSwaggerAuth } from '../common/decorator/swagger-auth.decorator'
import { MzPublic } from '../common/decorator/public.decorator'

import { Movie } from './movie.entity'
import { MovieService } from './movie.service'
import { MovieDto } from './dto/movie.dto'

import { Reaction } from '../reaction/reaction.entity'
import { ReactionService } from '../reaction/reaction.service'
import { ReactionDto } from '../reaction/dto/reaction.dto'

@ApiTags('movies')
@MzSwaggerAuth()
@Controller('movies')
export class MovieController {
  constructor(
    private readonly movieService: MovieService,
    private readonly reactionService: ReactionService,
    private readonly mapper: Mapper
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'create a new movie' })
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  @UsePipes(new JoiValidationPipe({
    body: Joi.object().keys({
      title: Joi.string().required(),
      desc: Joi.string().required(),
      thumbnailPath: Joi.string(),
      srcPath: Joi.string(),
      author: Joi.string().guid()
    })
  }))
  async create(@Body() movieDto: MovieDto, @Req() req) {
    try {
      const result = await this.movieService.create(this.mapper.map(MovieDto, Movie, { ...movieDto, ...(movieDto.author ? {} : { author: req.user.id }) }), req.user)
      return result.identifiers[0]
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  @Get()
  @ApiOperation({ summary: 'get movies with reactions' })
  @ApiOkResponse({ type: Movie, isArray: true })
  @UsePipes(new JoiValidationPipe({
    query: Joi.object({
      pageSize: Joi.number().integer().min(1).max(50)
        .default(10),
      currentPage: Joi.number().integer().min(1).default(1)
    })
  }))
  @ApiQuery({
    name: 'pageSize', required: false, schema: { minimum: 1, maximum: 50 }, description: 'Page size.'
  })
  @ApiQuery({
    name: 'currentPage', required: false, schema: { minimum: 1 }, description: 'Current page.'
  })
  @MzPublic()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query('pageSize') pageSize: number, @Query('currentPage') currentPage: number) {
    // try {
    const { data, count } = await this.movieService.findAll({
      pagination: {
        pageSize,
        currentPage
      },
      relations: ['author', 'reactions', 'reactions.user'],
      select: [
        'id', 'title', 'desc', 'thumbnailPath', 'srcPath', 'author'
        // 'reactions.action', 'reactions.user',
        // 'reactions.user.id', 'reactions.user.email'
      ]
    })
    return {
      data: data.map((m: Movie) => ({
        id: m.id,
        title: m.title,
        desc: m.desc,
        thumbnailPath: m.thumbnailPath,
        srcPath: m.srcPath,
        author: m.author && m.author.id ? {
          id: m.author.id,
          email: m.author.email
        } : {},
        likes: m.reactions.filter((r) => r.action === 'like').map((r) => r.user.id),
        dislikes: m.reactions.filter((r) => r.action === 'dislike').map((r) => r.user.id)
      })),
      count
    }
    // } catch (error) {
    //   throw new BadRequestException(error)
    // }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'get a movie detail with reactions' })
  @ApiOkResponse({ type: Movie, isArray: false })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @UsePipes(new JoiValidationPipe({
    param: Joi.object().keys({
      id: Joi.string().guid().required().description('ID of movie to return')
    })
  }))
  async findOne(@Param('id') id: string) {
    let result
    try {
      result = await this.movieService.findOne(id)
    } catch (error) {
      throw new BadRequestException(error)
    }
    if (!result) {
      throw new NotFoundException()
    }
    return result
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'update a movie' })
  @ApiNoContentResponse()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @UsePipes(new JoiValidationPipe({
    body: Joi.object().keys({
      title: Joi.string().required(),
      desc: Joi.string().required(),
      thumbnailPath: Joi.string(),
      srcPath: Joi.string(),
      author: Joi.string().guid().required()
    }),
    param: Joi.object().keys({
      id: Joi.string().guid().required().description('ID of the movie that needs to be updated')
    })
  }))
  async update(@Param('id') id: string, @Body() movieDto: MovieDto, @Req() req) {
    const result = await this.movieService.update(id, this.mapper.map(MovieDto, Movie, movieDto), req.user)
    if (!result.affected) {
      throw new NotFoundException()
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'delete a movie' })
  @ApiNoContentResponse()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @UsePipes(new JoiValidationPipe({
    param: Joi.object().keys({
      id: Joi.string().guid().required().description('Movie id to delete')
    })
  }))
  async delete(@Param('id') id: string) {
    try {
      const result = await this.movieService.delete(id)
      if (!result.affected) {
        return new NotFoundException()
      }
      return result
    } catch (error) {
      return new BadRequestException(error)
    }
  }

  @Patch(':id/reactions')
  // @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'react a movie' })
  @ApiNoContentResponse()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @UsePipes(new JoiValidationPipe({
    param: Joi.object().keys({
      id: Joi.string().guid().required().description('ID of the movie')
    }),
    query: Joi.object().keys({
      action: Joi.string().description('do an action on a movie')
    })
  }))
  async reactMovie(@Param('id') id: string, @Query('action') action: string, @Req() req) {
    // TODO: need to implement ExceptionFilter at global scope for such cases
    // try {
    await this.reactionService.react(this.mapper.map(ReactionDto, Reaction, { movie: id, action, user: req.user.id }))
    const result = await this.reactionService.getReactions(id)
    return {
      message: 'success',
      likes: result.reduce((ls: string[], r: Reaction) => {
        if (r.action === 'like') {
          ls.push(r.user.id)
        }
        return ls
      }, []),
      dislikes: result.reduce((dls: string[], r: Reaction) => {
        if (r.action === 'dislike') {
          dls.push(r.user.id)
        }
        return dls
      }, [])
    }
    // } catch (error) {
    //   throw new BadRequestException(error)
    // }
  }
}
