import { Controller, Get } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { SkipThrottle } from '@nestjs/throttler'
import { AppService } from './app.service'
import { MzSwaggerAuth } from './app/common/decorator/swagger-auth.decorator'

@SkipThrottle()
@MzSwaggerAuth()
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService
  ) {}

  @Get()
  @ApiOperation({ summary: 'just for testing out the authorization functionality' })
  getHello(): string {
    return this.appService.getHello()
  }
}
