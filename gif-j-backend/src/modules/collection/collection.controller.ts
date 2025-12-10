import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserParam } from '../auth/auth.decorators';
import { OptionalJwtAccessAuthGuard } from '../auth/auth.guard';
import { CollectionService } from './collection.service';
import { CollectionCreateDto } from './dto/create';
import { CollectionListDto } from './dto/list';
import { CollectionListPublicDto } from './dto/list-public';
import { CollectionUpdateDto } from './dto/update';

@Controller('collection')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  public async createCollection(
    @UserParam('id') userId: number,
    @Body() body: CollectionCreateDto,
  ) {
    return this.collectionService.createCollection(userId, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  public async listCollection(
    @UserParam('id') userId: number,
    @Query() query: CollectionListDto,
  ) {
    return this.collectionService.listCollection(userId, query?.lastId);
  }

  @UseGuards(OptionalJwtAccessAuthGuard)
  @Get('public')
  public async listPublicCollection(@Query() query: CollectionListPublicDto) {
    return this.collectionService.listPublicCollection(query?.date);
  }

  // IMPORTANT: More specific route must come before less specific route
  // Otherwise /collection/3/19 will match :id route first (treating 3 as id)
  @UseGuards(OptionalJwtAccessAuthGuard)
  @Get(':ownerId/:id')
  public async getPublicCollection(
    @UserParam('id') userId: number | null,
    @Param('ownerId', ParseIntPipe) ownerId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.collectionService.getPublicCollection(userId, ownerId, id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  public async getCollection(
    @UserParam('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const collection = await this.collectionService.getCollection(userId, id);
    return collection.toAPI();
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  public async updateCollection(
    @UserParam('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CollectionUpdateDto,
  ) {
    return this.collectionService.updateCollection(userId, id, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  public async deleteCollection(
    @UserParam('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.collectionService.deleteCollection(userId, id);
  }
}
