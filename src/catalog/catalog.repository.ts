import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import type {
  MangaDetail,
  MangaDetailRow,
  MangaRow,
  VolumeRow,
} from '../common/interfaces';

@Injectable()
export class CatalogRepository {
  constructor(@Inject('PG_POOL') private readonly pool: Pool) {}

  async findAll(
    search: string | undefined,
    limit: number,
    offset: number,
  ): Promise<{ rows: MangaRow[]; total: number }> {
    const param = search ?? null;

    const [dataResult, countResult] = await Promise.all([
      this.pool.query<MangaRow>(
        `SELECT id, title, description, author_id, cover_url, created_at
         FROM manga
         WHERE ($1::text IS NULL OR title ILIKE '%' || $1 || '%')
         ORDER BY title
         LIMIT $2 OFFSET $3`,
        [param, limit, offset],
      ),
      this.pool.query<{ count: string }>(
        `SELECT COUNT(*) AS count
         FROM manga
         WHERE ($1::text IS NULL OR title ILIKE '%' || $1 || '%')`,
        [param],
      ),
    ]);

    return {
      rows: dataResult.rows,
      total: parseInt(countResult.rows[0].count, 10),
    };
  }

  async findById(id: number): Promise<MangaDetail | null> {
    const result = await this.pool.query<MangaDetailRow>(
      `SELECT
         m.id,
         m.title,
         m.description,
         m.cover_url,
         m.created_at,
         a.id   AS author_id,
         a.name AS author_name,
         COALESCE(
           array_agg(g.name ORDER BY g.name) FILTER (WHERE g.name IS NOT NULL),
           '{}'
         ) AS genres
       FROM manga m
       LEFT JOIN authors a ON a.id = m.author_id
       LEFT JOIN manga_genres mg ON mg.manga_id = m.id
       LEFT JOIN genres g ON g.id = mg.genre_id
       WHERE m.id = $1
       GROUP BY m.id, m.title, m.description, m.cover_url, m.created_at, a.id, a.name`,
      [id],
    );

    if (!result.rows[0]) return null;

    const row = result.rows[0];
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      cover_url: row.cover_url,
      created_at: row.created_at,
      author: { id: row.author_id, name: row.author_name },
      genres: row.genres,
    };
  }

  async findVolumesByMangaId(mangaId: number): Promise<VolumeRow[]> {
    const result = await this.pool.query<VolumeRow>(
      `SELECT id, manga_id, number, price, quantity, cover_url
       FROM volumes
       WHERE manga_id = $1
       ORDER BY number`,
      [mangaId],
    );
    return result.rows;
  }
}
