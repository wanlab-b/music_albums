import React from 'react';
import { MOCK_ALBUMS } from '../constants';
import AlbumCard from '../components/AlbumCard';
import { Calendar, Filter, ChevronRight } from 'lucide-react';

const NewReleases: React.FC = () => {
  // Mock grouping for demonstration
  // In a real app, this would be grouped dynamically by releaseDate
  const thisWeek = MOCK_ALBUMS.slice(0, 6);
  const lastWeek = MOCK_ALBUMS.slice(2, 8);
  const upcoming = MOCK_ALBUMS.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/10 pb-8">
        <div>
          <h1 className="text-4xl font-black text-white mb-2 flex items-center gap-3">
            <span className="bg-primary/20 text-primary p-2 rounded-lg"><Calendar className="w-8 h-8" /></span>
            New Releases
          </h1>
          <p className="text-gray-400 max-w-2xl mt-2">
            이번 주 발매된 따끈따끈한 신작 앨범들을 날짜별로 확인하세요. 
            전 세계 평단과 리스너들의 주목을 받는 앨범들을 가장 먼저 만나보세요.
          </p>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-dark-card border border-white/10 hover:bg-white/5 hover:border-white/30 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
                <Filter className="w-4 h-4 text-gray-400"/>
                <span>Filter Genre</span>
            </button>
            <div className="h-8 w-px bg-white/10 mx-1"></div>
            <select className="bg-dark-card border border-white/10 text-white text-sm rounded-lg px-3 py-2.5 outline-none focus:border-primary hover:bg-white/5 cursor-pointer">
                <option>All Regions</option>
                <option>Domestic (KR)</option>
                <option>International</option>
            </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Main Content: Release Lists */}
        <div className="lg:col-span-3 space-y-16">
            
            {/* Section: This Week */}
            <section>
                <div className="flex items-center gap-4 mb-8">
                    <div className="flex flex-col items-center justify-center bg-white/5 border border-white/10 rounded-xl w-16 h-16 shadow-lg">
                        <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider">Feb</span>
                        <span className="text-2xl font-bold text-white">23</span>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">This Week</h2>
                        <span className="text-sm text-gray-500">6 new albums</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {thisWeek.map(album => (
                        <AlbumCard key={`this-week-${album.id}`} album={album} />
                    ))}
                </div>
            </section>

            {/* Section: Last Week */}
            <section>
                 <div className="flex items-center gap-4 mb-8">
                    <div className="flex flex-col items-center justify-center bg-white/5 border border-white/10 rounded-xl w-16 h-16 shadow-lg">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Feb</span>
                        <span className="text-2xl font-bold text-white">16</span>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Last Week</h2>
                        <span className="text-sm text-gray-500">6 new albums</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {lastWeek.map(album => (
                        <AlbumCard key={`last-week-${album.id}`} album={album} />
                    ))}
                </div>
            </section>

        </div>

        {/* Sidebar */}
        <div className="hidden lg:block lg:col-span-1 pl-6 border-l border-white/5">
            <div className="sticky top-24 space-y-8">
                {/* Featured Upcoming */}
                <div>
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center justify-between">
                        <span>Coming Soon</span>
                        <span className="text-xs text-primary font-medium cursor-pointer hover:underline">View Calendar</span>
                    </h3>
                    <div className="space-y-4">
                        {upcoming.map((album, i) => (
                            <div key={`upcoming-${i}`} className="flex gap-3 group cursor-pointer hover:bg-white/5 p-2 rounded-lg -mx-2 transition-colors">
                                <div className="w-12 h-12 bg-gray-800 rounded-md overflow-hidden flex-shrink-0 relative">
                                    <img src={album.coverUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white bg-black/30 backdrop-blur-[1px]">
                                        Mar 0{i + 1}
                                    </div>
                                </div>
                                <div className="min-w-0 flex flex-col justify-center">
                                    <h4 className="text-sm font-bold text-gray-200 truncate group-hover:text-primary transition-colors">{album.title}</h4>
                                    <p className="text-xs text-gray-500 truncate">{album.artist}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Genres */}
                <div>
                     <h3 className="text-lg font-bold text-white mb-4">Popular Genres</h3>
                     <div className="flex flex-wrap gap-2">
                        {['K-Pop', 'Pop', 'Hip Hop', 'R&B', 'Rock', 'Electronic'].map(g => (
                            <span key={g} className="px-3 py-1 bg-dark-card border border-white/10 rounded-full text-xs text-gray-400 hover:text-white hover:border-white/30 cursor-pointer transition-colors">
                                {g}
                            </span>
                        ))}
                     </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default NewReleases;