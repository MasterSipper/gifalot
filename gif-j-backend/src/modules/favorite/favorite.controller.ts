import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserParam } from '../auth/auth.decorators';
import { FavoriteFileListDto } from './dto/file-list';
import { FavoriteFileMostFavoritedDto } from './dto/file-most-favorited';
import { FavoriteService } from './favorite.service';

@Controller('favorite')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('file/:fileId')
  public async createFavoriteFile(
    @UserParam('id') userId: number,
    @Param('fileId', ParseIntPipe) fileId: number,
  ) {
    return this.favoriteService.createFavoriteFile(userId, fileId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('file')
  public async listFavoriteFiles(
    @UserParam('id') userId: number,
    @Query() query: FavoriteFileListDto,
  ) {
    return this.favoriteService.listFavoriteFiles(userId, query?.date);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('file/most-favorited')
  public async listMostFavoritedFiles(
    @UserParam('id') userId: number,
    @Query() query: FavoriteFileMostFavoritedDto,
  ) {
    return this.favoriteService.listMostFavoritedFiles(userId, query?.page);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('file/:fileId')
  public async deleteFavoriteFile(
    @UserParam('id') userId: number,
    @Param('fileId', ParseIntPipe) fileId: number,
  ) {
    return this.favoriteService.deleteFavoriteFile(userId, fileId);
  }
}
