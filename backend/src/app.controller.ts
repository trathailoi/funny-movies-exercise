import {
  Controller, Get, Post, UseGuards, Request, UsePipes, HttpCode, HttpStatus
} from '@nestjs/common'
import * as Joi from 'joi'
import { ApiOkResponse, ApiTags, ApiBody } from '@nestjs/swagger'
import { AppService } from './app.service'
import { AuthService } from './auth/auth.service'
import { LocalAuthGuard } from './auth/local-auth.guard'
import { MzPublic } from './app/common/decorator/public.decorator'
import { JoiValidationPipe } from './app/common/validation.pipe'
import { MzSwaggerAuth } from './app/common/decorator/swagger-auth.decorator'

@MzSwaggerAuth()
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }

  @ApiTags('authen')
  @Post('auth/login')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: { type: 'email', example: 'somebody@hotmail.com' },
        password: { type: 'string', example: 'youknowwhatitis' }
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
  async login(@Request() req) {
    return this.authService.login(req.user)
  }
}
