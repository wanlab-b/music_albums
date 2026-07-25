import React, { useEffect, useMemo, useState } from 'react';
import { Users, MessageSquare, Star, Trophy, UserPlus, Heart, TrendingUp, Music, Radio } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getRecentReviews } from '@/services/reviewService';
import { getAllAlbums } from '@/services/albumService';
import { Album, Review } from '@/types';
import { Loader2 } from 'lucide-react';
import { trackContentSelection } from '@/analytics';

const genreToSlug = (name: string) => {
  return name.toLowerCase().replace(/, /g, '-').replace(/ /g, '-');
};

const Community: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [reviewData, albumData] = await Promise.all([getRecentReviews(40), getAllAlbums()]);
      setReviews(reviewData);
      setAlbums(albumData);
      setLoading(false);
    };
    fetchData();
  }, []);

  const albumMap = useMemo(() => {
    const map = new Map<string, Album>();
    albums.forEach((album) => map.set(album.id, album));
    return map;
  }, [albums]);

  const avatarFor = (name: string, url?: string) => {
    if (url && url.trim().length > 0) return url;
    return `https://picsum.photos/seed/${encodeURIComponent(name)}/100/100`;
  };

  const activities = useMemo(() => {
    return reviews.map((review) => {
      const album = review.albumId ? albumMap.get(review.albumId) : undefined;
      const target = album ? `${album.artist} - ${album.title}` : "앨범 리뷰";
      return {
        id: review.id,
        user: review.username,
        userAvatar: avatarFor(review.username, review.avatarUrl),
        action: "reviewed",
        target,
        rating: review.rating,
        time: review.date,
        content: review.content
      };
    });
  }, [reviews, albumMap]);

  const topUsers = useMemo(() => {
    const counts = new Map<string, { name: string; avatar?: string; reviews: number }>();
    reviews.forEach((review) => {
      const key = review.userId ?? review.username;
      const existing = counts.get(key);
      if (existing) {
        existing.reviews += 1;
      } else {
        counts.set(key, { name: review.username, avatar: review.avatarUrl, reviews: 1 });
      }
    });
    return [...counts.entries()]
      .map(([key, value]) => ({
        id: key,
        name: value.name,
        avatar: value.avatar,
        reviews: value.reviews,
        level: value.reviews >= 20 ? "Expert" : value.reviews >= 10 ? "Pro" : "Rookie"
      }))
      .sort((a, b) => b.reviews - a.reviews)
      .slice(0, 4);
  }, [reviews]);

  const topComments = useMemo(() => {
    return reviews
      .filter((review) => review.content)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 4)
      .map((review) => {
        const album = review.albumId ? albumMap.get(review.albumId) : undefined;
        const target = album ? `${album.artist} - ${album.title}` : "앨범 리뷰";
        return {
          id: review.id,
          user: review.username,
        avatar: avatarFor(review.username, review.avatarUrl),
          target,
          content: review.content,
          rating: review.rating
        };
      });
  }, [reviews, albumMap]);

  const genreBoards = [
    { id: 'g1', name: 'Ballad', match: ['발라드'], color: 'from-purple-500/20 to-indigo-500/10' },
    { id: 'g2', name: 'Dance, Pop', match: ['댄스', '팝'], color: 'from-red-500/20 to-pink-500/10' },
    { id: 'g3', name: 'Folk, Blues', match: ['포크', '블루스'], color: 'from-blue-500/20 to-cyan-500/10' },
    { id: 'g4', name: 'Idol', match: ['아이돌'], color: 'from-yellow-500/20 to-orange-500/10' },
    { id: 'g5', name: 'Rap, Hip Hop', match: ['랩', '힙합'], color: 'from-green-500/20 to-emerald-500/10' },
    { id: 'g6', name: 'R&B, Soul', match: ['R&B', '알앤비', '소울'], color: 'from-rose-500/20 to-purple-500/10' },
    { id: 'g7', name: 'Rock, Metal', match: ['록', '락', '메탈'], color: 'from-gray-500/20 to-slate-500/10' },
    { id: 'g8', name: 'Jazz', match: ['재즈'], color: 'from-amber-500/20 to-yellow-500/10' },
    { id: 'g9', name: 'Indie', match: ['인디'], color: 'from-teal-500/20 to-sky-500/10' },
  ];

  const normalizeGenres = (genres: string[]): string[] => {
    const parts: string[] = [];
    genres.forEach((g) => {
      g.split(/[,/]/).forEach((piece) => {
        const trimmed = piece.trim();
        if (trimmed) parts.push(trimmed);
      });
    });
    return parts;
  };

  const genreStats = useMemo(() => {
    const albumGenres = new Map<string, string[]>();
    albums.forEach((album) => {
      albumGenres.set(album.id, normalizeGenres(album.genres || []));
    });

    return genreBoards.map((board) => {
      const albumIds = albums
        .filter((album) => {
          const normalized = normalizeGenres(album.genres || []);
          return board.match.some((token) =>
            normalized.some((g) => g.toLowerCase().includes(token.toLowerCase()))
          );
        })
        .map((album) => album.id);

      const reviewCount = reviews.filter((review) => review.albumId && albumIds.includes(review.albumId)).length;
      return {
        ...board,
        threads: albumIds.length,
        postsToday: reviewCount
      };
    });
  }, [albums, reviews]);

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
                <span className="block text-2xl font-bold text-white">{new Set(reviews.map((r) => r.userId ?? r.username)).size}</span>
                <span className="text-xs text-gray-500 uppercase font-medium">Members</span>
            </div>
            <div className="bg-dark-card border border-white/10 px-6 py-3 rounded-xl text-center">
                <span className="block text-2xl font-bold text-primary">{reviews.length}</span>
                <span className="text-xs text-gray-500 uppercase font-medium">Reviews</span>
            </div>
        </div>
      </div>

      {loading ? (
        <div className="flex h-[50vh] items-center justify-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Main Content: Genre Boards + Activity Feed */}
        <div className="lg:col-span-2 space-y-10">
            <div className="bg-dark-card/60 border border-white/5 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Radio className="w-5 h-5 text-primary" />
                        장르별 게시판
                    </h2>
                    <Link
                      to="/genres"
                      onClick={() =>
                        trackContentSelection({
                          contentType: 'genre_directory',
                          contentId: 'all_genres',
                          destinationPath: '/genres',
                          component: 'Community',
                          pageSection: 'genre-boards',
                        })
                      }
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      전체보기
                    </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {genreStats.map((board) => (
                        <Link
                            to={`/community/${genreToSlug(board.name)}`}
                            key={board.id}
                            onClick={() => {
                              const genreSlug = genreToSlug(board.name);
                              trackContentSelection({
                                contentType: 'genre_board',
                                contentId: genreSlug,
                                destinationPath: `/community/${genreSlug}`,
                                component: 'Community',
                                pageSection: 'genre-boards',
                              });
                            }}
                            className={`text-left rounded-xl border border-white/10 p-4 bg-gradient-to-br ${board.color} hover:border-white/30 transition-all group`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <Music className="w-4 h-4 text-white/80" />
                                    <span className="text-sm font-bold text-white">{board.name}</span>
                                </div>
                                <span className="text-[10px] text-gray-300 bg-white/10 px-2 py-0.5 rounded-full">
                                    오늘 {board.postsToday}건
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-300">
                                <span>스레드 {board.threads.toLocaleString()}</span>
                                <span>•</span>
                                <span className="text-primary">입장하기</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-between">
                 <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    실시간 활동 (Live Feed)
                 </h2>
                 <button
                   onClick={() => window.location.reload()}
                   className="text-sm text-gray-400 hover:text-white transition-colors"
                 >
                   새로고침
                 </button>
            </div>

            <div className="space-y-4">
                {activities.length > 0 ? (
                    activities.map((activity) => (
                        <div key={activity.id} className="bg-dark-card border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors">
                            <div className="flex items-start gap-4">
                                <img src={activity.userAvatar} alt={activity.user} className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <span className="font-bold text-white hover:text-primary cursor-pointer transition-colors">{activity.user}</span>
                                        <span className="text-gray-500 text-sm">{activity.action}</span>
                                        <span className="font-medium text-gray-300 truncate">{activity.target}</span>
                                    </div>
                                    
                                    {activity.rating ? (
                                        <div className="inline-flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded text-xs font-bold text-emerald-400 mb-2">
                                            <Star className="w-3 h-3 fill-emerald-400" />
                                            {activity.rating}
                                        </div>
                                    ) : null}

                                    {activity.content ? (
                                        <p className="text-gray-300 text-sm leading-relaxed bg-black/20 p-3 rounded-lg border border-white/5">
                                            "{activity.content}"
                                        </p>
                                    ) : null}
                                    
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
                    ))
                ) : (
                    <div className="text-center py-10 text-gray-500">아직 등록된 활동이 없습니다.</div>
                )}
            </div>
            
            <button
              disabled
              className="w-full py-4 bg-white/5 border border-white/5 rounded-xl text-gray-500 text-sm font-medium opacity-60 cursor-not-allowed"
            >
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
                    <Link
                      to="/community/reviewer-of-the-month"
                      onClick={() =>
                        trackContentSelection({
                          contentType: 'community_ranking',
                          contentId: 'reviewer_of_the_month',
                          destinationPath: '/community/reviewer-of-the-month',
                          component: 'Community',
                          pageSection: 'top-reviewers',
                        })
                      }
                      className="text-xs text-gray-500 hover:text-white"
                    >
                      전체보기
                    </Link>
                </div>
                
                <div className="space-y-4">
                    {topUsers.length > 0 ? (
                        topUsers.map((user, index) => (
                            <Link
                              to={`/user/${user.id}`}
                              key={user.id}
                              onClick={() =>
                                trackContentSelection({
                                  contentType: 'reviewer_profile',
                                  contentId: `rank_${index + 1}`,
                                  destinationPath: '/user/:userId',
                                  component: 'Community',
                                  pageSection: 'top-reviewers',
                                })
                              }
                              className="flex items-center gap-4 group"
                            >
                                <div className="relative">
                                    <img src={avatarFor(user.name, user.avatar)} alt={user.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-white/5 group-hover:ring-primary/50 transition-all" />
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
                            </Link>
                        ))
                    ) : (
                        <div className="text-center py-6 text-gray-500 text-sm">리뷰 데이터가 없습니다.</div>
                    )}
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
                    {topComments.length > 0 ? (
                        topComments.map((comment, index) => (
                            <div key={comment.id} className="flex items-start gap-3">
                                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/5 text-xs font-bold text-white">
                                    {index + 1}
                                </div>
                                <img src={avatarFor(comment.user, comment.avatar)} alt={comment.user} className="w-9 h-9 rounded-full object-cover ring-2 ring-white/5" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm font-bold text-white truncate">{comment.user}</span>
                                        <span className="text-[10px] text-gray-500 truncate">on {comment.target}</span>
                                    </div>
                                    <p className="text-xs text-gray-300 leading-relaxed line-clamp-2">
                                        “{comment.content}”
                                    </p>
                                    <div className="mt-2 inline-flex items-center gap-1 text-[10px] text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded-full">
                                        <Star className="w-3 h-3 fill-rose-400" />
                                        평점 {comment.rating}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-6 text-gray-500 text-sm">댓글 데이터가 없습니다.</div>
                    )}
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
      )}
    </div>
  );
};

export default Community;
