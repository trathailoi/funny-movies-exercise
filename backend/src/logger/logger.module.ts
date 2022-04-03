import { Global, Module } from '@nestjs/common'
import { MzLogger } from './logger.service'

@Global()
@Module({
  providers: [MzLogger],
  exports: [MzLogger]
})
export class LoggerModule {
}
