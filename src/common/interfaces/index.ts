export interface JwtPayload {
  sub: number;
  email: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface UserRow {
  id: number;
  email: string;
  password: string;
  name: string;
  created_at: Date;
}

export interface UserPublic {
  id: number;
  email: string;
  name: string;
  created_at: Date;
}

export interface MangaDetailRow {
  id: number;
  title: string;
  description: string;
  cover_url: string;
  created_at: Date;
  author_id: number;
  author_name: string;
  genres: string[];
}

export interface MangaRow {
  id: number;
  title: string;
  description: string;
  author_id: number;
  cover_url: string;
  created_at: Date;
}

export interface MangaDetail {
  id: number;
  title: string;
  description: string;
  cover_url: string;
  created_at: Date;
  author: { id: number; name: string };
  genres: string[];
}

export interface VolumeRow {
  id: number;
  manga_id: number;
  number: number;
  price: string;
  quantity: number;
  cover_url: string;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: { total: number; page: number; limit: number };
}

export interface CartItemRow {
  id: number;
  cart_id: number;
  volume_id: number;
  quantity: number;
}

export interface CartItem {
  id: number;
  volume_id: number;
  quantity: number;
  volume_number: number;
  price: string;
  cover_url: string;
  manga_id: number;
  manga_title: string;
}

export interface CartResponse {
  id: number | null;
  items: CartItem[];
}
