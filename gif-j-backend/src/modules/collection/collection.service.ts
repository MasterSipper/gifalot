import { InjectQueue } from '@nestjs/bull';
import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  NotFoundException,
} from '@nestjs/common';
import { Inject, Injectable } from '@nestjs/common/decorators';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bull';
import { ErrorCodes } from 'src/shared/error-codes';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { FileService } from '../file/file.service';
import { COLLECTION_CONSTANTS } from './collection.constants';
import { Collection } from './collection.entity';
import { CollectionCreateDto } from './dto/create';
import { CollectionUpdateDto } from './dto/update';

@Injectable()
export class CollectionService {
  constructor(
    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,
    @Inject(forwardRef(() => FileService))
    private readonly fileService: FileService,
    @InjectQueue('collection')
    private readonly collectionQueue: Queue,
  ) {}

  public async createCollection(userId: number, body: CollectionCreateDto) {
    const count = await this.getUserCollectionsCount(userId);
    if (count > COLLECTION_CONSTANTS.LIMIT_PER_USER) {
      throw new BadRequestException(ErrorCodes.COLLECTIONS_LIMIT_REACHED);
    }

    const collection = await this.collectionRepository
      .save({
        ...body,
        user: { id: userId },
      })
      .then((r) => this.collectionRepository.create(r));

    return collection.toAPI();
  }

  public async listCollection(userId: number, lastId?: number) {
    return this.collectionRepository
      .find({
        where: {
          id: MoreThan(lastId ?? 0),
          user: { id: userId },
        },
        take: COLLECTION_CONSTANTS.LIMIT_PER_PAGE,
      })
      .then((r) =>
        Promise.all(
          r.map(async (collection) => {
            if (!collection.coverImageKey) {
              return collection.toAPI();
            }
            const url = await this.fileService.getFileUrl(
              collection.coverImageKey,
            );

            return collection.toAPI(url);
          }),
        ),
      );
  }

  public async listPublicCollection(date?: string) {
    return this.collectionRepository
      .find({
        order: { createdAt: 'DESC' },
        where: {
          private: false,
          ...(date ? { createdAt: LessThan(new Date(date)) } : {}),
        },
        take: COLLECTION_CONSTANTS.LIMIT_PER_PAGE,
      })
      .then((r) =>
        Promise.all(
          r.map(async (collection) => {
            if (!collection.coverImageKey) {
              return collection.toAPI();
            }
            const url = await this.fileService.getFileUrl(
              collection.coverImageKey,
            );

            return collection.toAPI(url);
          }),
        ),
      );
  }

  public async getCollection(userId: number, id: number) {
    const collection = await this.collectionRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!collection) {
      throw new NotFoundException(ErrorCodes.COLLECTION_NOT_FOUND);
    }

    if (collection.ranks?.length) {
      collection.ranks = collection.ranks.map(Number);
    }

    return collection;
  }

  public async getPublicCollection(
    userId: number | null,
    ownerId: number,
    id: number,
  ) {
    const collection = await this.getCollection(ownerId, id);
    if (userId !== ownerId && collection.private) {
      throw new ForbiddenException(ErrorCodes.COLLECTION_IS_PRIVATE);
    }

    if (!collection.coverImageKey) {
      return collection.toAPI();
    }

    const url = await this.fileService.getFileUrl(collection.coverImageKey);
    return collection.toAPI(url);
  }

  public async updateCollection(
    userId: number,
    id: number,
    body: CollectionUpdateDto,
  ) {
    if (!Object.keys(body).length) {
      return;
    }

    const collection = await this.getCollection(userId, id);

    if (body.ranks?.length) {
      const fileId = body.ranks[0];
      if (collection.ranks?.[0] !== fileId) {
        const file = await this.fileService.getFile(fileId);
        if (file) {
          body['coverImageKey'] = this.fileService.buildKey(
            fileId,
            userId,
            id,
            file.ext,
          );
        }
      }
    }

    await this.collectionRepository.update(id, body);
  }

  public async deleteCollection(userId: number, id: number) {
    await this.getCollection(userId, id);

    await this.collectionRepository.delete(id);
    await this.collectionQueue.add('deleteCollection', {
      userId,
      collectionId: id,
    });
  }

  public async updateCoverImage(id: number, key: string | null) {
    await this.collectionRepository.update(id, { coverImageKey: key });
  }

  private getUserCollectionsCount(userId: number) {
    return this.collectionRepository
      .createQueryBuilder('collection')
      .leftJoinAndSelect('collection.user', 'user')
      .where('user.id = :userId', { userId })
      .getCount();
  }
}
