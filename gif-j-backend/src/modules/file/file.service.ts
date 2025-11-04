import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectAws } from 'aws-sdk-v3-nest';
import axios from 'axios';
import { load } from 'cheerio';
import { parse } from 'path';
import { ErrorCodes } from 'src/shared/error-codes';
import { Repository } from 'typeorm';
import { Collection } from '../collection/collection.entity';
import { CollectionService } from '../collection/collection.service';
import { FileCheckLinksDto } from './dto/check-links';
import { FileCreateDto } from './dto/create';
import { FileCreateFromLinksDto } from './dto/create-from-links';
import { FileCreateGiphyDto } from './dto/create-giphy';
import { FileGiphySearchDto } from './dto/giphy-search';
import { FileUpdateDto } from './dto/update';
import { FILE_CONSTANTS } from './file.constants';
import { File } from './file.entity';

@Injectable()
export class FileService {
  constructor(
    @InjectAws(S3Client) private readonly s3: S3Client,
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    @Inject(forwardRef(() => CollectionService))
    private readonly collectionService: CollectionService,
  ) {}

  public async createFile(
    userId: number,
    collectionId: number,
    body: FileCreateDto,
  ) {
    const collection = await this.collectionService.getCollection(
      userId,
      collectionId,
    );

    const count = await this.getUserFilesCount(collectionId);
    if (count > FILE_CONSTANTS.LIMIT_PER_COLLECTION) {
      throw new BadRequestException(ErrorCodes.FILES_LIMIT_REACHED);
    }

    const name = parse(body.filename).name;
    const ext = parse(body.filename).ext.slice(1);

    const file = this.fileRepository.create({
      name,
      ext,
      mimeType: body.mimeType,
      collection: { id: collectionId },
    });
    await this.fileRepository.insert(file);

    const key = this.buildKey(file.id, userId, collectionId, ext);
    if (!collection.coverImageKey) {
      await this.collectionService.updateCoverImage(collectionId, key);
    }

    const [upload, url] = await Promise.all([
      this.getPutUrl(key),
      this.getFileUrl(key),
    ]);

    return { file: file.toAPI(url), upload };
  }

  public async createFileGiphy(
    userId: number,
    collectionId: number,
    body: FileCreateGiphyDto,
  ) {
    const collection = await this.collectionService.getCollection(
      userId,
      collectionId,
    );

    const count = await this.getUserFilesCount(collectionId);
    if (count > FILE_CONSTANTS.LIMIT_PER_COLLECTION) {
      throw new BadRequestException(ErrorCodes.FILES_LIMIT_REACHED);
    }

    if (count + body.ids.length > FILE_CONSTANTS.LIMIT_PER_COLLECTION) {
      throw new BadRequestException(ErrorCodes.TOO_MANY_FILES);
    }

    try {
      const gifs = await axios
        .get<{
          data: { title: string; images: { original: { url: string } } }[];
        }>(`https://api.giphy.com/v1/gifs`, {
          params: {
            ids: body.ids.join(','),
            api_key: process.env.GIPHY_API_KEY,
          },
        })
        .then((r) => r.data.data);

      return this.batchCreate(
        userId,
        collection,
        gifs.map((gif) => ({
          name: gif.title.slice(0, 255).toLowerCase(),
          ext: 'gif',
          mimeType: 'image/gif',
          url: gif.images.original.url,
        })),
      );
    } catch (e) {
      if (e.response.data.meta.status !== 200) {
        throw new BadRequestException(ErrorCodes.INVALID_GIPHY_IDS);
      }

      throw e;
    }
  }

  public async createFilesLinks(
    userId: number,
    collectionId: number,
    body: FileCreateFromLinksDto,
  ) {
    const collection = await this.collectionService.getCollection(
      userId,
      collectionId,
    );

    const count = await this.getUserFilesCount(collectionId);
    if (count > FILE_CONSTANTS.LIMIT_PER_COLLECTION) {
      throw new BadRequestException(ErrorCodes.FILES_LIMIT_REACHED);
    }

    if (count + body.links.length > FILE_CONSTANTS.LIMIT_PER_COLLECTION) {
      throw new BadRequestException(ErrorCodes.TOO_MANY_FILES);
    }

    return this.batchCreate(
      userId,
      collection,
      body.links.map((link) => ({
        name: 'untitled',
        ext: 'gif',
        mimeType: 'image.gif',
        url: link,
      })),
    );
  }

  public async getFile(fileId: number) {
    return this.fileRepository.findOne({
      where: { id: fileId },
      relations: ['collection'],
    });
  }

  public async listFiles(
    userId: number | null,
    ownerId: number,
    collectionId: number,
  ) {
    const collection = await this.collectionService.getCollection(
      ownerId,
      collectionId,
    );
    if (userId !== collection.userId && collection.private) {
      throw new ForbiddenException(ErrorCodes.COLLECTION_IS_PRIVATE);
    }

    let files: Array<File & { favoriteCreatedAt?: Date }> = [];
    if (userId) {
      files = await this.fileRepository
        .createQueryBuilder('file')
        .leftJoinAndSelect(
          'file.favoriteFiles',
          'users_favorite_files',
          'users_favorite_files.userId = :userId',
          { userId },
        )
        .where('file.collectionId = :collectionId', { collectionId })
        .select([
          'file.*',
          'users_favorite_files.createdAt AS "favoriteCreatedAt"',
        ])
        .getRawMany();
    } else {
      files = await this.fileRepository.find({
        where: {
          collection: { id: collectionId },
        },
      });
    }

    return Promise.all(
      files.map(async (raw) => {
        const file = this.fileRepository.create(raw);

        const url = await this.getFileUrl(
          this.buildKey(file.id, ownerId, collectionId, file.ext),
        );
        return file.toAPI(url, raw?.favoriteCreatedAt);
      }),
    );
  }

  public async listPublicFiles(ownerId: number, collectionId: number) {
    const collection = await this.collectionService.getCollection(
      ownerId,
      collectionId,
    );
    if (collection.private) {
      throw new ForbiddenException(ErrorCodes.COLLECTION_IS_PRIVATE);
    }

    const files = await this.fileRepository.find({
      where: {
        collectionId,
      },
    });

    return Promise.all(
      files.map(async (file) => {
        const url = await this.getFileUrl(
          this.buildKey(file.id, ownerId, collectionId, file.ext),
        );
        return file.toAPI(url);
      }),
    );
  }

  public async updateFile(userId: number, id: number, body: FileUpdateDto) {
    if (!Object.keys(body).length) {
      return;
    }

    const file = await this.fileRepository.findOne({
      where: { id, collection: { user: { id: userId } } },
      relations: ['collection'],
    });
    if (!file) {
      throw new BadRequestException(ErrorCodes.FILE_NOT_FOUND);
    }

    await this.fileRepository.update(id, body);
  }

  public async deleteFile(userId: number, id: number) {
    const file = await this.fileRepository.findOne({
      where: { id, collection: { user: { id: userId } } },
      relations: ['collection'],
    });
    if (!file) {
      throw new BadRequestException(ErrorCodes.FILE_NOT_FOUND);
    }

    if (
      file.collection.coverImageKey ===
      this.buildKey(file.id, userId, file.collection.id, file.ext)
    ) {
      await this.collectionService.updateCoverImage(file.collection.id, null);
    }

    await Promise.all([
      this.fileRepository.delete(id),
      this.s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: this.buildKey(file.id, userId, file.collection.id, file.ext),
        }),
      ),
    ]);
  }

  public async giphySearch(query: FileGiphySearchDto) {
    return axios
      .get('https://api.giphy.com/v1/gifs/search', {
        params: {
          api_key: process.env.GIPHY_API_KEY,
          ...query,
        },
      })
      .then((r) => ({
        data: r.data.data.map((gif) => ({
          id: gif.id,
          title: gif.title,
          url: gif.images.original.url,
        })),
        pagination: r.data.pagination,
      }));
  }

  public async checkLinks(body: FileCheckLinksDto) {
    return {
      links: await Promise.all(
        body.links.map((link) =>
          axios.get(link).then((r) => {
            const $ = load(r.data);

            return $('img')
              .filter((_, el) => el.attribs.src.toLowerCase().endsWith('.gif'))
              .map((_, el) => el.attribs.src)
              .get();
          }),
        ),
      ).then((r) => r.flat()),
    };
  }

  public async getFileUrl(
    key: string,
    contentDistribution: 'inline' | 'view' | 'download' = 'inline',
  ) {
    return getSignedUrl(
      this.s3,
      new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        ResponseContentDisposition: contentDistribution,
      }),
      { expiresIn: FILE_CONSTANTS.PRESIGN_GET_EXPIRES_IN },
    );
  }

  private async getPutUrl(key: string) {
    return createPresignedPost(this.s3, {
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: key,
      Expires: FILE_CONSTANTS.PRESIGN_PUT_EXPIRES_IN,
      Conditions: [
        ['content-length-range', 1, FILE_CONSTANTS.FILE_MAX_SIZE],
        ['starts-with', '$Content-Type', ''],
      ],
    });
  }

  private async batchCreate(
    userId: number,
    collection: Collection,
    filesData: { name: string; ext: string; mimeType: string; url: string }[],
  ) {
    const files = this.fileRepository.create(
      filesData.map((file) => ({
        name: file.name,
        ext: file.ext,
        mimeType: file.mimeType,
        collection: { id: collection.id },
      })),
    );
    await this.fileRepository.insert(files);

    if (!collection.coverImageKey) {
      await this.collectionService.updateCoverImage(
        collection.id,
        this.buildKey(files[0].id, userId, collection.id, files[0].ext),
      );
    }

    return Promise.all(
      files.map(async (file, index) => {
        const buffer: Buffer = await axios
          .get(filesData[index].url, { responseType: 'arraybuffer' })
          .then((r) => r.data);

        const key = this.buildKey(file.id, userId, collection.id, file.ext);
        const [url] = await Promise.all([
          this.getFileUrl(key),
          this.s3.send(
            new PutObjectCommand({
              Bucket: process.env.S3_BUCKET_NAME,
              Key: key,
              Body: buffer,
              ContentType: file.mimeType,
            }),
          ),
        ]);

        return file.toAPI(url);
      }),
    );
  }

  private getUserFilesCount(collectionId: number) {
    return this.fileRepository
      .createQueryBuilder('file')
      .leftJoinAndSelect('file.collection', 'collection')
      .where('collection.id = :collectionId', { collectionId })
      .getCount();
  }

  public buildKey(
    id: number,
    userId: number,
    collectionId: number,
    ext: string,
  ) {
    return `files/${userId}/${collectionId}/${id}.${ext}`;
  }
}
