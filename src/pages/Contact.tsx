import React from "react";

const Contact: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl sm:text-4xl font-black text-white mb-4">문의하기</h1>
      <p className="text-gray-300 leading-relaxed mb-6">
        제휴, 광고, 제안, 버그 제보 등 모든 문의는 아래 이메일로 연락주세요.
      </p>
      <div className="bg-dark-card border border-white/10 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-2">Contact</h2>
        <p className="text-gray-400 text-sm">Email: support@muzikpick.com</p>
      </div>
    </div>
  );
};

export default Contact;
