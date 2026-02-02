import { Album, Review, User } from './types';

export const ADMIN_USER: User = {
  id: 'admin',
  name: '관리자',
  email: 'admin@muzikpick.com',
  avatarUrl: 'https://picsum.photos/100/100?random=0'
};

export const MOCK_ALBUMS: Album[] = [
  {
    id: '1',
    title: 'Get Up',
    artist: 'NewJeans',
    releaseDate: '2023-07-21',
    coverUrl: 'https://picsum.photos/400/400?random=1',
    genres: ['K-Pop', 'R&B', 'UK Garage'],
    criticScore: 88,
    userScore: 92,
    description: "NewJeans의 두 번째 EP. UK Garage와 Jersey Club 리듬을 기반으로 한 트렌디한 사운드가 특징이다.",
    tracks: ['New Jeans', 'Super Shy', 'ETA', 'Cool With You', 'Get Up', 'ASAP']
  },
  {
    id: '2',
    title: 'SOS',
    artist: 'SZA',
    releaseDate: '2022-12-09',
    coverUrl: 'https://picsum.photos/400/400?random=2',
    genres: ['R&B', 'Pop', 'Soul'],
    criticScore: 94,
    userScore: 89,
    description: "SZA의 두 번째 스튜디오 앨범. 다양한 장르를 넘나드는 실험적인 시도와 솔직한 가사가 돋보인다."
  },
  {
    id: '3',
    title: 'I Feel',
    artist: '(G)I-DLE',
    releaseDate: '2023-05-15',
    coverUrl: 'https://picsum.photos/400/400?random=3',
    genres: ['K-Pop', 'Pop Rock', 'Rock'],
    criticScore: 78,
    userScore: 85,
    description: "자존감과 자신감을 주제로 한 (여자)아이들의 여섯 번째 미니 앨범."
  },
  {
    id: '4',
    title: 'Midnights',
    artist: 'Taylor Swift',
    releaseDate: '2022-10-21',
    coverUrl: 'https://picsum.photos/400/400?random=4',
    genres: ['Synth-pop', 'Dream Pop', 'Electronic'],
    criticScore: 85,
    userScore: 81
  },
  {
    id: '5',
    title: 'UNFORGIVEN',
    artist: 'LE SSERAFIM',
    releaseDate: '2023-05-01',
    coverUrl: 'https://picsum.photos/400/400?random=5',
    genres: ['K-Pop', 'Dance'],
    criticScore: 72,
    userScore: 79
  },
  {
    id: '6',
    title: 'Golden',
    artist: 'Jung Kook',
    releaseDate: '2023-11-03',
    coverUrl: 'https://picsum.photos/400/400?random=6',
    genres: ['Pop', 'R&B'],
    criticScore: 75,
    userScore: 96,
    description: "정국의 황금빛 순간들을 담아낸 첫 솔로 앨범."
  },
    {
    id: '7',
    title: 'UTOPIA',
    artist: 'Travis Scott',
    releaseDate: '2023-07-28',
    coverUrl: 'https://picsum.photos/400/400?random=7',
    genres: ['Hip Hop', 'Trap'],
    criticScore: 86,
    userScore: 90
  },
  {
    id: '8',
    title: 'GUTS',
    artist: 'Olivia Rodrigo',
    releaseDate: '2023-09-08',
    coverUrl: 'https://picsum.photos/400/400?random=8',
    genres: ['Pop Rock', 'Alternative Rock', 'Rock'],
    criticScore: 91,
    userScore: 88
  }
];

export const MOCK_REVIEWS: Review[] = [];
