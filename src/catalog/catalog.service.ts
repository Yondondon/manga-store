import { Injectable, NotFoundException } from '@nestjs/common';
import { CatalogRepository } from './catalog.repository';
import { GetMangaQueryDto } from './dto/get-manga-query.dto';
import type {
  MangaDetail,
  MangaRow,
  PaginatedResult,
  VolumeRow,
} from '../common/interfaces';

@Injectable()
export class CatalogService {
  constructor(private readonly catalogRepository: CatalogRepository) {}

  async findAll(query: GetMangaQueryDto): Promise<PaginatedResult<MangaRow>> {
    const { search, page, limit } = query;
    const offset = (page - 1) * limit;
    const { rows, total } = await this.catalogRepository.findAll(
      search,
      limit,
      offset,
    );
    return { data: rows, meta: { total, page, limit } };
  }

  async findById(id: number): Promise<MangaDetail> {
    const manga = await this.catalogRepository.findById(id);
    if (!manga) throw new NotFoundException(`Manga #${id} not found`);
    return manga;
  }

  async findVolumesByMangaId(mangaId: number): Promise<VolumeRow[]> {
    const manga = await this.catalogRepository.findById(mangaId);
    if (!manga) throw new NotFoundException(`Manga #${mangaId} not found`);
    return this.catalogRepository.findVolumesByMangaId(mangaId);
  }
}
