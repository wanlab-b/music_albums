import React from 'react';
import { MOCK_ALBUMS } from '../constants';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

const Genres: React.FC = () => {
  // Use MOCK_ALBUMS duplicated to ensure enough content for 5x2 grid
  // Sort by criticScore descending (Highest Rated first)
  const displayAlbums = [...MOCK_ALBUMS, ...MOCK_ALBUMS]
    .sort((a, b) => b.criticScore - a.criticScore)
    .slice(0, 12);

  // Helper for the AOTY style score bar - Compacted
  const ScoreBar = ({ score, count }: { score: number; count: number }) => {
    const isHigh = score >= 85;
    const isMed = score >= 70 && score < 85;
    const colorClass = isHigh ? 'bg-emerald-500' : isMed ? 'bg-yellow-500' : 'bg-red-500';
    const textClass = isHigh ? 'text-emerald-500' : isMed ? 'text-yellow-500' : 'text-red-500';

    return (
      <div className="flex items-center gap-2 mt-1.5">
        <span className={`text-base font-bold ${textClass} min-w-[20px]`}>{score}</span>
        <div className="flex-1 flex flex-col justify-center">
            <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
                <div className={`h-full ${colorClass}`} style={{ width: `${score}%` }}></div>
            </div>
            <span className="text-[10px] text-gray-500 mt-0.5 font-medium">critic score ({count})</span>
        </div>
      </div>
    );
  };

  const GenreSection = ({ title }: { title: string }) => (
    <div className="mb-10">
      <div className="flex items-end justify-between border-b border-white/10 pb-2 mb-6">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider">{title}</h2>
        <button className="text-xs font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-wide">View More</button>
      </div>
      
      {/* 
        Grid Layout Adjustment: 
        - 6 items per row on large screens (lg)
        - Reduced gap to make it compact 
      */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-6">
        {displayAlbums.map((album, idx) => (
          <div key={`${title}-${album.id}-${idx}`} className="group flex flex-col">
            <Link to={`/album/${album.id}`} className="relative aspect-square mb-2 overflow-hidden shadow-lg bg-gray-900">
                <img 
                  src={album.coverUrl} 
                  alt={album.title} 
                  className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-80"
                  loading="lazy"
                />
                {/* Purple star/ribbon for the highest rated item (first item after sort) */}
                {idx === 0 && (
                   <div className="absolute top-0 right-0 p-1">
                      <Star className="w-4 h-4 text-purple-500 fill-purple-500 drop-shadow-md" />
                   </div>
                )}
            </Link>
            
            <div className="flex flex-col">
                <Link to={`/album/${album.id}`} className="block">
                    <h3 className="text-xs font-bold text-white truncate leading-tight group-hover:underline decoration-white/30 underline-offset-2">
                        {album.title}
                    </h3>
                </Link>
                <p className="text-[11px] text-gray-400 truncate mt-0.5">{album.artist}</p>
                
                {/* AOTY Style Score Bar */}
                <ScoreBar score={album.criticScore} count={Math.floor(Math.random() * 30) + 5} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-dark-bg">
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content - Left Side */}
            <div className="flex-1 min-w-0">
                <GenreSection title="Rock" />
                <GenreSection title="Pop" />
                <GenreSection title="Hip Hop" />
                <GenreSection title="Electronic" />
                
                {/* Extra Links Section */}
                <div className="mt-8 border-t border-white/10 pt-4">
                     <h3 className="text-sm font-bold text-white uppercase mb-4">All Genres</h3>
                     <div className="flex flex-wrap gap-2">
                        {['Indie Rock', 'Folk', 'R&B', 'Soul', 'Metal', 'Punk', 'Jazz', 'Ambient'].map(g => (
                            <button key={g} className="px-3 py-1 bg-dark-card border border-white/10 hover:border-white/30 text-xs text-gray-400 hover:text-white transition-colors">
                                {g}
                            </button>
                        ))}
                     </div>
                </div>
            </div>

            {/* Right Sidebar (Ads) - Right Side */}
            <div className="hidden lg:block w-[300px] flex-shrink-0">
                <div className="space-y-8">
                     {/* Ad Placeholder (Hilton Style) */}
                     <div className="relative w-full h-[500px] overflow-hidden group bg-gray-900">
                         <img 
                            src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1000&auto=format&fit=crop"
                            alt="Ad Background"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
                         />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                         
                         {/* Content Overlay */}
                         <div className="absolute inset-0 flex flex-col justify-between p-6">
                            <h3 className="text-3xl font-serif text-white font-light leading-tight drop-shadow-md pt-4">
                                꿈꿀 때.
                            </h3>
                            
                            <div className="space-y-3">
                                <div className="bg-white/95 backdrop-blur p-4 text-center shadow-xl">
                                     <h4 className="text-xl font-serif text-gray-900">Hilton</h4>
                                     <p className="text-[9px] tracking-[0.2em] text-gray-600 mt-1 uppercase">For the Stay</p>
                                </div>
                                <button className="w-full bg-white text-gray-900 py-3 text-xs font-bold hover:bg-gray-100 transition-colors shadow-lg">
                                    지금 예약하기
                                </button>
                                <div className="flex items-center justify-center gap-1.5 text-white/90 text-[10px] drop-shadow pt-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                                    콘래드 항저우
                                </div>
                            </div>
                         </div>
                     </div>

                     {/* Second Ad Slot */}
                      <div className="bg-dark-card border border-white/5 p-4 flex flex-col items-center justify-center text-center h-64">
                          <span className="text-[10px] text-gray-600 uppercase mb-2">Advertisement</span>
                          <div className="w-full h-full bg-white/5 flex items-center justify-center text-gray-500 text-xs">
                              Google Ad
                          </div>
                      </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Genres;