import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from '../file/file.entity';
import { FileModule } from '../file/file.module';
import { FavoriteController } from './favorite.controller';
import { FavoriteFile } from './favorite.entity';
import { FavoriteService } from './favorite.service';

@Module({
  controllers: [FavoriteController],
  providers: [FavoriteService],
  imports: [FileModule, TypeOrmModule.forFeature([File, FavoriteFile])],
  exports: [FavoriteService],
})
export class FavoriteModule {}
