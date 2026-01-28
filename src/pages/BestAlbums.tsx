import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Filter, ChevronDown, Check, Disc, Music2, Loader2 } from 'lucide-react';
import { getAllAlbums } from '../services/albumService';
import { Album } from '../types';

const BestAlbums: React.FC = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  // State for view mode
  const [viewType, setViewType] = useState<'albums' | 'songs'>('albums');

  // State for filters
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [selectedSort, setSelectedSort] = useState<string>('Highest Rated');
  
  // State for dropdown visibility
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // State for pagination
  const [visibleCount, setVisibleCount] = useState<number>(10);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchAlbums = async () => {
      setLoading(true);
      const data = await getAllAlbums();
      setAlbums(data);
      setLoading(false);
    };
    fetchAlbums();
  }, []);

  // Extract unique years
  const years = useMemo(() => {
    const uniqueYears = Array.from(new Set(albums.map((a) => a.releaseDate.substring(0, 4)))); // Extract YYYY
    return ['All', ...uniqueYears.sort().reverse()] as string[];
  }, [albums]);

  // Extract unique genres
  const genres = useMemo(() => {
    const uniqueGenres = Array.from(new Set(albums.flatMap((a) => a.genres || [])));
    return ['All', ...uniqueGenres.sort()] as string[];
  }, [albums]);

  const sortOptions = ['Highest Rated', 'Lowest Rated', 'Newest', 'Oldest'];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setVisibleCount(10);
  }, [viewType, selectedYear, selectedGenre, selectedSort]);

  // Filtering and Sorting
  const filteredAndSortedItems = useMemo(() => {
    // For now, we only have Album data. 
    // If viewType === 'songs', we could show tracks if we flattened them, 
    // but without individual track scores, it's better to stick to Albums or just map tracks to their album.
    // For simplicity in this demo, 'songs' view will just be disabled or fallback to albums for now.
    
    let result = [...albums];

    // Filter by Year
    if (selectedYear !== 'All') {
      result = result.filter(item => item.releaseDate.startsWith(selectedYear));
    }

    // Filter by Genre
    if (selectedGenre !== 'All') {
      result = result.filter(item => item.genres && item.genres.includes(selectedGenre));
    }

    // Sort
    result.sort((a, b) => {
      switch (selectedSort) {
        case 'Highest Rated':
          return b.criticScore - a.criticScore;
        case 'Lowest Rated':
          return a.criticScore - b.criticScore;
        case 'Newest':
          return b.releaseDate.localeCompare(a.releaseDate);
        case 'Oldest':
          return a.releaseDate.localeCompare(b.releaseDate);
        default:
          return 0;
      }
    });

    return result;
  }, [selectedYear, selectedGenre, selectedSort, albums]);

  const displayedItems = filteredAndSortedItems.slice(0, visibleCount);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'bg-emerald-500 text-white';
    if (score >= 70) return 'bg-yellow-500 text-white';
    return 'bg-red-500 text-white';
  };

  const getScoreColorText = (score: number) => {
    if (score >= 85) return 'text-emerald-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const DropdownMenu = ({ options, selected, onSelect }: { options: string[], selected: string, onSelect: (val: string) => void }) => (
    <div className="absolute top-full left-0 mt-2 w-48 bg-dark-card border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
      <div className="max-h-60 overflow-y-auto custom-scrollbar p-1">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => {
              onSelect(option);
              setActiveDropdown(null);
            }}
            className={`w-full text-left px-3 py-2 text-sm rounded-lg flex items-center justify-between group transition-colors ${
              selected === option 
                ? 'bg-primary/20 text-primary font-bold' 
                : 'text-gray-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            {option}
            {selected === option && <Check className="w-4 h-4" />}
          </button>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10" onClick={() => setActiveDropdown(null)}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-4">
            Best Albums {selectedYear !== 'All' ? `of ${selectedYear}` : ''}
          </h1>
          <p className="text-gray-400 max-w-2xl">
            MuzikPick 평론가 점수와 유저 평가를 종합하여 선정된 최고의 앨범 차트입니다.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div 
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10" 
        ref={dropdownRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-wrap items-center gap-3">
            {/* Year Filter */}
            <div className="relative">
            <button 
                onClick={() => toggleDropdown('year')}
                className={`flex items-center gap-2 bg-dark-card border hover:border-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeDropdown === 'year' ? 'border-primary text-white' : 'border-white/10 text-gray-300'}`}
            >
                <Filter className="w-4 h-4 text-gray-400" />
                <span>Year: <span className="text-white">{selectedYear}</span></span>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-500 ml-1 transition-transform ${activeDropdown === 'year' ? 'rotate-180' : ''}`} />
            </button>
            {activeDropdown === 'year' && (
                <DropdownMenu options={years} selected={selectedYear} onSelect={setSelectedYear} />
            )}
            </div>

            {/* Genre Filter */}
            <div className="relative">
            <button 
                onClick={() => toggleDropdown('genre')}
                className={`flex items-center gap-2 bg-dark-card border hover:border-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeDropdown === 'genre' ? 'border-primary text-white' : 'border-white/10 text-gray-300'}`}
            >
                <span>Genre: <span className="text-white">{selectedGenre}</span></span>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-500 ml-1 transition-transform ${activeDropdown === 'genre' ? 'rotate-180' : ''}`} />
            </button>
            {activeDropdown === 'genre' && (
                <DropdownMenu options={genres} selected={selectedGenre} onSelect={setSelectedGenre} />
            )}
            </div>

            {/* Sort Filter */}
            <div className="relative">
            <button 
                onClick={() => toggleDropdown('sort')}
                className={`flex items-center gap-2 bg-dark-card border hover:border-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeDropdown === 'sort' ? 'border-primary text-white' : 'border-white/10 text-gray-300'}`}
            >
                <span>Sort: <span className="text-white">{selectedSort}</span></span>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-500 ml-1 transition-transform ${activeDropdown === 'sort' ? 'rotate-180' : ''}`} />
            </button>
            {activeDropdown === 'sort' && (
                <DropdownMenu options={sortOptions} selected={selectedSort} onSelect={setSelectedSort} />
            )}
            </div>
        </div>

        {/* View Toggle (Disabled for now as we only have albums) */}
        <div className="flex items-center bg-dark-card border border-white/10 p-1 rounded-xl self-start md:self-auto opacity-50 cursor-not-allowed">
            <button className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold bg-white/10 text-white shadow-lg">
                <Disc className="w-4 h-4" />
                Albums
            </button>
        </div>
      </div>

      {/* List */}
      <div className="flex flex-col gap-4">
        {displayedItems.length > 0 ? (
          displayedItems.map((item, index) => (
            <div 
              key={item.id}
              className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4 rounded-xl bg-dark-card border border-white/5 hover:border-white/10 transition-all hover:bg-white/[0.02]"
            >
              {/* Rank & Cover */}
              <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0 w-full sm:w-auto">
                <div className="flex-shrink-0 w-8 text-center">
                  <span className="text-2xl font-bold text-gray-500 font-mono italic">
                    {index + 1}
                  </span>
                </div>
                
                <Link to={`/album/${item.id}`} className="relative block w-full sm:w-32 aspect-square rounded-lg overflow-hidden flex-shrink-0">
                  <img 
                    src={item.coverUrl} 
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </Link>
              </div>

              {/* Info */}
              <div className="flex-grow min-w-0 py-1">
                <Link to={`/album/${item.id}`} className="block">
                  <h3 className="text-xl sm:text-2xl font-bold text-white truncate mb-1 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                </Link>
                <div className="text-gray-300 font-medium mb-2 flex items-center gap-2">
                    <span>{item.artist}</span>
                </div>
                
                <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-3">
                  <span className="bg-white/5 px-2 py-1 rounded border border-white/5">{item.releaseDate}</span>
                  {item.genres.map((g: string) => (
                      <span key={g} className="bg-white/5 px-2 py-1 rounded border border-white/5">{g}</span>
                  ))}
                </div>
              </div>

              {/* Scores */}
              <div className="flex sm:flex-col items-center gap-6 sm:gap-3 w-full sm:w-auto justify-end sm:justify-center mt-2 sm:mt-0 pl-12 sm:pl-0 border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0">
                 <div className="flex flex-col items-center min-w-[60px]">
                    <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1">Critic</span>
                    <div className={`w-12 h-12 flex items-center justify-center rounded-full text-lg font-bold shadow-lg ${getScoreColor(item.criticScore)}`}>
                      {item.criticScore}
                    </div>
                 </div>
                 
                 <div className="hidden sm:block w-px h-8 bg-white/10 my-1"></div>

                 <div className="flex flex-col items-center min-w-[60px]">
                    <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1">User</span>
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-dark-bg border border-white/10">
                       <span className={`text-lg font-bold ${getScoreColorText(item.userScore)}`}>{item.userScore}</span>
                    </div>
                 </div>
              </div>

            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-dark-card rounded-xl border border-white/5">
            <p className="text-gray-400 text-lg">조건에 맞는 앨범이 없습니다.</p>
            <button 
              onClick={() => {
                setSelectedYear('All');
                setSelectedGenre('All');
                setSelectedSort('Highest Rated');
              }}
              className="mt-4 text-primary hover:underline"
            >
              필터 초기화
            </button>
          </div>
        )}
      </div>

      {visibleCount < filteredAndSortedItems.length && (
        <div className="mt-12 text-center">
          <button 
            onClick={() => setVisibleCount(prev => prev + 10)}
            className="px-8 py-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-full text-sm font-medium transition-colors border border-white/5"
          >
              더 보기
          </button>
        </div>
      )}
    </div>
  );
};

export default BestAlbums;
