const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

// ------------------------------------------------------------------
// [설정 1] 서비스 계정 키 파일 경로 설정
// Firebase 콘솔 -> 프로젝트 설정 -> 서비스 계정 -> 새 비공개 키 생성
// 다운로드 받은 파일을 'serviceAccountKey.json'으로 이름 변경 후 scripts 폴더에 넣으세요.
// ------------------------------------------------------------------
const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");

if (!fs.existsSync(serviceAccountPath)) {
  console.error("❌ 오류: 'serviceAccountKey.json' 파일을 찾을 수 없습니다.");
  console.error("   scripts 폴더에 Firebase Admin SDK 비공개 키를 넣어주세요.");
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

// Firebase Admin 초기화
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://music-album-3ad4f-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const db = admin.database();

// ------------------------------------------------------------------
// [설정 2] 업로드할 데이터 (constants.ts의 데이터를 여기에 복사함)
// ------------------------------------------------------------------
const MOCK_ALBUMS = [
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
    genres: ['K-Pop', 'Pop Rock'],
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
    genres: ['Synth-pop', 'Dream Pop'],
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
    genres: ['Pop Rock', 'Alternative Rock'],
    criticScore: 91,
    userScore: 88
  }
];

const MOCK_REVIEWS = [
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

async function seedDatabase() {
  try {
    console.log("🚀 데이터 업로드 시작...");

    // 1. Albums 업로드
    const albumsRef = db.ref("albums");
    // 기존 데이터가 있다면 덮어쓰거나, 안전하게 하기 위해 set 사용
    // 배열 형태보다는 ID를 키로 가지는 객체 형태가 Realtime DB에 더 적합함
    const albumsData = {};
    MOCK_ALBUMS.forEach(album => {
      albumsData[album.id] = album;
    });
    await albumsRef.set(albumsData);
    console.log(`✅ 앨범 데이터 ${MOCK_ALBUMS.length}개 업로드 완료`);

    // 2. Reviews 업로드
    const reviewsRef = db.ref("reviews");
    const reviewsData = {};
    MOCK_REVIEWS.forEach(review => {
      reviewsData[review.id] = review;
    });
    await reviewsRef.set(reviewsData);
    console.log(`✅ 리뷰 데이터 ${MOCK_REVIEWS.length}개 업로드 완료`);

    console.log("🎉 모든 데이터 연동(Seeding)이 완료되었습니다.");
    process.exit(0);
  } catch (error) {
    console.error("❌ 데이터 업로드 중 오류 발생:", error);
    process.exit(1);
  }
}

seedDatabase();