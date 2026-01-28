import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAlbumById } from '../services/albumService';
import { Album } from '../types';
import { MOCK_REVIEWS } from '../constants'; // 리뷰는 아직 Mock 유지
import ReviewItem from '../components/ReviewItem';
import { Play, Heart, Share2, PenTool, Star, Loader2 } from 'lucide-react';

const AlbumDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        setLoading(true);
        const data = await getAlbumById(id);
        setAlbum(data);
        setLoading(false);
      }
    };
    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!album) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-white mb-2">앨범을 찾을 수 없습니다</h2>
        <p className="text-gray-400 mb-6">요청하신 앨범 정보가 존재하지 않거나 삭제되었습니다.</p>
        <Link to="/" className="text-primary hover:underline">홈으로 돌아가기</Link>
      </div>
    );
  }

  // Calculate scores
  const userScoreColor = album.userScore >= 80 ? 'text-emerald-400' : album.userScore >= 60 ? 'text-yellow-400' : 'text-red-400';
  const criticScoreColor = album.criticScore >= 80 ? 'bg-emerald-500' : album.criticScore >= 60 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-6 lg:gap-10 mb-10">
        {/* Cover Art */}
        <div className="flex-shrink-0 w-full md:w-[250px] lg:w-[300px]">
          <div className="relative aspect-square rounded-xl overflow-hidden shadow-2xl border border-white/10">
            <img 
              src={album.coverUrl} 
              alt={album.title} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex gap-3 mt-4 justify-center">
            <button className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-indigo-500 text-white py-2.5 rounded-full font-bold transition-all transform hover:scale-105 shadow-lg shadow-primary/20 text-sm">
              <Play className="w-4 h-4 fill-current" />
              <span>재생</span>
            </button>
            <button className="p-2.5 rounded-full bg-dark-card border border-white/10 hover:bg-white/10 text-gray-300 transition-colors">
              <Heart className="w-5 h-5" />
            </button>
            <button className="p-2.5 rounded-full bg-dark-card border border-white/10 hover:bg-white/10 text-gray-300 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="flex-grow flex flex-col justify-end">
          <div className="mb-3">
             <div className="flex flex-wrap gap-2 mb-1">
               {album.genres.map((genre, idx) => (
                 <span key={idx} className="text-xs font-medium text-primary tracking-wider uppercase bg-primary/10 px-2 py-0.5 rounded">
                   {genre}
                 </span>
               ))}
             </div>
             <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-1 leading-tight">{album.title}</h1>
             <p className="text-lg md:text-xl text-gray-300 font-medium hover:text-white transition-colors cursor-pointer">{album.artist}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4">
            <div className="bg-dark-card/50 rounded-lg p-3 border border-white/5 backdrop-blur-sm">
               <span className="text-[10px] text-gray-500 uppercase tracking-wide block mb-1">Critic Score</span>
               <div className="flex items-center gap-2">
                 <div className={`w-2.5 h-2.5 rounded-full ${criticScoreColor}`}></div>
                 <span className="text-2xl font-bold text-white">{album.criticScore}</span>
               </div>
            </div>
            <div className="bg-dark-card/50 rounded-lg p-3 border border-white/5 backdrop-blur-sm">
               <span className="text-[10px] text-gray-500 uppercase tracking-wide block mb-1">User Score</span>
               <div className="flex items-center gap-2">
                 <span className={`text-2xl font-bold ${userScoreColor}`}>{album.userScore}</span>
               </div>
            </div>
             <div className="hidden sm:block bg-dark-card/50 rounded-lg p-3 border border-white/5 backdrop-blur-sm">
               <span className="text-[10px] text-gray-500 uppercase tracking-wide block mb-1">Release Date</span>
               <span className="text-base font-semibold text-gray-200 block mt-0.5">{album.releaseDate}</span>
            </div>
          </div>

          <div className="text-gray-300 leading-relaxed text-sm md:text-base mb-2">
            {album.description || "이 앨범에 대한 설명이 아직 등록되지 않았습니다."}
          </div>
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
                    {album.tracks && album.tracks.length > 0 ? (
                        <ul className="divide-y divide-white/5">
                            {album.tracks.map((track, idx) => (
                                <li key={idx} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors cursor-pointer group">
                                    <div className="flex items-center gap-4">
                                        <span className="text-gray-500 w-4 text-center text-sm">{idx + 1}</span>
                                        <span className="text-gray-200 font-medium group-hover:text-primary transition-colors text-sm line-clamp-1">{track}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-6 text-center text-gray-500 text-sm">트랙 정보가 없습니다.</div>
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
