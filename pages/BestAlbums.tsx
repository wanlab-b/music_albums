import React, { useState, useMemo, useEffect, useRef } from 'react';
import { MOCK_ALBUMS } from '../constants';
import { Link } from 'react-router-dom';
import { Filter, ChevronDown, Check, Disc, Music2 } from 'lucide-react';

// Mock Data for Songs (Extended for this view)
const MOCK_SONGS = [
  { id: 's1', title: 'Super Shy', artist: 'NewJeans', album: 'Get Up', albumId: '1', coverUrl: 'https://picsum.photos/400/400?random=1', criticScore: 94, userScore: 96, releaseDate: '2023-07-21', genres: ['K-Pop', 'UK Garage'] },
  { id: 's2', title: 'Kill Bill', artist: 'SZA', album: 'SOS', albumId: '2', coverUrl: 'https://picsum.photos/400/400?random=2', criticScore: 92, userScore: 89, releaseDate: '2022-12-09', genres: ['R&B'] },
  { id: 's3', title: 'Queencard', artist: '(G)I-DLE', album: 'I Feel', albumId: '3', coverUrl: 'https://picsum.photos/400/400?random=3', criticScore: 88, userScore: 85, releaseDate: '2023-05-15', genres: ['K-Pop'] },
  { id: 's4', title: 'Anti-Hero', artist: 'Taylor Swift', album: 'Midnights', albumId: '4', coverUrl: 'https://picsum.photos/400/400?random=4', criticScore: 87, userScore: 84, releaseDate: '2022-10-21', genres: ['Synth-pop'] },
  { id: 's5', title: 'Seven', artist: 'Jung Kook', album: 'Golden', albumId: '6', coverUrl: 'https://picsum.photos/400/400?random=6', criticScore: 86, userScore: 98, releaseDate: '2023-11-03', genres: ['Pop'] },
  { id: 's6', title: 'vampire', artist: 'Olivia Rodrigo', album: 'GUTS', albumId: '8', coverUrl: 'https://picsum.photos/400/400?random=8', criticScore: 91, userScore: 90, releaseDate: '2023-09-08', genres: ['Pop Rock'] },
  { id: 's7', title: 'Ditto', artist: 'NewJeans', album: 'Get Up', albumId: '1', coverUrl: 'https://picsum.photos/400/400?random=1', criticScore: 95, userScore: 98, releaseDate: '2022-12-19', genres: ['K-Pop'] },
  { id: 's8', title: 'Cupid', artist: 'FIFTY FIFTY', album: 'The Beginning', albumId: '99', coverUrl: 'https://picsum.photos/400/400?random=9', criticScore: 85, userScore: 88, releaseDate: '2023-02-24', genres: ['K-Pop'] },
];

const BestAlbums: React.FC = () => {
  // State for view mode
  const [viewType, setViewType] = useState<'albums' | 'songs'>('albums');

  // State for filters
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [selectedSort, setSelectedSort] = useState<string>('Highest Rated');
  
  // State for dropdown visibility
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  // Refs for click outside handling
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Extract unique years and genres from data (Combining both datasets for simplicity or just using Albums as base)
  const years = useMemo(() => {
    const data = viewType === 'albums' ? MOCK_ALBUMS : MOCK_SONGS;
    const uniqueYears = Array.from(new Set(data.map(a => a.releaseDate.split('-')[0])));
    return ['All', ...uniqueYears.sort().reverse()];
  }, [viewType]);

  const genres = useMemo(() => {
    const data = viewType === 'albums' ? MOCK_ALBUMS : MOCK_SONGS;
    const uniqueGenres = Array.from(new Set(data.flatMap(a => a.genres)));
    return ['All', ...uniqueGenres.sort()];
  }, [viewType]);

  const sortOptions = ['Highest Rated', 'Lowest Rated', 'Newest', 'Oldest'];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtering and Sorting Logic
  const filteredAndSortedItems = useMemo(() => {
    // Determine which dataset to use
    let result: any[] = viewType === 'albums' ? [...MOCK_ALBUMS] : [...MOCK_SONGS];

    // Filter by Year
    if (selectedYear !== 'All') {
      result = result.filter(item => item.releaseDate.startsWith(selectedYear));
    }

    // Filter by Genre
    if (selectedGenre !== 'All') {
      result = result.filter(item => item.genres.includes(selectedGenre));
    }

    // Sort
    result.sort((a, b) => {
      switch (selectedSort) {
        case 'Highest Rated':
          return b.criticScore - a.criticScore;
        case 'Lowest Rated':
          return a.criticScore - b.criticScore;
        case 'Newest':
          return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
        case 'Oldest':
          return new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime();
        default:
          return 0;
      }
    });

    return result;
  }, [selectedYear, selectedGenre, selectedSort, viewType]);

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

  // Helper Component for Dropdown
  const DropdownMenu = ({ 
    options, 
    selected, 
    onSelect 
  }: { 
    options: string[], 
    selected: string, 
    onSelect: (val: string) => void 
  }) => (
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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10" onClick={() => setActiveDropdown(null)}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-4">
            Best {viewType === 'albums' ? 'Albums' : 'Songs'} {selectedYear !== 'All' ? `of ${selectedYear}` : ''}
          </h1>
          <p className="text-gray-400 max-w-2xl">
            MuzikPick 평론가 점수와 유저 평가를 종합하여 선정된 최고의 {viewType === 'albums' ? '앨범' : '노래'} 차트입니다.
          </p>
        </div>
      </div>

      {/* Toolbar: Filters and View Toggle */}
      <div 
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10" 
        ref={dropdownRef}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the toolbar
      >
        {/* Filters */}
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

        {/* View Toggle */}
        <div className="flex items-center bg-dark-card border border-white/10 p-1 rounded-xl self-start md:self-auto">
            <button 
                onClick={() => setViewType('albums')}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                    viewType === 'albums' 
                    ? 'bg-white/10 text-white shadow-lg' 
                    : 'text-gray-400 hover:text-white'
                }`}
            >
                <Disc className="w-4 h-4" />
                Albums
            </button>
            <button 
                onClick={() => setViewType('songs')}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                    viewType === 'songs' 
                    ? 'bg-white/10 text-white shadow-lg' 
                    : 'text-gray-400 hover:text-white'
                }`}
            >
                <Music2 className="w-4 h-4" />
                Songs
            </button>
        </div>
      </div>

      {/* List */}
      <div className="flex flex-col gap-4">
        {filteredAndSortedItems.length > 0 ? (
          filteredAndSortedItems.map((item, index) => (
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
                
                <Link to={viewType === 'albums' ? `/album/${item.id}` : `/album/${(item as any).albumId}`} className="relative block w-full sm:w-32 aspect-square rounded-lg overflow-hidden flex-shrink-0">
                  <img 
                    src={item.coverUrl} 
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {viewType === 'songs' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center text-white">
                             <Music2 className="w-5 h-5 fill-current" />
                          </div>
                      </div>
                  )}
                </Link>
              </div>

              {/* Info */}
              <div className="flex-grow min-w-0 py-1">
                <Link to={viewType === 'albums' ? `/album/${item.id}` : `/album/${(item as any).albumId}`} className="block">
                  <h3 className="text-xl sm:text-2xl font-bold text-white truncate mb-1 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                </Link>
                <div className="text-gray-300 font-medium mb-2 flex items-center gap-2">
                    <span>{item.artist}</span>
                    {viewType === 'songs' && (
                        <>
                            <span className="text-gray-600">•</span>
                            <span className="text-gray-500 text-sm">{(item as any).album}</span>
                        </>
                    )}
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
            <p className="text-gray-400 text-lg">조건에 맞는 {viewType === 'albums' ? '앨범이' : '노래가'} 없습니다.</p>
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

      {filteredAndSortedItems.length > 0 && (
        <div className="mt-12 text-center">
          <button className="px-8 py-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-full text-sm font-medium transition-colors border border-white/5">
              더 보기
          </button>
        </div>
      )}
    </div>
  );
};

export default BestAlbums;