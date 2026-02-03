import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AlbumCard from '../components/AlbumCard';
import ReviewItem from '../components/ReviewItem';
import { Settings, Star, MessageSquare, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getReviewsByUserId } from '@/services/reviewService';
import { getAllAlbums } from '@/services/albumService';
import { Album, Review } from '@/types';

const MyPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'albums' | 'reviews'>('albums');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);
      const [reviewData, albumData] = await Promise.all([
        getReviewsByUserId(user.id),
        getAllAlbums()
      ]);
      setReviews(reviewData);
      setAlbums(albumData);
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const albumMap = useMemo(() => {
    const map = new Map<string, Album>();
    albums.forEach((album) => map.set(album.id, album));
    return map;
  }, [albums]);

  const lifeAlbums = useMemo(() => {
    const ids = new Set(
      reviews.filter((review) => review.rating >= 80 && review.albumId).map((review) => review.albumId!)
    );
    return [...ids].map((id) => albumMap.get(id)).filter(Boolean) as Album[];
  }, [reviews, albumMap]);

  const myReviews = reviews;

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-white mb-4">로그인이 필요합니다</h2>
        <Link to="/login" className="px-6 py-3 bg-primary text-white rounded-full font-bold hover:bg-indigo-500 transition-colors">
          로그인 페이지로 이동
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Profile Header */}
      <div className="relative h-60 bg-gradient-to-r from-gray-900 via-indigo-950 to-gray-900">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="max-w-7xl mx-auto px-4 h-full flex items-end pb-8 relative z-10">
          <div className="flex flex-col md:flex-row items-end md:items-end gap-6 w-full">
            {/* Avatar */}
            <div className="relative group">
                <img 
                  src={user.avatarUrl} 
                  alt={user.name} 
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-dark-bg object-cover shadow-2xl"
                />
                <button disabled className="absolute bottom-2 right-2 p-2 bg-dark-card rounded-full text-gray-500 border border-white/10 cursor-not-allowed shadow-lg">
                    <Settings className="w-4 h-4" />
                </button>
            </div>
            
            {/* User Info */}
            <div className="flex-1 mb-2">
              <h1 className="text-3xl font-black text-white mb-1">{user.name}</h1>
              <p className="text-gray-400 text-sm mb-4">{user.email}</p>
              
              {/* Stats */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                   <span className="text-white font-bold text-lg">{myReviews.length}</span>
                   <span className="text-gray-500 text-sm uppercase tracking-wider font-medium">Reviews</span>
                </div>
              </div>
            </div>

            {/* Edit Profile Button */}
            <div className="mb-4">
               <button disabled className="px-4 py-2 bg-white/10 border border-white/10 rounded-lg text-gray-400 text-sm font-medium cursor-not-allowed">
                 프로필 편집
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="border-b border-white/10 bg-dark-bg sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-8">
            <button 
              onClick={() => setActiveTab('albums')}
              className={`py-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'albums' ? 'border-primary text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
            >
              <Star className="w-4 h-4" />
              내 인생 앨범 ({lifeAlbums.length})
            </button>
            <button 
               onClick={() => setActiveTab('reviews')}
               className={`py-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'reviews' ? 'border-primary text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
            >
              <MessageSquare className="w-4 h-4" />
              나의 리뷰 ({myReviews.length})
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'albums' ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">High Rated Albums (80+)</h2>
                <span className="text-sm text-gray-500">내가 80점 이상 준 앨범들입니다.</span>
            </div>
            {lifeAlbums.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {lifeAlbums.map(album => (
                    <AlbumCard key={album.id} album={album} />
                ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-dark-card rounded-2xl border border-white/5">
                    <p className="text-gray-400 mb-4">아직 평가한 앨범이 없습니다.</p>
                    <Link to="/discover" className="text-primary hover:underline">앨범 평가하러 가기</Link>
                </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
             <h2 className="text-xl font-bold text-white">Review History</h2>
             <div className="grid grid-cols-1 gap-4">
                {myReviews.map(review => (
                    <ReviewItem key={review.id} review={{...review, username: user.name, avatarUrl: user.avatarUrl}} />
                ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPage;
