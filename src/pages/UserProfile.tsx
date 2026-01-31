import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_ALBUMS, MOCK_REVIEWS } from '../constants';
import AlbumCard from '../components/AlbumCard';
import ReviewItem from '../components/ReviewItem';
import { Star, MessageSquare } from 'lucide-react';

// Mock function to get user data by ID
const getUserById = (id: string) => {
  const mockUsers = [
    { id: '1', name: 'IndieLover', avatarUrl: 'https://picsum.photos/100/100?random=20', email: 'indie@lover.com', reviews: 142, followers: 890, following: 120 },
    { id: '2', name: 'KpopMaster', avatarUrl: 'https://picsum.photos/100/100?random=21', email: 'kpop@master.com', reviews: 98, followers: 1200, following: 250 },
    { id: '3', name: 'JazzCat', avatarUrl: 'https://picsum.photos/100/100?random=22', email: 'jazz@cat.com', reviews: 340, followers: 450, following: 80 },
    { id: '4', name: 'NewWave', avatarUrl: 'https://picsum.photos/100/100?random=23', email: 'new@wave.com', reviews: 67, followers: 230, following: 50 },
    { id: '5', name: 'RockFan', avatarUrl: 'https://picsum.photos/100/100?random=24', email: 'rock@fan.com', reviews: 210, followers: 600, following: 180 },
    { id: '6', name: 'HipHopHead', avatarUrl: 'https://picsum.photos/100/100?random=25', email: 'hiphop@head.com', reviews: 180, followers: 500, following: 150 },
  ];
  return mockUsers.find(user => user.id === id);
};


const UserProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'albums' | 'reviews'>('albums');
  const [isFollowing, setIsFollowing] = useState<boolean>(false); // New state for follow button

  useEffect(() => {
    if (userId) {
      const userData = getUserById(userId);
      setUser(userData);
      // Mock: check if currently following (e.g., from local storage or context)
      // For now, let's randomly set it or keep it false
      setIsFollowing(Math.random() > 0.5); // Example: randomly set for demonstration
    }
  }, [userId]);

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
    // In a real application, you would make an API call here
    console.log(isFollowing ? `Unfollowing ${user.name}` : `Following ${user.name}`);
  };

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-white mb-4">User not found</h2>
        <Link to="/community" className="px-6 py-3 bg-primary text-white rounded-full font-bold hover:bg-indigo-500 transition-colors">
          Back to Community
        </Link>
      </div>
    );
  }
  
  const lifeAlbums = MOCK_ALBUMS.filter(album => album.userScore >= 80);
  const myReviews = MOCK_REVIEWS;

  return (
    <div className="min-h-screen pb-20">
      {/* Profile Header */}
      <div className="relative h-60 bg-gradient-to-r from-gray-900 via-purple-950 to-gray-900">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="max-w-7xl mx-auto px-4 h-full flex items-end pb-8 relative z-10">
          <div className="flex flex-col md:flex-row items-end md:items-end gap-6 w-full">
            {/* Avatar */}
            <img 
              src={user.avatarUrl} 
              alt={user.name} 
              className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-dark-bg object-cover shadow-2xl"
            />
            
            {/* User Info */}
            <div className="flex-1 mb-2">
              <h1 className="text-3xl font-black text-white mb-1">{user.name}</h1>
              <p className="text-gray-400 text-sm mb-4">{user.email}</p>
              
              {/* Stats */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                   <span className="text-white font-bold text-lg">{user.reviews}</span>
                   <span className="text-gray-500 text-sm uppercase tracking-wider font-medium">Reviews</span>
                </div>
                <div className="flex items-center gap-2">
                   <span className="text-white font-bold text-lg">{user.followers}</span>
                   <span className="text-gray-500 text-sm uppercase tracking-wider font-medium">Followers</span>
                </div>
                <div className="flex items-center gap-2">
                   <span className="text-white font-bold text-lg">{user.following}</span>
                   <span className="text-gray-500 text-sm uppercase tracking-wider font-medium">Following</span>
                </div>
              </div>
            </div>

            {/* Follow Button */}
            <div className="mb-4">
               <button 
                 onClick={handleFollowToggle}
                 className={`px-4 py-2 rounded-lg text-white text-sm font-bold transition-colors 
                           ${isFollowing ? 'bg-gray-600 hover:bg-gray-700' : 'bg-primary hover:bg-indigo-500'}`}
               >
                 {isFollowing ? 'Following' : 'Follow'}
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
              Life Albums ({lifeAlbums.length})
            </button>
            <button 
               onClick={() => setActiveTab('reviews')}
               className={`py-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'reviews' ? 'border-primary text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
            >
              <MessageSquare className="w-4 h-4" />
              Reviews ({myReviews.length})
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'albums' ? (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">{user.name}'s High Rated Albums</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {lifeAlbums.map(album => (
                <AlbumCard key={album.id} album={album} />
            ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
             <h2 className="text-xl font-bold text-white">{user.name}'s Reviews</h2>
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

export default UserProfile;

