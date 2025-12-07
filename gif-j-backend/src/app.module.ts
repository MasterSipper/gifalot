import { S3Client } from '@aws-sdk/client-s3';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { BullModule } from '@nestjs/bull';
import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';
import { AwsSdkModule } from 'aws-sdk-v3-nest';
import { resolve } from 'path';
import { AuthModule } from './modules/auth/auth.module';
import { CollectionModule } from './modules/collection/collection.module';
import { FavoriteModule } from './modules/favorite/favorite.module';
import { FileModule } from './modules/file/file.module';
import { AppController } from './app.controller';

@Module({
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          whitelist: true,
          forbidNonWhitelisted: true,
          transform: true,
          transformOptions: { enableImplicitConversion: true },
        }),
    },
  ],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      ttl: 10,
      limit: 20,
    }),
    AwsSdkModule.register({
      isGlobal: true,
      client: new S3Client({
        region: process.env.AWS_REGION || 'eu-central-1',
        endpoint: process.env.S3_ENDPOINT || undefined, // For S3-compatible services like Contabo
        forcePathStyle: !!process.env.S3_ENDPOINT, // Required for custom endpoints
        credentials: (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) ? {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
        } : undefined,
      }),
    }),
    GoogleRecaptchaModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secretKey: configService.get<string>('GOOGLE_RECAPTCHA_SECRET_KEY'),
        response: (req) => req.headers['recaptcha'],
        actions: ['register', 'login'],
        skipIf: process.env.STAGE === 'local',
        score: 0.6,
      }),
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        config: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
          password: configService.get<string>('REDIS_PASSWORD'),
        },
      }),
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        prefix: 'bull#',
        redis: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
          password: configService.get<string>('REDIS_PASSWORD'),
        },
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('MYSQL_HOST'),
        port: configService.get<number>('MYSQL_PORT'),
        username: configService.get<string>('MYSQL_USER'),
        password: configService.get<string>('MYSQL_PASSWORD'),
        database: configService.get<string>('MYSQL_DB'),
        entities: [resolve(__dirname, '**/*.entity.{ts,js}')],
        migrations: [resolve(__dirname, 'migrations/*.{ts,js}')],
        migrationsRun: true,
        extra: {
          connectionLimit: 10,
          ssl: {
            rejectUnauthorized: false,
          },
        },
        connectorPackage: 'mysql2',
      }),
    }),
    AuthModule,
    CollectionModule,
    FileModule,
    FavoriteModule,
  ],
})
export class AppModule {}
