import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module.ts';
import { ProfileModule } from './features/profile/profile.module.ts';
import { AvatarModule } from './features/avatar/avatar.module.ts';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { BalanceResetModule } from './features/balance-reset/balance-reset.module.ts';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.test.local'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: false,
      }),
      async dataSourceFactory(options) {
        if (!options) {
          throw new Error('Invalid options passed');
        }
        const ds = new DataSource(options);
        await ds.initialize();
        return addTransactionalDataSource(ds);
      },
    }),
    AuthModule,
    ProfileModule,
    AvatarModule,
    BalanceResetModule,
  ],
})
export class AppModule {}
