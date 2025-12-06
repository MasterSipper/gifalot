import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { UserParam } from '../auth/auth.decorators';
import { OptionalJwtAccessAuthGuard } from '../auth/auth.guard';
import { FileCheckLinksDto } from './dto/check-links';
import { FileCreateDto } from './dto/create';
import { FileCreateFromLinksDto } from './dto/create-from-links';
import { FileCreateGiphyDto } from './dto/create-giphy';
import { FileGiphySearchDto } from './dto/giphy-search';
import { FileUpdateDto } from './dto/update';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post(':collectionId')
  public async createFile(
    @UserParam('id') userId: number,
    @Param('collectionId', ParseIntPipe) collectionId: number,
    @Body() body: FileCreateDto,
  ) {
    return this.fileService.createFile(userId, collectionId, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':collectionId/upload')
  @UseInterceptors(FileInterceptor('file', {
    limits: {
      fileSize: 20 * 1024 * 1024, // 20MB limit
    },
  }))
  public async uploadFile(
    @UserParam('id') userId: number,
    @Param('collectionId', ParseIntPipe) collectionId: number,
    @UploadedFile() file: Express.Multer.File | undefined,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return this.fileService.uploadFileToS3(userId, collectionId, file);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':collectionId/giphy')
  public async createFileGiphy(
    @UserParam('id') userId: number,
    @Param('collectionId', ParseIntPipe) collectionId: number,
    @Body() body: FileCreateGiphyDto,
  ) {
    return this.fileService.createFileGiphy(userId, collectionId, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':collectionId/links')
  public async createFilesLinks(
    @UserParam('id') userId: number,
    @Param('collectionId', ParseIntPipe) collectionId: number,
    @Body() body: FileCreateFromLinksDto,
  ) {
    return this.fileService.createFilesLinks(userId, collectionId, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('links/check')
  public async checkLinks(@Body() body: FileCheckLinksDto) {
    return this.fileService.checkLinks(body);
  }

  @UseGuards(OptionalJwtAccessAuthGuard)
  @Get(':ownerId/:collectionId')
  public async listFiles(
    @UserParam('id') userId: number | null,
    @Param('ownerId', ParseIntPipe) ownerId: number,
    @Param('collectionId', ParseIntPipe) collectionId: number,
  ) {
    return this.fileService.listFiles(userId, ownerId, collectionId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('giphy-search')
  public async giphySearch(@Query() query: any) {
    // Handle ratings array parameter - can come as comma-separated string, array, or multiple query params
    let ratings: string[] | undefined;
    if (query.ratings) {
      if (typeof query.ratings === 'string') {
        // Could be comma-separated or single value
        ratings = query.ratings.split(',').map((r: string) => r.trim()).filter((r: string) => r.length > 0);
      } else if (Array.isArray(query.ratings)) {
        // Already an array (axios might send as array)
        ratings = query.ratings.map((r: string) => String(r).trim()).filter((r: string) => r.length > 0);
      }
    }
    
    // Validate and convert to DTO
    const dto: FileGiphySearchDto = {
      q: query.q,
      offset: Number(query.offset),
      limit: Number(query.limit),
      ...(ratings && ratings.length > 0 ? { ratings } : {}),
    };
    
    return this.fileService.giphySearch(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  public async updateFile(
    @UserParam('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: FileUpdateDto,
  ) {
    console.log('Update file request:', { userId, id, body });
    return this.fileService.updateFile(userId, id, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/duplicate')
  public async duplicateFile(
    @UserParam('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    console.log('Duplicate file request:', { userId, id });
    return this.fileService.duplicateFile(userId, id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  public async deleteFile(
    @UserParam('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.fileService.deleteFile(userId, id);
  }
}
