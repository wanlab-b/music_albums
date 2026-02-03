import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { applyBaseSeo } from "@/seo";

const DEFAULT_TITLE = "MuzikPick - 음악을 기록하다";
const DEFAULT_DESCRIPTION =
  "MuzikPick은 앨범을 평가하고 리뷰를 나누며 새로운 음악을 발견하는 음악 기록 플랫폼입니다.";

const SeoUpdater = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    const baseConfig = {
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      image: "/og-image.svg",
      imageAlt: "MuzikPick - 음악을 기록하다"
    };

    const routeConfig = (() => {
      if (path === "/") {
        return {
          title: "MuzikPick - 음악을 기록하다",
          description: "앨범을 평가하고 리뷰를 나누며 새로운 음악을 발견하세요."
        };
      }
      if (path === "/best-albums") {
        return {
          title: "베스트 앨범 차트 | MuzikPick",
          description: "평점과 리뷰 기반으로 선정된 베스트 앨범 차트를 확인하세요."
        };
      }
      if (path === "/discover") {
        return {
          title: "탐색 | MuzikPick",
          description: "장르, 분위기, 추천 기준으로 새로운 앨범을 탐색하세요."
        };
      }
      if (path === "/new-releases") {
        return {
          title: "최신 발매 | MuzikPick",
          description: "최근 발매된 앨범과 주요 신작을 빠르게 확인하세요."
        };
      }
      if (path === "/genres") {
        return {
          title: "장르별 앨범 | MuzikPick",
          description: "발라드부터 힙합까지, 장르별 명반을 한눈에 살펴보세요."
        };
      }
      if (path === "/community") {
        return {
          title: "커뮤니티 | MuzikPick",
          description: "유저 리뷰와 토론을 통해 더 깊은 음악 이야기를 만나보세요."
        };
      }
      if (path.startsWith("/community/")) {
        return {
          title: "장르 커뮤니티 | MuzikPick",
          description: "장르별 리뷰와 추천 콘텐츠를 모아보세요."
        };
      }
      if (path === "/search") {
        return {
          title: "검색 | MuzikPick",
          description: "아티스트, 앨범, 트랙을 검색해 빠르게 찾아보세요.",
          noIndex: true
        };
      }
      if (path === "/login") {
        return {
          title: "로그인 | MuzikPick",
          description: "MuzikPick에 로그인하고 나만의 음악 기록을 시작하세요.",
          noIndex: true
        };
      }
      if (path === "/signup") {
        return {
          title: "회원가입 | MuzikPick",
          description: "회원가입 후 리뷰 작성과 추천 기능을 이용하세요.",
          noIndex: true
        };
      }
      if (path === "/mypage") {
        return {
          title: "마이페이지 | MuzikPick",
          description: "나의 리뷰, 평점, 활동 내역을 확인하세요.",
          noIndex: true
        };
      }
      if (path === "/about") {
        return {
          title: "소개 | MuzikPick",
          description: "MuzikPick의 목표와 콘텐츠 기준을 확인하세요."
        };
      }
      if (path === "/contact") {
        return {
          title: "문의하기 | MuzikPick",
          description: "제휴, 광고, 제안, 버그 제보 등 문의를 남겨주세요."
        };
      }
      if (path === "/privacy") {
        return {
          title: "개인정보처리방침 | MuzikPick",
          description: "개인정보 수집 및 이용에 관한 정책을 확인하세요."
        };
      }
      if (path === "/terms") {
        return {
          title: "이용약관 | MuzikPick",
          description: "서비스 이용 약관과 정책을 확인하세요."
        };
      }
      if (path.startsWith("/album/")) {
        return {
          title: "앨범 상세 | MuzikPick",
          description: "앨범 정보, 트랙리스트, 리뷰를 확인하세요."
        };
      }
      if (path.startsWith("/artist/")) {
        return {
          title: "아티스트 상세 | MuzikPick",
          description: "아티스트의 앨범과 트랙 정보를 확인하세요."
        };
      }
      return {};
    })();

    applyBaseSeo({
      ...baseConfig,
      ...routeConfig
    });
  }, [location.pathname, location.search, location.hash]);

  return null;
};

export default SeoUpdater;
