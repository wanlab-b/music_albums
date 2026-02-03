import React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl sm:text-4xl font-black text-white mb-4">개인정보처리방침</h1>
      <p className="text-gray-300 leading-relaxed mb-6">
        MuzikPick은 서비스 제공을 위해 최소한의 개인정보만을 수집하며, 법령에 따라 안전하게 관리합니다.
      </p>
      <div className="bg-dark-card border border-white/10 rounded-2xl p-6 space-y-4 text-sm text-gray-400 leading-relaxed">
        <div>
          <h2 className="text-base font-bold text-white mb-1">수집 항목</h2>
          <p>이메일, 닉네임, 프로필 이미지(선택) 등</p>
        </div>
        <div>
          <h2 className="text-base font-bold text-white mb-1">이용 목적</h2>
          <p>계정 관리, 리뷰 작성, 서비스 개선 및 고객 문의 대응</p>
        </div>
        <div>
          <h2 className="text-base font-bold text-white mb-1">보관 기간</h2>
          <p>회원 탈퇴 시 즉시 파기, 관련 법령이 정한 경우 해당 기간 동안 보관</p>
        </div>
        <div>
          <h2 className="text-base font-bold text-white mb-1">제3자 제공</h2>
          <p>법령에 근거한 경우를 제외하고 개인정보를 외부에 제공하지 않습니다.</p>
        </div>
        <div>
          <h2 className="text-base font-bold text-white mb-1">이용자 권리</h2>
          <p>이용자는 개인정보 열람/정정/삭제를 요청할 수 있으며, 문의 채널을 통해 접수 가능합니다.</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
