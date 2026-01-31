import { Album, Review, User } from './types';

export const ADMIN_USER: User = {
  id: 'admin',
  name: '관리자',
  email: 'admin@muzikpick.com',
  avatarUrl: 'https://picsum.photos/100/100?random=0'
};

// TEST_DUMMY_ALBUM: delete this export when removing test data.
export const TEST_DUMMY_ALBUM: Album = {
  id: 'TEST_DUMMY_001',
  title: '[TEST] Dummy Album',
  artist: 'Test Artist',
  releaseDate: '2026-01-29',
  coverUrl: 'https://picsum.photos/400/400?random=999',
  genres: ['Test'],
  criticScore: 99,
  userScore: 99,
  description: '[TEST] Dummy album for UI testing.',
  tracks: ['[TEST] Track 01', '[TEST] Track 02']
};

export const MOCK_ALBUMS: Album[] = [
  TEST_DUMMY_ALBUM,
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

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1',
    username: 'MusicLover99',
    rating: 90,
    content: '올해 최고의 앨범 중 하나입니다. 프로덕션이 미쳤어요.',
    date: '2023-11-15',
    avatarUrl: 'https://picsum.photos/100/100?random=10'
  },
  {
    id: 'r2',
    username: 'CriticWannabe',
    rating: 75,
    content: '좋긴 하지만 전작에 비해서는 약간 아쉽네요. 그래도 추천합니다.',
    date: '2023-11-14',
    avatarUrl: 'https://picsum.photos/100/100?random=11'
  },
  {
    id: 'r3',
    username: 'KpopStan_kr',
    rating: 100,
    content: '완벽 그 자체. 수록곡 하나하나가 다 타이틀감입니다.',
    date: '2023-11-10',
    avatarUrl: 'https://picsum.photos/100/100?random=12'
  }
];
