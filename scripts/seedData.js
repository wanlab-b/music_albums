import { initializeApp, cert } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// JSON 파일 읽기
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

// Firebase Admin 초기화
initializeApp({
  credential: cert(serviceAccount),
  databaseURL: "https://music-album-3ad4f-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const db = getDatabase();

// ------------------------------------------------------------------
// [설정 2] 크롤링 데이터 로드 (bugsData.json)
// ------------------------------------------------------------------
const bugsDataPath = path.join(__dirname, 'bugsData.json');
let crawledAlbums = [];

if (fs.existsSync(bugsDataPath)) {
  try {
    crawledAlbums = JSON.parse(fs.readFileSync(bugsDataPath, 'utf8'));
    console.log(`📂 bugsData.json 로드 성공: ${crawledAlbums.length}개의 앨범 발견`);
  } catch (e) {
    console.error("❌ bugsData.json 파싱 실패:", e);
  }
} else {
  console.warn("⚠️ bugsData.json 파일이 없습니다. 크롤링을 먼저 실행하세요 (node scripts/crawlBugs.js).");
}

// ------------------------------------------------------------------
// [설정 3] MOCK 리뷰 데이터 (기존 유지)
// ------------------------------------------------------------------
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

    const albumsRef = db.ref("albums");
    const albumsData = {};

    // 크롤링 데이터 변환 및 추가
    // UI 표시를 위해 임의의 점수(score)를 부여합니다. (크롤링 시 제외했으므로)
    crawledAlbums.forEach(album => {
      albumsData[album.id] = {
        ...album,
        // 70~98 사이의 랜덤 점수 부여
        criticScore: Math.floor(Math.random() * (98 - 70 + 1)) + 70,
        userScore: Math.floor(Math.random() * (99 - 75 + 1)) + 75,
        // 설명이 비어있다면 기본 문구 추가
        description: album.description || `아티스트 ${album.artist}의 앨범 [${album.title}]입니다. ${album.genres.join(', ')} 장르의 매력을 느껴보세요.`
      };
    });

    if (Object.keys(albumsData).length > 0) {
      await albumsRef.set(albumsData);
      console.log(`✅ 앨범 데이터 ${Object.keys(albumsData).length}개 업로드 완료`);
    } else {
      console.log("⚠️ 업로드할 앨범 데이터가 없습니다.");
    }

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
