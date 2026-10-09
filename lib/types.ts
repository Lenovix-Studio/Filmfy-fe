// Homepage
export interface ApiMovie {
  id: string;
  code: string;
  title: string;
  coverPath: string | null;
  status?: string;
}
export interface Movie {
  id: string;
  code: string;
  title: string;
  posterUrl: string;
  rating?: number;
  status: string;
  isFavorite: boolean;
}

// Detail Movie Page
export interface MovieDetailBackend {
  id: string;
  code: string;
  title: string;
  originalTitle: string | null;
  overview: string | null;
  status?: string | null;
  releaseDate: string | null;
  runtimeMinutes: number | null;
  language: string | null;
  country: string | null;
  tmdbId: number | null;
  imdbId: string | null;
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
  studios: { id: string; name: string }[];
  series: { id: string; name: string }[];
  labels: { id: string; name: string }[];
  genres: { id: string; name: string }[];
  directors: { id: string; name: string }[];
  casts: { id: string; name: string }[];
  images: {
    id: string;
    movie_id: string;
    image_type: string;
    file_path: string;
  }[];
  files: {
    id: string;
    movie_id: string;
    file_path: string;
    resolution: string | null;
    video_codec: string | null;
    audio_codec: string | null;
    duration_seconds: number | null;
    file_size: number | null;
    checksum: string | null;
    created_at: string;
  }[];
}

// Setting Page
export type SettingsTabType = "common_code" | "system_logs" | "other";
export interface CodeType {
  id: string;
  code: string;
  name: string;
  description: string;
  count: number;
}
export interface CodeDetailType {
  id: string;
  type_code: string;
  code: string;
  label: string;
  order: number;
  is_active: boolean;
}
export type LogLevel = "INFO" | "WARN" | "ERROR";
export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  source: string;
  request?: any;
  response?: any;
}

// Upload Page
export interface FilmFormData {
  code: string;
  title: string;
  status: string;
  overview: string;
  director: string;
  studio: string;
  label: string;
  genres: string;
  cast: string;
  series: string;
  country: string;
  language: string;
  release_date: string;
  runtime_minutes: number;
}

// Favorites Page
export type SortOption = "LATEST" | "RATING_DESC" | "TITLE_ASC";
export interface FavoriteMovie {
  id: string;
  code: string;
  title: string;
  posterUrl: string;
  addedAt: string;
  isFavorite: boolean;
}

// Edit Page
export type GalleryItem = ExistingImage | PendingImage;
export interface ExistingImage {
  id: string;
  file_path: string;
  image_type: string;
}
export interface PendingImage {
  file: File;
  preview: string;
  isNew: true;
}

export interface CastDetailBackend {
  id: string;
  name: string;
  bio: string | null;
  profile_path: string | null;
  images: {
    id: string;
    file_path: string;
    image_type: string;
  }[];
  movies: any[];
}
