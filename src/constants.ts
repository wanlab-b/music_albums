import { Album, Review, User } from './types';

export const ADMIN_USER: User = {
  id: 'admin',
  name: '관리자',
  email: 'admin@muzikpick.com',
  avatarUrl: 'https://picsum.photos/100/100?random=0'
};

export const MOCK_ALBUMS: Album[] = [
  {
    id: '7',
    title: 'UTOPIA',
    artist: 'Travis Scott',
    releaseDate: '2023-07-28',
    coverUrl: 'https://picsum.photos/400/400?random=7',
    genres: ['힙합', '랩'],
    criticScore: 86,
    userScore: 90
  }
];

export const MOCK_REVIEWS: Review[] = [];
