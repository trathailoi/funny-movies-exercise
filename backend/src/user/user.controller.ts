import {
  Controller, Post, Get, Body, Query, HttpCode, HttpStatus, UsePipes, BadRequestException
} from '@nestjs/common'
import {
  ApiTags, ApiBody, ApiCreatedResponse, ApiOperation, ApiOkResponse, ApiQuery
} from '@nestjs/swagger'
import * as Joi from 'joi'
import { joiPassword } from 'joi-password'

// import { MzPublic } from '../app/common/decorator/public.decorator'
import { JoiValidationPipe } from '../app/common/validation.pipe'
import { CreateUserDto } from './dto/create-user.dto'
import { User } from './user.entity'
import { UserService } from './user.service'

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService
  ) {}

  @Post()
  @ApiOperation({ summary: 'create new user (for development purpose)' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['email', 'firstName', 'lastName', 'password'],
      properties: {
        email: { type: 'email', example: 'somebody@hotmail.com' },
        firstName: { type: 'string', example: 'Tom' },
        lastName: { type: 'string', example: 'Cruise' },
        password: { type: 'string', example: 'Y0uKnowWh@tItIs' }
      }
    }
  })
  @ApiCreatedResponse({})
  // @ApiExcludeEndpoint()
  @UsePipes(new JoiValidationPipe({
    body: Joi.object({
      email: Joi.string().email().required(),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      password: joiPassword
        .string()
        .min(8)
        // .minOfSpecialCharacters(1)
        // .minOfLowercase(1)
        .minOfUppercase(1)
        .minOfNumeric(1)
        .noWhiteSpaces()
        .required()
    })
  }))
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const result = await this.userService.create(createUserDto)
      return result.identifiers[0]
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  @Get()
  @ApiOperation({ summary: 'get users (for development purpose)' })
  // @ApiOkResponse({ type: User, isArray: true })
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
  @HttpCode(HttpStatus.OK)
  findAll(@Query('pageSize') pageSize: number, @Query('currentPage') currentPage: number) {
    return this.userService.findAll({
      pagination: {
        pageSize,
        currentPage
      }
      // select: ['id', 'email', 'firstName', 'lastName']
    })
  }
}
