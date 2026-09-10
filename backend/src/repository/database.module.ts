import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Film } from './entities/film.entity';
import { Schedule } from './entities/schedule.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const driver = configService.getOrThrow<string>('DATABASE_DRIVER');

        if (driver !== 'postgres') {
          throw new Error(`Unsupported database driver: ${driver}`);
        }

        const databaseUrl = new URL(
          configService.getOrThrow<string>('DATABASE_URL'),
        );

        return {
          type: 'postgres' as const,
          host: databaseUrl.hostname,
          port: Number(databaseUrl.port) || 5432,
          database: databaseUrl.pathname.slice(1),
          username: configService.getOrThrow<string>('DATABASE_USERNAME'),
          password: configService.getOrThrow<string>('DATABASE_PASSWORD'),
          entities: [Film, Schedule],
          synchronize: false,
        };
      },
    }),
    TypeOrmModule.forFeature([Film, Schedule]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
