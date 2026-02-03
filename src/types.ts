
export interface Album {
  id: string;
  title: string;
  artist: string;
  artistId?: string;
  type?: string; // e.g., '싱글', 'EP(미니)', '정규'
  releaseDate: string;
  coverUrl: string;
  genres: string[];
  criticScore: number;
  userScore: number;
  description?: string;
  tracks?: string[];
}

export interface Review {
  id: string;
  username: string;
  rating: number;
  content: string;
  date: string;
  albumId?: string;
  userId?: string;
  avatarUrl?: string;
}

export interface Artist {
  id: string;
  name: string;
}

export interface AlbumTrack {
  id: string;
  albumId: string;
  trackNo: number | null;
  title: string;
}

export interface Track {
  id: string;
  title: string;
  duration?: string | null;
  albumId?: string | null;
  artistId?: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
}

export enum SortOption {
  TRENDING = 'TRENDING',
  NEWEST = 'NEWEST',
  HIGHEST_RATED = 'HIGHEST_RATED'
}
