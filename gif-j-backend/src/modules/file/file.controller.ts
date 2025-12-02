import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
  public async giphySearch(@Query() query: FileGiphySearchDto) {
    return this.fileService.giphySearch(query);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  public async updateFile(
    @UserParam('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: FileUpdateDto,
  ) {
    return this.fileService.updateFile(userId, id, body);
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
