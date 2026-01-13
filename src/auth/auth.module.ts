import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller.ts';
import { AuthService } from './auth.service.ts';
import { ProfileModule } from '../profile/profile.module.ts';
import { PassportModule } from '@nestjs/passport';
import { JwtAccessStrategy } from './strategy/jwt-access.strategy.ts';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './entity/refresh-token.entity.ts';
import { StringValue } from 'ms';
@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: configService.getOrThrow<StringValue>('JWT_ACCESS_EXPIRES_IN'),
        },
      }),
    }),
    TypeOrmModule.forFeature([RefreshToken]),
    PassportModule,
    ProfileModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAccessStrategy],
})
export class AuthModule { }
