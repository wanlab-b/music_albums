import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AlbumCard from '@/components/AlbumCard';
import { getAllAlbums } from '@/services/albumService';
import { Album } from '@/types';
import {
  trackContentSelection,
  trackFeaturedAlbumListSelection,
  trackItemListView,
} from '@/analytics';
import { ArrowRight, Flame, Calendar, Star, Loader2 } from 'lucide-react';

const Home: React.FC = () => {
  const location = useLocation();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlbums = async () => {
      const data = await getAllAlbums();
      setAlbums(data);
      setLoading(false);
    };
    fetchAlbums();
  }, []);

  // Show 6 albums per row (Trending: sorted by critic score)
  const trendingAlbums = [...albums]
    .sort((a, b) => b.criticScore - a.criticScore)
    .slice(0, 6);
    
  // New Releases: sorted by release date (simplified string comparison for YYYY.MM.DD)
  const newReleases = [...albums]
    .sort((a, b) => b.releaseDate.localeCompare(a.releaseDate))
    .slice(0, 6);

  useEffect(() => {
    if (loading) return;

    const toAnalyticsItem = (album: Album) => ({
      id: album.id,
      title: album.title,
      artist: album.artist,
      genre: album.genres[0],
    });

    trackItemListView({
      itemListId: 'home_trending',
      itemListName: 'Home Trending',
      items: trendingAlbums.map(toAnalyticsItem),
      navigationKey: location.key,
      component: 'Home',
    });
    trackItemListView({
      itemListId: 'home_new_releases',
      itemListName: 'Home New Releases',
      items: newReleases.map(toAnalyticsItem),
      navigationKey: location.key,
      component: 'Home',
    });
  }, [loading, location.key]);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12 pb-12">
      {/* Hero / Featured Section */}
      <section className="relative h-[320px] sm:h-[360px] w-full overflow-hidden rounded-3xl mt-6 mx-auto max-w-7xl">
        <div className="absolute inset-0">
          <img 
            src="https://picsum.photos/1200/600?random=hero" 
            alt="Hero" 
            className="h-full w-full object-cover filter brightness-50"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-8 sm:p-12 w-full max-w-3xl">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-white uppercase bg-primary rounded-full">
            Featured Album
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
            올해의 사운드를<br/>정의하는 명반들
          </h1>
          <p className="text-gray-300 text-lg mb-6 max-w-xl">
            MuzikPick 에디터들이 선정한 이번 달 필청 앨범들을 확인해보세요.
            트렌디한 팝부터 인디 록까지.
          </p>
          <Link
            to="/best-albums"
            id="home-featured-album-list"
            data-testid="home-featured-album-list"
            onClick={() => trackFeaturedAlbumListSelection()}
            className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors"
          >
            리스트 확인하기 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Trending Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Flame className="w-6 h-6 text-orange-500" />
              <h2 className="text-2xl font-bold text-white">실시간 트렌딩</h2>
            </div>
            <Link
              to="/discover"
              onClick={() => trackContentSelection({
                contentType: 'album_list',
                contentId: 'home_trending',
                destinationPath: '/discover',
                component: 'Home',
                pageSection: 'home_trending',
              })}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              더보기
            </Link>
          </div>
          {trendingAlbums.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {trendingAlbums.map((album, index) => (
                <AlbumCard
                  key={album.id}
                  album={album}
                  rank={index + 1}
                  index={index}
                  itemListId="home_trending"
                  itemListName="Home Trending"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">데이터가 없습니다.</div>
          )}
        </section>

        {/* New Releases Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-white">최신 발매</h2>
            </div>
            <Link
              to="/new-releases"
              onClick={() => trackContentSelection({
                contentType: 'album_list',
                contentId: 'home_new_releases',
                destinationPath: '/new-releases',
                component: 'Home',
                pageSection: 'home_new_releases',
              })}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              더보기
            </Link>
          </div>
          {newReleases.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {newReleases.map((album, index) => (
                <AlbumCard
                  key={album.id}
                  album={album}
                  index={index}
                  itemListId="home_new_releases"
                  itemListName="Home New Releases"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">데이터가 없습니다.</div>
          )}
        </section>

        {/* Community Highlight Section */}
        <section className="bg-dark-card rounded-2xl p-8 border border-white/5">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                        베스트 리뷰
                    </h2>
                    <p className="text-gray-400 mb-4">이번 주 유저들에게 가장 많은 공감을 받은 리뷰입니다.</p>
                    <blockquote className="text-xl text-gray-200 italic font-medium">
                        "이 앨범은 단순한 음악이 아니라, 하나의 예술 작품이다. 모든 트랙이 유기적으로 연결되어 완벽한 서사를 만들어낸다."
                    </blockquote>
                    <p className="text-sm text-primary mt-4 font-bold">- Reviewer 'IndiePopLover' on "NewJeans"</p>
                </div>
                <div className="flex-shrink-0">
                    <Link
                      to="/community"
                      onClick={() => trackContentSelection({
                        contentType: 'community',
                        contentId: 'best_review_highlight',
                        destinationPath: '/community',
                        component: 'Home',
                        pageSection: 'community-highlight',
                      })}
                      className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white transition-colors font-medium"
                    >
                        커뮤니티로 이동
                    </Link>
                </div>
            </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
