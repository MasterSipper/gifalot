import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionModule } from '../collection/collection.module';
import { FileController } from './file.controller';
import { File } from './file.entity';
import { FileService } from './file.service';

@Module({
  controllers: [FileController],
  providers: [FileService],
  imports: [
    forwardRef(() => CollectionModule),
    TypeOrmModule.forFeature([File]),
  ],
  exports: [FileService],
})
export class FileModule {}
