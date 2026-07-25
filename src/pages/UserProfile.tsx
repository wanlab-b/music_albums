import React, { useMemo, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import AlbumCard from '../components/AlbumCard';
import ReviewItem from '../components/ReviewItem';
import { Star, MessageSquare, Loader2 } from 'lucide-react';
import { getReviewsByUserId } from '@/services/reviewService';
import { getAllAlbums } from '@/services/albumService';
import { Album, Review } from '@/types';
import { trackProfileTab } from '@/analytics';

const UserProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'albums' | 'reviews'>('albums');

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      setLoading(true);
      const [reviewData, albumData] = await Promise.all([
        getReviewsByUserId(userId),
        getAllAlbums()
      ]);
      setReviews(reviewData);
      setAlbums(albumData);
      setLoading(false);
    };
    fetchData();
  }, [userId]);

  const userName = reviews[0]?.username ?? 'User';
  const userAvatar = reviews[0]?.avatarUrl ?? `https://picsum.photos/seed/${encodeURIComponent(userId ?? 'user')}/200/200`;
  const userEmail = userId ?? '';

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

  const handleTabChange = (tabName: 'albums' | 'reviews') => {
    if (tabName === activeTab) return;

    setActiveTab(tabName);
    trackProfileTab({
      tabName,
      profileScope: 'public',
      component: 'UserProfile'
    });
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-white mb-4">User not found</h2>
        <Link to="/community" className="px-6 py-3 bg-primary text-white rounded-full font-bold hover:bg-indigo-500 transition-colors">
          Back to Community
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Profile Header */}
      <div className="relative h-60 bg-gradient-to-r from-gray-900 via-purple-950 to-gray-900">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="max-w-7xl mx-auto px-4 h-full flex items-end pb-8 relative z-10">
          <div className="flex flex-col md:flex-row items-end md:items-end gap-6 w-full">
            {/* Avatar */}
            <img 
              src={userAvatar} 
              alt={userName} 
              className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-dark-bg object-cover shadow-2xl"
            />
            
            {/* User Info */}
            <div className="flex-1 mb-2">
              <h1 className="text-3xl font-black text-white mb-1">{userName}</h1>
              <p className="text-gray-400 text-sm mb-4">{userEmail}</p>
              
              {/* Stats */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                   <span className="text-white font-bold text-lg">{reviews.length}</span>
                   <span className="text-gray-500 text-sm uppercase tracking-wider font-medium">Reviews</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="border-b border-white/10 bg-dark-bg sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-8">
            <button 
              onClick={() => handleTabChange('albums')}
              className={`py-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'albums' ? 'border-primary text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
            >
              <Star className="w-4 h-4" />
              Life Albums ({lifeAlbums.length})
            </button>
            <button 
               onClick={() => handleTabChange('reviews')}
               className={`py-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'reviews' ? 'border-primary text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
            >
              <MessageSquare className="w-4 h-4" />
              Reviews ({reviews.length})
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'albums' ? (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">{userName}'s High Rated Albums</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {lifeAlbums.map(album => (
                <AlbumCard key={album.id} album={album} />
            ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
             <h2 className="text-xl font-bold text-white">{userName}'s Reviews</h2>
             <div className="grid grid-cols-1 gap-4">
                {reviews.map(review => (
                    <ReviewItem key={review.id} review={{...review, username: userName, avatarUrl: userAvatar}} />
                ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
