import React from 'react';
import { MOCK_ALBUMS } from '../constants';
import AlbumCard from '../components/AlbumCard';
import { Compass, ChevronDown, Tag, Calendar, TrendingUp, Mic2, Heart, Flame, Sparkles, Radio } from 'lucide-react';

const Discover: React.FC = () => {
  // Simulate different datasets for UI variety
  // 1. Popular Now: Random slice or high total score
  const popularNow = [...MOCK_ALBUMS].sort(() => 0.5 - Math.random()).slice(0, 6);
  
  // 2. Highly Anticipated: Mock future releases (reusing existing data for UI)
  const highlyAnticipated = [...MOCK_ALBUMS].slice(0, 6);
  
  // 3. Under the Radar: High Critic Score but maybe niche genres or random selection
  const underTheRadar = MOCK_ALBUMS.filter(a => a.criticScore >= 80).reverse().slice(0, 6);

  // 4. Must Listen (Critics)
  const mustListen = MOCK_ALBUMS.filter(a => a.criticScore >= 85).slice(0, 6);
  
  // 5. User Favorites
  const userFavorites = MOCK_ALBUMS.filter(a => a.userScore >= 85).slice(0, 6);
  
  const genres = ['K-Pop', 'R&B', 'Hip Hop', 'Indie Rock', 'Pop', 'Electronic', 'Jazz', 'Alternative'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <Compass className="w-8 h-8 text-primary" />
            Discover Music
          </h1>
          <p className="text-gray-400 mt-2">
            취향에 맞는 새로운 음악을 발견해보세요.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {['장르', '연도', '형태', '국가'].map((filter) => (
            <button key={filter} className="flex items-center gap-2 bg-dark-card border border-white/10 hover:border-white/30 hover:bg-white/5 text-gray-300 px-4 py-2 rounded-full text-sm font-medium transition-all">
              {filter}
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-12">
          
          {/* Section: Popular Now */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                지금 뜨는 앨범 (Popular Now)
              </h2>
              <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">전체보기</a>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {popularNow.map((album) => (
                <AlbumCard key={`pop-${album.id}`} album={album} />
              ))}
            </div>
          </section>

          {/* Section: Highly Anticipated */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                발매 예정 기대작 (Highly Anticipated)
              </h2>
              <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">전체보기</a>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {highlyAnticipated.map((album) => (
                <AlbumCard key={`anti-${album.id}`} album={album} />
              ))}
            </div>
          </section>

           {/* Section: Under the Radar */}
           <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Radio className="w-5 h-5 text-indigo-400" />
                숨겨진 명반 (Under the Radar)
              </h2>
              <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">전체보기</a>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {underTheRadar.map((album) => (
                <AlbumCard key={`radar-${album.id}`} album={album} />
              ))}
            </div>
          </section>

          {/* Banner */}
          <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900 to-indigo-900 border border-white/10">
             <div className="absolute top-0 right-0 p-12 opacity-10 transform translate-x-10 -translate-y-10">
                <Mic2 className="w-64 h-64 text-white" />
             </div>
             <div className="p-8 md:p-12 relative z-10">
                <span className="inline-block px-3 py-1 bg-white/10 rounded text-xs font-bold text-indigo-200 mb-4 border border-white/10">CURATED PLAYLIST</span>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Hidden Gems: 놓치면 안 될 인디 음악</h3>
                <p className="text-indigo-200 max-w-lg mb-8 leading-relaxed">
                   대중적인 차트 뒤에 숨겨진 보석 같은 앨범들을 모았습니다. 
                   독창적인 사운드와 깊이 있는 가사를 만나보세요.
                </p>
                <button className="bg-white text-indigo-900 px-6 py-3 rounded-full font-bold text-sm hover:bg-gray-100 transition-colors">
                   플레이리스트 확인하기
                </button>
             </div>
          </section>

          {/* Section: Must Listen (Critics) */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                평론가들의 극찬 (Must Listen)
              </h2>
              <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">전체보기</a>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {mustListen.map((album) => (
                <AlbumCard key={`must-${album.id}`} album={album} />
              ))}
            </div>
          </section>

          {/* Section: User Favorites */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-500" />
                사용자들의 극찬 (User Favorites)
              </h2>
              <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">전체보기</a>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {userFavorites.map((album) => (
                <AlbumCard key={`fav-${album.id}`} album={album} />
              ))}
            </div>
          </section>

        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-10">
          
          {/* Genre Cloud */}
          <div className="bg-dark-card rounded-xl p-6 border border-white/5">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Tag className="w-4 h-4 text-primary" />
              장르별 탐색
            </h3>
            <div className="flex flex-wrap gap-2">
              {genres.map(genre => (
                <button 
                  key={genre}
                  className="px-3 py-1.5 bg-white/5 hover:bg-primary hover:text-white text-gray-400 text-xs rounded-lg transition-colors border border-white/5"
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          {/* Upcoming Releases (Mock) */}
          <div className="bg-dark-card rounded-xl p-6 border border-white/5">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-500" />
              발매 예정 (Upcoming)
            </h3>
            <ul className="space-y-4">
              {[
                { artist: 'IU', album: 'The Winning', date: 'Feb 20' },
                { artist: 'Ariana Grande', album: 'Eternal Sunshine', date: 'Mar 08' },
                { artist: 'Dua Lipa', album: 'Training Season', date: 'TBA' },
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 group cursor-pointer">
                  <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center text-xs font-bold text-gray-500 border border-white/5 group-hover:border-primary/50 transition-colors">
                    {item.date.split(' ')[0]}
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-sm font-bold text-white truncate group-hover:text-primary transition-colors">{item.album}</h4>
                    <p className="text-xs text-gray-500 truncate">{item.artist}</p>
                  </div>
                </li>
              ))}
            </ul>
            <button className="w-full mt-6 text-xs text-center text-gray-500 hover:text-white transition-colors">
                캘린더 전체 보기
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Discover;