import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { GetMangaQueryDto } from './dto/get-manga-query.dto';

@Controller('manga')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get()
  findAll(@Query() query: GetMangaQueryDto) {
    return this.catalogService.findAll(query);
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.catalogService.findById(id);
  }

  @Get(':id/volumes')
  findVolumes(@Param('id', ParseIntPipe) id: number) {
    return this.catalogService.findVolumesByMangaId(id);
  }
}
