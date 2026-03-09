import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CatalogService } from './catalog.service';
import { GetMangaQueryDto } from './dto/get-manga-query.dto';

@ApiTags('catalog')
@Controller('manga')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get()
  @ApiOperation({
    summary: 'List all manga with optional search and pagination',
  })
  @ApiResponse({ status: 200, description: 'Paginated list of manga' })
  findAll(@Query() query: GetMangaQueryDto) {
    return this.catalogService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a manga by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Manga details' })
  @ApiResponse({ status: 404, description: 'Manga not found' })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.catalogService.findById(id);
  }

  @Get(':id/volumes')
  @ApiOperation({ summary: 'Get all volumes for a manga' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'List of volumes for the manga' })
  @ApiResponse({ status: 404, description: 'Manga not found' })
  findVolumes(@Param('id', ParseIntPipe) id: number) {
    return this.catalogService.findVolumesByMangaId(id);
  }
}
