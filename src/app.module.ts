import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module.ts';
import { ProfileModule } from './profile/profile.module.ts';
import { Profile } from './profile/entities/profile.entity.ts';
import { RefreshToken } from './auth/entities/refresh-token.entity.ts';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.test.local', '.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        entities: [
          Profile,
          RefreshToken,
        ],
        synchronize: true,
      })
    }),
    AuthModule,
    ProfileModule
  ],
})
export class AppModule { }
