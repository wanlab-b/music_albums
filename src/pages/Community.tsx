import React from 'react';
import { Users, MessageSquare, Star, Trophy, UserPlus, Heart, TrendingUp } from 'lucide-react';

const Community: React.FC = () => {
  // Mock Data for Top Users
  const topUsers = [
    { id: 1, name: 'IndieLover', avatar: 'https://picsum.photos/100/100?random=20', reviews: 142, followers: 890, level: 'Expert' },
    { id: 2, name: 'KpopMaster', avatar: 'https://picsum.photos/100/100?random=21', reviews: 98, followers: 1200, level: 'Pro' },
    { id: 3, name: 'JazzCat', avatar: 'https://picsum.photos/100/100?random=22', reviews: 340, followers: 450, level: 'Critic' },
    { id: 4, name: 'NewWave', avatar: 'https://picsum.photos/100/100?random=23', reviews: 67, followers: 230, level: 'Rookie' },
  ];

  // Mock Data for Feed
  const activities = [
    { id: 1, user: 'IndieLover', userAvatar: 'https://picsum.photos/100/100?random=20', action: 'reviewed', target: 'NewJeans - Get Up', rating: 90, time: '2 mins ago', content: '올해 최고의 EP 중 하나. 사운드가 정말 세련되었습니다.' },
    { id: 2, user: 'JazzCat', userAvatar: 'https://picsum.photos/100/100?random=22', action: 'commented on', target: 'John Coltrane - Blue Train', time: '15 mins ago', content: '이 앨범은 정말 전설적입니다. 재즈 입문자에게 강력 추천합니다.' },
    { id: 3, user: 'MusicBot', userAvatar: 'https://picsum.photos/100/100?random=25', action: 'rated', target: 'Taylor Swift - Midnights', rating: 85, time: '1 hour ago', content: null },
    { id: 4, user: 'KpopMaster', userAvatar: 'https://picsum.photos/100/100?random=21', action: 'liked', target: 'Review by CriticWannabe', time: '2 hours ago', content: null },
  ];

  // Mock Data for Today's Top Liked Comments
  const topComments = [
    { id: 1, user: 'VinylDreamer', avatar: 'https://picsum.photos/100/100?random=31', target: 'Radiohead - In Rainbows', content: '어둠 속에서 빛나는 온도감. 들을 때마다 새로워요.', likes: 142 },
    { id: 2, user: 'SynthWave', avatar: 'https://picsum.photos/100/100?random=32', target: 'Daft Punk - Discovery', content: '디스코와 미래가 만난 순간. 완벽한 트랙 리스트.', likes: 118 },
    { id: 3, user: 'LoFiPlanet', avatar: 'https://picsum.photos/100/100?random=33', target: 'Nujabes - Modal Soul', content: '이 앨범만큼 마음을 정리해주는 음악이 또 있을까요?', likes: 97 },
    { id: 4, user: 'AltCity', avatar: 'https://picsum.photos/100/100?random=34', target: 'Phoenix - Wolfgang Amadeus Phoenix', content: '기분을 리셋하고 싶을 때 무조건 이 앨범.', likes: 83 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            MuzikPick Community
          </h1>
          <p className="text-gray-400 mt-2 max-w-xl">
            음악을 사랑하는 전 세계의 팬들과 소통하세요.<br/>
            리뷰를 나누고, 새로운 친구를 팔로우하고, 음악적 취향을 공유하세요.
          </p>
        </div>
        
        <div className="flex gap-4">
            <div className="bg-dark-card border border-white/10 px-6 py-3 rounded-xl text-center">
                <span className="block text-2xl font-bold text-white">12.5k</span>
                <span className="text-xs text-gray-500 uppercase font-medium">Members</span>
            </div>
            <div className="bg-dark-card border border-white/10 px-6 py-3 rounded-xl text-center">
                <span className="block text-2xl font-bold text-primary">480</span>
                <span className="text-xs text-gray-500 uppercase font-medium">Online</span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Main Content: Activity Feed */}
        <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
                 <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    실시간 활동 (Live Feed)
                 </h2>
                 <button className="text-sm text-gray-400 hover:text-white transition-colors">새로고침</button>
            </div>

            <div className="space-y-4">
                {activities.map((activity) => (
                    <div key={activity.id} className="bg-dark-card border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors">
                        <div className="flex items-start gap-4">
                            <img src={activity.userAvatar} alt={activity.user} className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10" />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <span className="font-bold text-white hover:text-primary cursor-pointer transition-colors">{activity.user}</span>
                                    <span className="text-gray-500 text-sm">{activity.action}</span>
                                    <span className="font-medium text-gray-300 truncate">{activity.target}</span>
                                </div>
                                
                                {activity.rating && (
                                    <div className="inline-flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded text-xs font-bold text-emerald-400 mb-2">
                                        <Star className="w-3 h-3 fill-emerald-400" />
                                        {activity.rating}
                                    </div>
                                )}

                                {activity.content && (
                                    <p className="text-gray-300 text-sm leading-relaxed bg-black/20 p-3 rounded-lg border border-white/5">
                                        "{activity.content}"
                                    </p>
                                )}
                                
                                <div className="flex items-center justify-between mt-3">
                                    <span className="text-xs text-gray-600">{activity.time}</span>
                                    <div className="flex gap-4">
                                        <button className="text-gray-500 hover:text-red-400 transition-colors">
                                            <Heart className="w-4 h-4" />
                                        </button>
                                        <button className="text-gray-500 hover:text-white transition-colors">
                                            <MessageSquare className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <button className="w-full py-4 bg-white/5 border border-white/5 rounded-xl text-gray-400 text-sm font-medium hover:bg-white/10 hover:text-white transition-colors">
                Load More Activities
            </button>
        </div>

        {/* Sidebar: Top Reviewers & Trends */}
        <div className="space-y-10">
            
            {/* Top Reviewers */}
            <div className="bg-dark-card rounded-2xl p-6 border border-white/5">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                        이달의 리뷰어
                    </h3>
                    <a href="#" className="text-xs text-gray-500 hover:text-white">전체보기</a>
                </div>
                
                <div className="space-y-4">
                    {topUsers.map((user, index) => (
                        <div key={user.id} className="flex items-center gap-4 group">
                            <div className="relative">
                                <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-white/5 group-hover:ring-primary/50 transition-all" />
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-dark-card rounded-full flex items-center justify-center text-[10px] font-bold text-white border border-white/10">
                                    {index + 1}
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold text-white truncate group-hover:text-primary transition-colors">{user.name}</h4>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <span>{user.reviews} Reviews</span>
                                    <span>•</span>
                                    <span className="text-indigo-400">{user.level}</span>
                                </div>
                            </div>
                            <button className="p-2 rounded-full bg-white/5 text-gray-400 hover:bg-primary hover:text-white transition-colors">
                                <UserPlus className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Top Liked Comments Today */}
            <div className="bg-dark-card rounded-2xl p-6 border border-white/5">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Heart className="w-5 h-5 text-rose-400" />
                        오늘 인기 댓글 순위
                    </h3>
                    <span className="text-xs text-gray-500">TODAY</span>
                </div>

                <div className="space-y-4">
                    {topComments.map((comment, index) => (
                        <div key={comment.id} className="flex items-start gap-3">
                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/5 text-xs font-bold text-white">
                                {index + 1}
                            </div>
                            <img src={comment.avatar} alt={comment.user} className="w-9 h-9 rounded-full object-cover ring-2 ring-white/5" />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-bold text-white truncate">{comment.user}</span>
                                    <span className="text-[10px] text-gray-500 truncate">on {comment.target}</span>
                                </div>
                                <p className="text-xs text-gray-300 leading-relaxed line-clamp-2">
                                    “{comment.content}”
                                </p>
                                <div className="mt-2 inline-flex items-center gap-1 text-[10px] text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded-full">
                                    <Heart className="w-3 h-3 fill-rose-400" />
                                    {comment.likes.toLocaleString()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Popular Tags */}
            <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 rounded-2xl p-6 border border-white/5">
                 <h3 className="text-lg font-bold text-white mb-4">Hot Discussions</h3>
                 <ul className="space-y-3">
                    <li className="text-sm text-gray-300 hover:text-white cursor-pointer hover:underline underline-offset-4 decoration-primary/50">
                        🎧 2024년 최고의 K-Pop 데뷔는?
                    </li>
                     <li className="text-sm text-gray-300 hover:text-white cursor-pointer hover:underline underline-offset-4 decoration-primary/50">
                        💿 바이닐(LP) 수집 팁 공유해요
                    </li>
                     <li className="text-sm text-gray-300 hover:text-white cursor-pointer hover:underline underline-offset-4 decoration-primary/50">
                        🎸 인디 밴드 공연 추천 (홍대/합정)
                    </li>
                 </ul>
                 <button className="mt-6 w-full py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-bold rounded-lg transition-colors border border-indigo-500/20">
                    토론 참여하기
                 </button>
            </div>

        </div>

      </div>
    </div>
  );
};

export default Community;
