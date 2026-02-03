import React from "react";

const Terms: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl sm:text-4xl font-black text-white mb-4">이용약관</h1>
      <p className="text-gray-300 leading-relaxed mb-6">
        MuzikPick 이용과 관련된 기본 약관입니다. 자세한 정책은 운영 과정에서 추가 고지될 수 있습니다.
      </p>
      <div className="bg-dark-card border border-white/10 rounded-2xl p-6 space-y-4 text-sm text-gray-400 leading-relaxed">
        <div>
          <h2 className="text-base font-bold text-white mb-1">서비스 이용</h2>
          <p>서비스는 현재 제공되는 형태로 제공되며, 기능은 개선될 수 있습니다.</p>
        </div>
        <div>
          <h2 className="text-base font-bold text-white mb-1">계정 및 보안</h2>
          <p>계정 정보 보호 책임은 이용자에게 있으며, 의심되는 활동은 즉시 알려주시기 바랍니다.</p>
        </div>
        <div>
          <h2 className="text-base font-bold text-white mb-1">콘텐츠 책임</h2>
          <p>사용자가 작성한 리뷰에 대한 책임은 작성자에게 있습니다.</p>
        </div>
        <div>
          <h2 className="text-base font-bold text-white mb-1">콘텐츠 이용 허락</h2>
          <p>이용자가 게시한 콘텐츠는 서비스 운영 목적 범위 내에서 노출/편집될 수 있습니다.</p>
        </div>
        <div>
          <h2 className="text-base font-bold text-white mb-1">정책 변경</h2>
          <p>약관은 변경될 수 있으며, 변경 시 서비스 내 공지합니다.</p>
        </div>
        <div>
          <h2 className="text-base font-bold text-white mb-1">계정 및 접근</h2>
          <p>부정 사용을 방지하기 위해 특정 기능 접근이 제한될 수 있습니다.</p>
        </div>
        <div>
          <h2 className="text-base font-bold text-white mb-1">저작권</h2>
          <p>사이트 내 데이터/콘텐츠의 무단 복제 및 재배포는 금지됩니다.</p>
        </div>
        <div>
          <h2 className="text-base font-bold text-white mb-1">금지 행위</h2>
          <p>불법 콘텐츠 게시, 자동화된 활동, 무효 트래픽 유도, 타인의 권리 침해 행위는 금지됩니다.</p>
        </div>
        <div>
          <h2 className="text-base font-bold text-white mb-1">서비스 중단</h2>
          <p>시스템 점검, 법령 준수, 보안 이슈 등의 사유로 서비스가 일시 중단될 수 있습니다.</p>
        </div>
      </div>
      <p className="text-gray-500 text-xs mt-4">최종 업데이트: 2026-02-03</p>
    </div>
  );
};

export default Terms;
