import { BullModule } from '@nestjs/bull';
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileModule } from '../file/file.module';
import { CollectionConsumer } from './collection.bull';
import { CollectionController } from './collection.controller';
import { Collection } from './collection.entity';
import { CollectionService } from './collection.service';

@Module({
  controllers: [CollectionController],
  providers: [CollectionService, CollectionConsumer],
  imports: [
    forwardRef(() => FileModule),
    BullModule.registerQueue({
      name: 'collection',
      settings: {
        retryProcessDelay: 250,
      },
    }),
    TypeOrmModule.forFeature([Collection]),
  ],
  exports: [CollectionService],
})
export class CollectionModule {}
