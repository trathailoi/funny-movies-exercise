import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { getConnectionOptions } from 'typeorm'
import DatabaseLogger from './databaseLogger'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => Object.assign(await getConnectionOptions(), {
        logger: new DatabaseLogger(),
        entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
        autoLoadEntities: true,
        synchronize: false, // NOTE: should be 'false' to avoid data loss, and to make the migrations work
        migrationsRun: Boolean(configService.get('RUN_MIGRATIONS') === 'true'), // automatically run migrations
        migrations: [`${__dirname}/migration/*.{ts,js}`]
      })
    })
  ]
})
export class DatabaseModule {}
