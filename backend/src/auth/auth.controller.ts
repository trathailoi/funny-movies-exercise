import {
  Controller, Post, UseGuards, Request, UsePipes, HttpCode, HttpStatus,
  Body, BadRequestException
} from '@nestjs/common'
import * as Joi from 'joi'
import {
  ApiOkResponse, ApiTags, ApiBody, ApiOperation, ApiCreatedResponse
} from '@nestjs/swagger'
import { joiPassword } from 'joi-password'

import { AuthService } from './auth.service'
import { LocalAuthGuard } from './local-auth.guard'
import { MzPublic } from '../app/common/decorator/public.decorator'
import { JoiValidationPipe } from '../app/common/validation.pipe'

@ApiTags('authen')
@Controller('authen')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Post('signup')
  @ApiOperation({ summary: 'sign up' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['email', 'password', 'confirmPassword'],
      properties: {
        email: { type: 'email', example: 'somebody@hotmail.com' },
        password: { type: 'string', example: 'Y0uKnowWh@tItIs' },
        confirmPassword: { type: 'string', example: 'Y0uKnowWh@tItIs' }
      }
    }
  })
  @ApiCreatedResponse({})
  @MzPublic()
  @UsePipes(new JoiValidationPipe({
    body: Joi.object({
      email: Joi.string().email().required(),
      password: joiPassword
        .string()
        .min(8)
        // .minOfSpecialCharacters(1)
        // .minOfLowercase(1)
        .minOfUppercase(1)
        .minOfNumeric(1)
        .noWhiteSpaces()
        .required(),
      confirmPassword: Joi.string().required().valid(Joi.ref('password'))
    })
  }))
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() signupData: { email: string, password: string, confirmPassword: string }) {
    try {
      const result = await this.authService.signup(signupData)
      return result.identifiers[0]
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  @Post('signin')
  @ApiOperation({ summary: 'sign in' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: { type: 'email', example: 'somebody@hotmail.com' },
        password: { type: 'string', example: 'Y0uKnowWh@tItIs' }
      }
    }
  })
  @ApiOkResponse({
    isArray: true,
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string', example: 'some_random_accesst_token' }
      }
    }
  })
  @UsePipes(new JoiValidationPipe({
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required()
    })
  }))
  // eslint-disable-next-line class-methods-use-this
  @UseGuards(LocalAuthGuard)
  @MzPublic()
  @HttpCode(HttpStatus.OK)
  login(@Request() req) {
    return this.authService.login(req.user)
  }
}
