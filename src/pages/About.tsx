import React from "react";

const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl sm:text-4xl font-black text-white mb-4">MuzikPick 소개</h1>
      <p className="text-gray-300 leading-relaxed mb-6">
        MuzikPick은 앨범을 평가하고 리뷰를 나누며 새로운 음악을 발견하는 음악 기록 플랫폼입니다.
        음악 팬들이 각자의 취향을 공유하고, 더 좋은 음악을 찾을 수 있도록 돕는 것을 목표로 합니다.
      </p>
      <p className="text-gray-400 leading-relaxed mb-6">
        우리는 데이터 기반 추천과 커뮤니티 리뷰를 함께 제공해, 단순한 차트 사이트가 아닌
        ‘취향 기록 공간’으로 성장하고자 합니다. 사용자는 앨범에 점수를 남기고,
        자신의 음악 여정을 아카이빙할 수 있습니다.
      </p>
      <p className="text-gray-400 leading-relaxed mb-6">
        MuzikPick은 자동 생성/복붙 콘텐츠를 허용하지 않으며, 실제 경험과 맥락을 담은 리뷰를
        우선적으로 노출합니다. 방문자가 충분히 읽고 이해할 수 있는 길이와 깊이를 가진 콘텐츠가
        우리 플랫폼의 핵심 기준입니다.
      </p>
      <div className="bg-dark-card border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-2">우리가 하는 일</h2>
        <ul className="text-gray-400 space-y-2 text-sm leading-relaxed">
          <li>앨범/아티스트 정보를 정리하고 쉽게 탐색할 수 있도록 제공</li>
          <li>유저 리뷰와 평점을 기반으로 인기 앨범을 발견</li>
          <li>커뮤니티 중심의 음악 추천과 토론 문화 조성</li>
        </ul>
      </div>
      <div className="mt-6 bg-dark-card border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-2">콘텐츠 기준</h2>
        <p className="text-gray-400 text-sm leading-relaxed">
          모든 리뷰는 실제 이용자의 경험을 바탕으로 작성되며, 스팸/복붙/저품질 콘텐츠는 제한합니다.
          신뢰할 수 있는 정보 제공을 위해 지속적으로 콘텐츠 품질을 관리합니다.
        </p>
      </div>
      <div className="mt-6 bg-dark-card border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-2">에디토리얼 정책</h2>
        <ul className="text-gray-400 space-y-2 text-sm leading-relaxed">
          <li>리뷰는 충분한 길이와 구체적인 근거를 포함해야 합니다.</li>
          <li>불법/유해/저작권 침해 콘텐츠는 즉시 제거될 수 있습니다.</li>
          <li>중복 게시, 자동화된 댓글/리뷰, 무효 트래픽 유도는 금지됩니다.</li>
        </ul>
      </div>
      <div className="mt-6 bg-dark-card border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-2">운영 정보</h2>
        <p className="text-gray-400 text-sm leading-relaxed">
          MuzikPick은 꾸준한 업데이트를 통해 사이트를 실제 운영 중인 상태로 유지합니다.
          서비스와 정책 변경 사항은 공지 또는 관련 페이지를 통해 안내됩니다.
        </p>
        <p className="text-gray-500 text-xs mt-3">최종 업데이트: 2026-02-03</p>
      </div>
    </div>
  );
};

export default About;
