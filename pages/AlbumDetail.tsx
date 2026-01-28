import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_ALBUMS, MOCK_REVIEWS } from '../constants';
import ReviewItem from '../components/ReviewItem';
import AiSummary from '../components/AiSummary';
import { Play, Heart, Share2, MoreHorizontal, PenTool, Star } from 'lucide-react';

const AlbumDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const album = MOCK_ALBUMS.find(a => a.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!album) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-white mb-2">앨범을 찾을 수 없습니다</h2>
        <p className="text-gray-400 mb-6">요청하신 앨범 정보가 존재하지 않습니다.</p>
        <Link to="/" className="text-primary hover:underline">홈으로 돌아가기</Link>
      </div>
    );
  }

  // Calculate scores (mock logic)
  const userScoreColor = album.userScore >= 80 ? 'text-emerald-400' : album.userScore >= 60 ? 'text-yellow-400' : 'text-red-400';
  const criticScoreColor = album.criticScore >= 80 ? 'bg-emerald-500' : album.criticScore >= 60 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-8 lg:gap-12 mb-12">
        {/* Cover Art */}
        <div className="flex-shrink-0 w-full md:w-[350px] lg:w-[400px]">
          <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            <img 
              src={album.coverUrl} 
              alt={album.title} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex gap-4 mt-6 justify-center">
            <button className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-indigo-500 text-white py-3 rounded-full font-bold transition-all transform hover:scale-105 shadow-lg shadow-primary/20">
              <Play className="w-5 h-5 fill-current" />
              <span>재생</span>
            </button>
            <button className="p-3 rounded-full bg-dark-card border border-white/10 hover:bg-white/10 text-gray-300 transition-colors">
              <Heart className="w-6 h-6" />
            </button>
            <button className="p-3 rounded-full bg-dark-card border border-white/10 hover:bg-white/10 text-gray-300 transition-colors">
              <Share2 className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="flex-grow flex flex-col justify-end">
          <div className="mb-4">
             <span className="text-sm font-medium text-primary tracking-wider uppercase mb-2 block">{album.genres.join(' • ')}</span>
             <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-2 leading-tight">{album.title}</h1>
             <p className="text-xl md:text-2xl text-gray-300 font-medium hover:text-white transition-colors cursor-pointer">{album.artist}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 my-6">
            <div className="bg-dark-card/50 rounded-xl p-4 border border-white/5 backdrop-blur-sm">
               <span className="text-xs text-gray-500 uppercase tracking-wide block mb-1">Critic Score</span>
               <div className="flex items-center gap-3">
                 <div className={`w-3 h-3 rounded-full ${criticScoreColor}`}></div>
                 <span className="text-3xl font-bold text-white">{album.criticScore}</span>
               </div>
            </div>
            <div className="bg-dark-card/50 rounded-xl p-4 border border-white/5 backdrop-blur-sm">
               <span className="text-xs text-gray-500 uppercase tracking-wide block mb-1">User Score</span>
               <div className="flex items-center gap-3">
                 <span className={`text-3xl font-bold ${userScoreColor}`}>{album.userScore}</span>
               </div>
            </div>
             <div className="hidden sm:block bg-dark-card/50 rounded-xl p-4 border border-white/5 backdrop-blur-sm">
               <span className="text-xs text-gray-500 uppercase tracking-wide block mb-1">Release Date</span>
               <span className="text-lg font-semibold text-gray-200 block mt-1">{album.releaseDate}</span>
            </div>
          </div>

          <div className="text-gray-300 leading-relaxed text-base md:text-lg mb-6">
            {album.description || "이 앨범에 대한 설명이 아직 등록되지 않았습니다."}
          </div>

          {/* Gemini AI Summary Integration */}
          <AiSummary artist={album.artist} album={album.title} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Tracklist & Details */}
        <div className="lg:col-span-1 space-y-8">
            <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    트랙리스트
                </h3>
                <div className="bg-dark-card rounded-xl border border-white/5 overflow-hidden">
                    {album.tracks ? (
                        <ul className="divide-y divide-white/5">
                            {album.tracks.map((track, idx) => (
                                <li key={idx} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors cursor-pointer group">
                                    <div className="flex items-center gap-4">
                                        <span className="text-gray-500 w-4 text-center text-sm">{idx + 1}</span>
                                        <span className="text-gray-200 font-medium group-hover:text-primary transition-colors">{track}</span>
                                    </div>
                                    <span className="text-xs text-gray-600">3:24</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-6 text-center text-gray-500 text-sm">트랙 정보 준비 중</div>
                    )}
                </div>
            </div>
            
            <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-white/5">
                <h3 className="text-lg font-bold text-white mb-2">당신의 평가는?</h3>
                <p className="text-sm text-gray-400 mb-4">로그인하고 나만의 평점과 리뷰를 남겨보세요.</p>
                <div className="flex justify-center mb-4 gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-8 h-8 text-gray-600 hover:text-yellow-400 cursor-pointer transition-colors" />
                    ))}
                </div>
                <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-medium transition-colors">
                    <PenTool className="w-4 h-4" />
                    리뷰 작성하기
                </button>
            </div>
        </div>

        {/* Reviews */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
             <h3 className="text-2xl font-bold text-white">유저 리뷰 <span className="text-gray-500 text-lg font-normal ml-1">({MOCK_REVIEWS.length})</span></h3>
             
             <div className="flex gap-2">
                <select className="bg-dark-card border border-white/10 text-sm text-gray-300 rounded-lg px-3 py-1.5 outline-none focus:border-primary">
                    <option>최신순</option>
                    <option>인기순</option>
                    <option>높은 평점순</option>
                </select>
             </div>
          </div>
          
          <div className="space-y-4">
            {MOCK_REVIEWS.map((review) => (
              <ReviewItem key={review.id} review={review} />
            ))}
          </div>
          
          <button className="w-full mt-8 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all text-sm font-medium">
            리뷰 더 보기
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlbumDetail;