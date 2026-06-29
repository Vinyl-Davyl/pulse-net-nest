import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfig } from './config/configuration';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AppConfig, true>) => ({
        type: 'postgres',
        url: configService.get('databaseUrl', { infer: true }),
        autoLoadEntities: true,  // picks up @Entity classes from forFeature modules
        synchronize: true,       // DEV ONLY — creates tables from entities; use migrations in prod
      }),
    }),
  ],
})
export class CoreModule {}