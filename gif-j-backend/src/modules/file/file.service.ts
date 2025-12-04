import {
  CopyObjectCommand,
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
  NotFoundException,
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
    try {
      console.log('createFile called:', { userId, collectionId, filename: body.filename, mimeType: body.mimeType });
      
      const collection = await this.collectionService.getCollection(
        userId,
        collectionId,
      );

      if (!collection) {
        throw new NotFoundException(`Collection ${collectionId} not found`);
      }

      const count = await this.getUserFilesCount(collectionId);
      if (count > FILE_CONSTANTS.LIMIT_PER_COLLECTION) {
        throw new BadRequestException(ErrorCodes.FILES_LIMIT_REACHED);
      }

      const name = parse(body.filename).name;
      const ext = parse(body.filename).ext.slice(1);

      console.log('Creating file record:', { name, ext, mimeType: body.mimeType });

      const file = this.fileRepository.create({
        name,
        ext,
        mimeType: body.mimeType,
        collection: { id: collectionId },
      });
      await this.fileRepository.insert(file);

      console.log('File created in database with ID:', file.id);

      const key = this.buildKey(file.id, userId, collectionId, ext);
      if (!collection.coverImageKey) {
        await this.collectionService.updateCoverImage(collectionId, key);
      }

      try {
        console.log('Getting S3 URLs for key:', key);
        const [upload, url] = await Promise.all([
          this.getPutUrl(key).catch((error) => {
            console.error('Error getting put URL:', error);
            // Return mock for local development
            return {
              url: 'http://localhost:3001/gif-j/file/upload-mock',
              fields: { key: key },
            };
          }),
          this.getFileUrl(key).catch((error) => {
            console.error('Error getting file URL, using undefined:', error);
            return undefined;
          }),
        ]);

        console.log('S3 URLs obtained successfully');
        // Ensure url is string | undefined, not null
        const fileUrl: string | undefined = url ?? undefined;
        return { file: file.toAPI(fileUrl), upload };
      } catch (s3Error) {
        console.error('Error in S3 operations, returning file without S3 URL:', s3Error);
        // Return file with undefined URL if S3 operations fail
        return {
          file: file.toAPI(undefined),
          upload: {
            url: 'http://localhost:3001/gif-j/file/upload-mock',
            fields: { key: key },
          },
        };
      }
    } catch (error) {
      console.error('Error in createFile:', error);
      console.error('Error stack:', error.stack);
      // Re-throw to let NestJS handle it properly
      throw error;
    }
  }

  public async uploadFileToS3(
    userId: number,
    collectionId: number,
    file: Express.Multer.File | undefined,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    try {
      console.log('uploadFileToS3 called:', {
        userId,
        collectionId,
        filename: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
      });

      const collection = await this.collectionService.getCollection(
        userId,
        collectionId,
      );

      if (!collection) {
        throw new NotFoundException(`Collection ${collectionId} not found`);
      }

      const count = await this.getUserFilesCount(collectionId);
      if (count > FILE_CONSTANTS.LIMIT_PER_COLLECTION) {
        throw new BadRequestException(ErrorCodes.FILES_LIMIT_REACHED);
      }

      // Check file size
      if (file.size >= FILE_CONSTANTS.FILE_MAX_SIZE) {
        throw new BadRequestException('File size exceeds maximum limit');
      }

      // Parse filename and extension
      const parsedPath = parse(file.originalname);
      const name = parsedPath.name || 'untitled';
      let ext = parsedPath.ext.slice(1).toLowerCase() || '';
      
      // Handle cases where extension might not be in filename
      if (!ext && file.mimetype) {
        // Try to determine extension from MIME type
        const mimeToExt: Record<string, string> = {
          'video/mp4': 'mp4',
          'image/gif': 'gif',
          'image/jpeg': 'jpg',
          'image/png': 'png',
          'image/webp': 'webp',
        };
        ext = mimeToExt[file.mimetype] || 'bin';
      }

      // Validate MIME type
      if (!file.mimetype || (!file.mimetype.startsWith('image/') && !file.mimetype.startsWith('video/'))) {
        throw new BadRequestException(
          `Unsupported file type: ${file.mimetype || 'unknown'}. Only images and videos are allowed.`,
        );
      }

      console.log('Creating file record:', { name, ext, mimeType: file.mimetype, originalName: file.originalname });

      // Create file record in database
      const fileRecord = this.fileRepository.create({
        name,
        ext,
        mimeType: file.mimetype,
        collection: { id: collectionId },
      });
      await this.fileRepository.insert(fileRecord);

      console.log('File created in database with ID:', fileRecord.id);

      const key = this.buildKey(fileRecord.id, userId, collectionId, ext);
      
      // Update cover image if needed
      if (!collection.coverImageKey) {
        await this.collectionService.updateCoverImage(collectionId, key);
      }

      // Remove quotes from bucket name if present
      const bucketName = process.env.S3_BUCKET_NAME?.replace(/['"]/g, '') || '';

      try {
        console.log('Uploading file to S3:', { bucket: bucketName, key });

        // Upload file to Contabo S3
        await this.s3.send(
          new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
          }),
        );

        console.log('File uploaded to S3 successfully');

        // Get the file URL
        const url = await this.getFileUrl(key).catch((error) => {
          console.error('Error getting file URL:', error);
          return undefined;
        });

        console.log('File upload complete, returning file data');
        return { file: fileRecord.toAPI(url) };
      } catch (s3Error) {
        console.error('Error uploading to S3:', s3Error);
        // Delete file record if S3 upload fails
        await this.fileRepository.delete(fileRecord.id);
        throw new BadRequestException(
          `Failed to upload file to storage: ${s3Error.message}`,
        );
      }
    } catch (error) {
      console.error('Error in uploadFileToS3:', error);
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to upload file: ${error.message}`,
      );
    }
  }

  public async createFileGiphy(
    userId: number,
    collectionId: number,
    body: FileCreateGiphyDto,
  ) {
    try {
      console.log('createFileGiphy called:', { userId, collectionId, ids: body.ids });

      const collection = await this.collectionService.getCollection(
        userId,
        collectionId,
      );

      if (!collection) {
        throw new NotFoundException('Collection not found');
      }

      const count = await this.getUserFilesCount(collectionId);
      if (count > FILE_CONSTANTS.LIMIT_PER_COLLECTION) {
        throw new BadRequestException(ErrorCodes.FILES_LIMIT_REACHED);
      }

      if (count + body.ids.length > FILE_CONSTANTS.LIMIT_PER_COLLECTION) {
        throw new BadRequestException(ErrorCodes.TOO_MANY_FILES);
      }

      if (!process.env.GIPHY_API_KEY || process.env.GIPHY_API_KEY === 'your-giphy-api-key') {
        throw new BadRequestException('GIPHY_API_KEY is not configured');
      }

      // Validate and clean IDs
      const cleanedIds = body.ids
        .map((id) => String(id).trim())
        .filter((id) => id.length > 0 && id.length <= 32);

      if (cleanedIds.length === 0) {
        throw new BadRequestException('No valid GIF IDs provided');
      }

      if (cleanedIds.length !== body.ids.length) {
        console.warn('Some GIF IDs were filtered out:', {
          original: body.ids,
          cleaned: cleanedIds,
        });
      }

      console.log('Fetching GIFs from Giphy API...', {
        originalIds: body.ids,
        cleanedIds,
        idsString: cleanedIds.join(','),
      });

      const response = await axios.get<{
        data: { 
          id: string; 
          title: string; 
          images: { 
            original: { 
              url: string;
              width?: string | number;
              height?: string | number;
            } 
          } 
        }[];
        meta?: { status: number; msg?: string };
      }>(`https://api.giphy.com/v1/gifs`, {
        params: {
          ids: cleanedIds.join(','),
          api_key: process.env.GIPHY_API_KEY,
        },
      });

      console.log('Giphy API response:', {
        status: response.status,
        meta: response.data.meta,
        dataLength: response.data.data?.length,
      });

      // Check if Giphy API returned an error
      if (response.data.meta && response.data.meta.status !== 200) {
        console.error('Giphy API error:', response.data.meta);
        throw new BadRequestException(
          `Giphy API error: ${response.data.meta.msg || 'Invalid GIF IDs'}`,
        );
      }

      const gifs = response.data.data;

      if (!gifs || gifs.length === 0) {
        console.error('No GIFs found in response:', response.data);
        throw new BadRequestException('No GIFs found for the provided IDs');
      }

      // Validate that we got the same number of GIFs as requested
      if (gifs.length !== body.ids.length) {
        console.warn(
          `Warning: Requested ${body.ids.length} GIFs but got ${gifs.length}. IDs: ${body.ids.join(',')}`,
        );
      }

      console.log(`Found ${gifs.length} GIFs, creating files...`);
      const result = await this.batchCreate(
        userId,
        collection,
        gifs.map((gif) => {
          const originalImage = gif.images?.original || {};
          return {
            name: gif.title?.slice(0, 255).toLowerCase() || 'untitled',
            ext: 'gif',
            mimeType: 'image/gif',
            url: originalImage.url || '',
            width: originalImage.width ? parseInt(String(originalImage.width), 10) : null,
            height: originalImage.height ? parseInt(String(originalImage.height), 10) : null,
          };
        }),
      );

      console.log(`Successfully created ${result.length} files`);
      return result;
    } catch (e) {
      console.error('Error in createFileGiphy:', e);
      console.error('Error details:', {
        message: e.message,
        response: e.response?.data,
        status: e.response?.status,
        statusText: e.response?.statusText,
      });

      if (e instanceof BadRequestException || e instanceof NotFoundException) {
        throw e;
      }

      // Handle axios errors
      if (e.response) {
        const giphyError = e.response.data?.meta;
        if (giphyError && giphyError.status !== 200) {
          throw new BadRequestException(
            `Giphy API error: ${giphyError.msg || 'Invalid GIF IDs'}`,
          );
        }
        throw new BadRequestException(
          e.response.data?.message || e.response.data?.error || 'Failed to fetch GIFs from Giphy',
        );
      }

      // Handle network errors or other issues
      console.error('Giphy API request failed:', e.message);
      throw new BadRequestException(
        `Failed to fetch GIFs from Giphy: ${e.message}`,
      );
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
        mimeType: 'image/gif',
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

        try {
          const url = await this.getFileUrl(
            this.buildKey(file.id, ownerId, collectionId, file.ext),
            'inline',
            file.originalUrl || raw?.originalUrl,
          );
          return file.toAPI(url, raw?.favoriteCreatedAt);
        } catch (error) {
          console.error(`Error getting file URL for file ${file.id}, using original URL:`, error);
          // Fallback to original URL if S3 fails
          const fallbackUrl = file.originalUrl || raw?.originalUrl || null;
          return file.toAPI(fallbackUrl ?? undefined, raw?.favoriteCreatedAt);
        }
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

    try {
      await this.fileRepository.update(id, body);
    } catch (error) {
      console.error('Error updating file:', error);
      throw new BadRequestException(`Failed to update file: ${error.message}`);
    }
  }

  public async duplicateFile(userId: number, id: number) {
    const file = await this.fileRepository.findOne({
      where: { id, collection: { user: { id: userId } } },
      relations: ['collection'],
    });
    if (!file) {
      throw new BadRequestException(ErrorCodes.FILE_NOT_FOUND);
    }

    const collectionId = file.collection.id;
    const count = await this.getUserFilesCount(collectionId);
    if (count > FILE_CONSTANTS.LIMIT_PER_COLLECTION) {
      throw new BadRequestException(ErrorCodes.FILES_LIMIT_REACHED);
    }

    // Create new file record
    const newFile = this.fileRepository.create({
      name: file.name,
      ext: file.ext,
      mimeType: file.mimeType,
      timePerSlide: file.timePerSlide,
      transitionType: file.transitionType,
      rotation: file.rotation,
      template: file.template,
      originalUrl: file.originalUrl,
      collection: { id: collectionId },
    });
    await this.fileRepository.insert(newFile);

    // Copy file in S3 if it exists
    const sourceKey = this.buildKey(file.id, userId, collectionId, file.ext);
    const destKey = this.buildKey(newFile.id, userId, collectionId, file.ext);
    const bucketName = process.env.S3_BUCKET_NAME?.replace(/['"]/g, '') || '';
    
    try {
      // Only try to copy if S3 is configured
      if (bucketName && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_ACCESS_KEY_ID !== 'your-aws-access-key-id') {
        await this.s3.send(
          new CopyObjectCommand({
            Bucket: bucketName,
            CopySource: `${bucketName}/${sourceKey}`,
            Key: destKey,
          }),
        );

        const url = await this.getFileUrl(destKey);
        return newFile.toAPI(url);
      } else {
        // If S3 is not configured, use originalUrl if available
        console.log('S3 not configured, using originalUrl for duplicate');
        return newFile.toAPI(file.originalUrl || undefined);
      }
    } catch (error) {
      // If S3 copy fails, still return the file (it might use originalUrl)
      console.error('Error copying file in S3:', error);
      // Try to get URL for the new file, fallback to originalUrl
      try {
        const url = await this.getFileUrl(destKey);
        return newFile.toAPI(url);
      } catch {
        return newFile.toAPI(file.originalUrl || undefined);
      }
    }
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
    fallbackUrl?: string | null,
  ) {
    // For local development without S3, return fallback URL or placeholder
    if (process.env.STAGE === 'local' && (!process.env.AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID === 'your-aws-access-key-id')) {
      if (fallbackUrl) {
        return fallbackUrl;
      }
      throw new Error('S3 not configured and no fallback URL provided');
    }

    try {
      return await getSignedUrl(
        this.s3,
        new GetObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: key,
          ResponseContentDisposition: contentDistribution,
        }),
        { expiresIn: FILE_CONSTANTS.PRESIGN_GET_EXPIRES_IN },
      );
    } catch (error) {
      console.error('Error getting S3 file URL:', error);
      // Return fallback URL if S3 fails
      if (fallbackUrl) {
        return fallbackUrl;
      }
      throw error;
    }
  }

  private async getPutUrl(key: string) {
    // For local development without S3, return a mock presigned post
    if (process.env.STAGE === 'local' && (!process.env.AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID === 'your-aws-access-key-id')) {
      console.warn('S3 not configured, returning mock presigned post for local development');
      return {
        url: 'http://localhost:3001/gif-j/file/upload-mock',
        fields: {
          key: key,
        },
      };
    }

    try {
      // Remove quotes from bucket name if present
      const bucketName = process.env.S3_BUCKET_NAME?.replace(/['"]/g, '') || '';
      console.log('Creating presigned POST for:', {
        bucket: bucketName,
        key: key,
        endpoint: process.env.S3_ENDPOINT,
        hasCredentials: !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY),
      });

      const presignedPost = await createPresignedPost(this.s3, {
        Bucket: bucketName,
        Key: key,
        Expires: FILE_CONSTANTS.PRESIGN_PUT_EXPIRES_IN,
        Conditions: [
          ['content-length-range', 1, FILE_CONSTANTS.FILE_MAX_SIZE],
          ['starts-with', '$Content-Type', ''],
        ],
      });

      console.log('Presigned POST created:', {
        url: presignedPost.url,
        fieldsCount: Object.keys(presignedPost.fields).length,
      });

      return presignedPost;
    } catch (error) {
      console.error('Error creating S3 presigned post:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        bucket: process.env.S3_BUCKET_NAME,
        endpoint: process.env.S3_ENDPOINT,
      });
      // Return mock for local development if S3 fails
      if (process.env.STAGE === 'local') {
        return {
          url: 'http://localhost:3001/gif-j/file/upload-mock',
          fields: {
            key: key,
          },
        };
      }
      throw error;
    }
  }

  private async batchCreate(
    userId: number,
    collection: Collection,
    filesData: { name: string; ext: string; mimeType: string; url: string; width?: number | null; height?: number | null }[],
  ) {
    const files = this.fileRepository.create(
      filesData.map((file) => ({
        name: file.name,
        ext: file.ext,
        mimeType: file.mimeType,
        originalUrl: file.url, // Store original URL for fallback
        width: file.width ?? null,
        height: file.height ?? null,
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
        try {
          const buffer: Buffer = await axios
            .get(filesData[index].url, { responseType: 'arraybuffer' })
            .then((r) => r.data);

          const key = this.buildKey(file.id, userId, collection.id, file.ext);
          
          // For local development without S3, return the original URL
          if (process.env.STAGE === 'local' && (!process.env.AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID === 'your-aws-access-key-id')) {
            console.warn('S3 not configured, using original URL for local development');
            return file.toAPI(filesData[index].url);
          }

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
        } catch (error) {
          console.error(`Error processing file ${file.id}:`, error);
          // Return file with original URL if S3 upload fails
          return file.toAPI(filesData[index].url);
        }
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

  public async getFirstFileInCollection(collectionId: number) {
    return this.fileRepository.findOne({
      where: { collectionId },
      order: { id: 'ASC' },
    });
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
