import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorCodes } from 'src/shared/error-codes';
import { In, LessThan, Repository } from 'typeorm';
import { File } from '../file/file.entity';
import { FileService } from '../file/file.service';
import { FAVORITE_CONSTANTS } from './favorite.constants';
import { FavoriteFile } from './favorite.entity';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(FavoriteFile)
    private readonly favoriteFileRepository: Repository<FavoriteFile>,
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    @Inject(forwardRef(() => FileService))
    private readonly fileService: FileService,
  ) {}

  public async createFavoriteFile(userId: number, fileId: number) {
    const file = await this.fileService.getFile(fileId);
    if (!file) {
      throw new BadRequestException(ErrorCodes.FILE_NOT_FOUND);
    }

    const ownerId = file.collection.userId;
    if (ownerId !== userId && file.collection.private) {
      throw new ForbiddenException(ErrorCodes.COLLECTION_IS_PRIVATE);
    }

    const favoriteFile = this.favoriteFileRepository.create({
      user: { id: userId },
      file: { id: fileId },
      owner: { id: ownerId },
    });

    try {
      await this.favoriteFileRepository.insert(favoriteFile);
    } catch (e) {
      if (e.code === '23505') {
        throw new BadRequestException(ErrorCodes.FILE_ALREADY_FAVORITED);
      }
    }
  }

  public async listFavoriteFiles(userId: number, date?: string) {
    const favoriteFiles = await this.favoriteFileRepository.find({
      order: {
        createdAt: 'DESC',
      },
      where: {
        userId,
        ...(date ? { createdAt: LessThan(new Date(date)) } : {}),
      },
      // for file.ext
      relations: ['file'],
      take: FAVORITE_CONSTANTS.LIMIT_PER_PAGE,
    });

    return Promise.all(
      favoriteFiles.map(async ({ file, ownerId, createdAt }) => {
        const url = await this.fileService.getFileUrl(
          this.fileService.buildKey(
            file.id,
            ownerId,
            file.collectionId,
            file.ext,
          ),
        );
        return file.toAPI(url, createdAt);
      }),
    );
  }

  public async listMostFavoritedFiles(userId: number, page?: number) {
    const files = await this.fileRepository.find({
      order: {
        favoritesCount: 'DESC',
      },
      where: {
        collection: { private: false },
      },
      // TODO maybe better way to get ownerId
      relations: ['collection'],
      skip: ((page ?? 1) - 1) * 50,
      take: 50,
    });

    const favorited = await this.favoriteFileRepository
      .find({
        where: {
          userId,
          fileId: In(files.map((file) => file.id)),
        },
      })
      .then((r) =>
        r.reduce((acc, file) => {
          acc[file.fileId] = file.createdAt;
          return acc;
        }, {}),
      );

    return Promise.all(
      files.map(async (file) => {
        const url = await this.fileService.getFileUrl(
          this.fileService.buildKey(
            file.id,
            file.collection.userId,
            file.collectionId,
            file.ext,
          ),
        );

        return file.toAPI(url, favorited[file.id]);
      }),
    );
  }

  public async deleteFavoriteFile(userId: number, fileId: number) {
    await this.favoriteFileRepository.delete({
      file: { id: fileId },
      user: { id: userId },
    });
  }
}
