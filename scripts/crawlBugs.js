import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- 설정 ---
const START_DATE = new Date(); // 오늘
const DAYS_TO_CRAWL = 2; // 오늘 포함 며칠 전까지 수집할지 (테스트용으로 작게 설정)
const REQUEST_DELAY_MS = 1500; // 차단 방지용 딜레이 (1.5초)

// 딜레이 함수
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 날짜 포맷팅 (YYYYMMDD)
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
};

// 1. 차트 페이지에서 앨범 ID 수집
async function getAlbumIdsFromChart(dateStr) {
  const url = `https://music.bugs.co.kr/chart/track/day/total?chartdate=${dateStr}`;
  console.log(`📡 차트 요청 중: ${url}`);
  
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const albumIds = new Set();

    // 벅스 차트 리스트에서 앨범 링크 추출
    $('.list > tbody > tr').each((i, el) => {
      // 앨범 썸네일이나 제목에 걸린 링크에서 ID 추출
      // href="https://music.bugs.co.kr/album/20621651?wl_ref=list_tr_07_chart"
      const albumHref = $(el).find('a.thumbnail').attr('href');
      if (albumHref) {
        const match = albumHref.match(/album\/(\d+)/);
        if (match) {
          albumIds.add(match[1]);
        }
      }
    });

    return Array.from(albumIds);
  } catch (error) {
    console.error(`❌ 차트 수집 실패 (${dateStr}):`, error.message);
    return [];
  }
}

// 2. 앨범 상세 페이지 크롤링
async function getAlbumDetail(albumId) {
  const url = `https://music.bugs.co.kr/album/${albumId}`;
  
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // 기본 정보 (Title)
    // 1순위: DOM 구조에서 추출
    let title = $('header.pgTitle > h1').text().trim();
    
    // 2순위: og:title 메타 태그에서 추출 (DOM 변경시 안전장치)
    if (!title) {
      title = $('meta[property="og:title"]').attr('content')?.trim();
    }
    
    // 3순위: title 태그에서 추출 후 정제
    if (!title) {
      const pageTitle = $('title').text();
      title = pageTitle.split(' : ')[0]; // "Album Title : 벅스" 형식 제거
    }

    // 테이블 정보 파싱
    let artist = '';
    let type = '';
    let genres = [];
    let releaseDate = '';

    $('table.info > tbody > tr').each((i, el) => {
      const header = $(el).find('th').text().trim();
      const value = $(el).find('td');

      if (header === '아티스트') {
        artist = value.find('a').first().text().trim();
        // 아티스트 링크가 없는 경우 텍스트만 가져옴
        if (!artist) artist = value.text().trim();
      } else if (header === '유형') {
        type = value.text().trim();
      } else if (header === '장르') {
        value.find('a').each((_, a) => genres.push($(a).text().trim()));
      } else if (header === '발매일') {
        releaseDate = value.text().trim();
      }
    });

    // 커버 이미지
    const coverUrl = $('.photos src').attr('src') || $('.photos img').attr('src');

    // 트랙리스트 파싱
    const tracks = [];
    $('table.trackList > tbody > tr').each((i, el) => {
      // 19금이나 타이틀 곡 뱃지 텍스트 제거하고 순수 제목만 추출
      const trackTitle = $(el).find('p.title a').text().trim();
      if (trackTitle) {
        tracks.push(trackTitle);
      }
    });

    // 요청사항: description, criticScore, userScore 제거됨

    return {
      id: albumId,
      title,
      artist,
      type, 
      genres, 
      releaseDate, 
      coverUrl,
      tracks
    };

  } catch (error) {
    console.error(`❌ 앨범 상세 수집 실패 (ID: ${albumId}):`, error.message);
    return null;
  }
}

// 메인 실행 함수
async function main() {
  const crawledAlbums = new Map(); // 중복 제거를 위한 Map
  
  // 1. 날짜별 차트 순회
  for (let i = 0; i < DAYS_TO_CRAWL; i++) {
    const targetDate = new Date(START_DATE);
    targetDate.setDate(START_DATE.getDate() - i);
    const dateStr = formatDate(targetDate);

    console.log(`\n📅 [${dateStr}] 차트 분석 시작...`);
    const albumIds = await getAlbumIdsFromChart(dateStr);
    
    console.log(`   found ${albumIds.length} albums.`);

    // 2. 앨범 ID별 상세 크롤링
    for (const id of albumIds) {
      if (crawledAlbums.has(id)) {
        continue; // 이미 수집함
      }

      console.log(`   🔍 앨범 상세 정보 수집 중... (ID: ${id})`);
      const albumData = await getAlbumDetail(id);
      
      if (albumData) {
        // 타이틀이 없는 경우 로그 출력 (디버깅용)
        if (!albumData.title) {
            console.warn(`   ⚠️ 경고: 타이틀을 찾을 수 없습니다. (ID: ${id})`);
        }
        crawledAlbums.set(id, albumData);
      }

      // 차단 방지 딜레이
      await sleep(REQUEST_DELAY_MS);
    }
  }

  // 3. 파일 저장
  const resultData = Array.from(crawledAlbums.values());
  const outputPath = path.join(__dirname, 'bugsData.json');
  
  fs.writeFileSync(outputPath, JSON.stringify(resultData, null, 2), 'utf8');
  
  console.log(`\n✅ 크롤링 완료! 총 ${resultData.length}개의 앨범 정보를 수집했습니다.`);
  console.log(`📂 저장 위치: ${outputPath}`);
  console.log(`ℹ️ 이 데이터를 사용하려면 seedData.js에서 import하여 사용하세요.`);
}

main();
