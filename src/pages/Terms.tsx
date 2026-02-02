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
          <h2 className="text-base font-bold text-white mb-1">콘텐츠 책임</h2>
          <p>사용자가 작성한 리뷰에 대한 책임은 작성자에게 있습니다.</p>
        </div>
        <div>
          <h2 className="text-base font-bold text-white mb-1">정책 변경</h2>
          <p>약관은 변경될 수 있으며, 변경 시 서비스 내 공지합니다.</p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
