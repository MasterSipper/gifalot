import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRoot() {
    return {
      message: 'Gifalot API is running',
      version: '1.0.0',
      endpoints: {
        auth: '/gif-j/auth',
        collections: '/gif-j/collection',
        files: '/gif-j/file',
        favorites: '/gif-j/favorite',
      },
    };
  }
}







