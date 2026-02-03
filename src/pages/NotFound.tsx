import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-dark-card border border-white/10 rounded-2xl p-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">페이지를 찾을 수 없습니다</h1>
        <p className="text-gray-400 leading-relaxed mb-6">
          요청하신 페이지가 삭제되었거나 주소가 변경되었을 수 있습니다.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center px-6 py-2 rounded-full bg-white text-black font-bold hover:bg-gray-200 transition-colors"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
